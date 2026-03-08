import {
  createUser,
  findUserByEmail,
  getUserRoles,
} from "../model/user.model.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import pool from "../config/db.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendResetEmail } from "../utils/email.js";

export const register = async (req, res) => {
  const { full_name, email, password, role_id } = req.body;

  const passwordHash = await hashPassword(password);
  const userId = await createUser(full_name, email, passwordHash);

  await pool.query(`INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`, [
    userId,
    role_id,
  ]);
  res.status(201).json({ message: "User registered successfully" });
};

 export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  if (user.is_active === 0) {
    return res.status(403).json({
      message: "Account is deactivated. Contact admin.",
    });
  }
  const match = await comparePassword(password, user.password_hash);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const roles = await getUserRoles(user.id);
  const token = signToken({
    userId: user.id,
    email: user.email,
    roles,
  });
 
  res.json({
    token,
    user: { id: user.id, fullName: user.full_name, email: user.email, roles },
  });
};

export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const [[user]] = await pool.query(
      `SELECT id, email, full_name
       FROM users
       WHERE email = ? AND is_active = true`,
      [email]
    );

    console.log("User found:", user);

    if (!user) {
      return res.json({
        message: "If the email exists, reset instructions sent",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      `UPDATE users
       SET reset_token_hash = ?, reset_token_expiry = ?
       WHERE id = ?`,
      [hashedToken, expiry, user.id]
    );

    await sendResetEmail(user.email, rawToken, user.full_name);

    res.json({
      message: "If the email exists, reset instructions sent",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Token and new password required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const [[user]] = await pool.query(
      `SELECT id FROM users
       WHERE reset_token_hash = ?
       AND reset_token_expiry > NOW()`,
      [hashedToken],
    );

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await pool.query(
      `UPDATE users
       SET password_hash = ?,
           reset_token_hash = NULL,
           reset_token_expiry = NULL,
           password_changed_at = NOW()
       WHERE id = ?`,
      [hashedPassword, user.id],
    );

    res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
