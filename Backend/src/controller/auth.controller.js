import { createUser, findUserByEmail, getUserRoles } from '../model/user.model.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import pool from '../config/db.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
    const { full_name, email, password, role_id } = req.body;

    const passwordHash = await hashPassword(password);
    const userId = await createUser(full_name, email, passwordHash);

    await pool.query(
        `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`,
        [userId, role_id]
    );

    res.status(201).json({ message: 'User registered successfully' });
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

     if (user.is_active === 0) {
    return res.status(403).json({
      message: "Account is deactivated. Contact admin."
    });
  }
    const match = await comparePassword(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const roles = await getUserRoles(user.id);

    const token = signToken({
      
        userId: user.id,
          email: user.email,
        roles
    });
    //res.json({ token });
   res.json({ token, user: { id: user.id, fullName: user.full_name, email: user.email, roles } });
};



export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const [[user]] = await pool.query(
      `SELECT id FROM users WHERE email = ? AND is_active = true`,
      [email]
    );

    // SECURITY: do not reveal if email exists
    if (!user) {
      return res.json({ message: 'If email exists, reset instructions sent' });
    }

    // 1 Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // 2 Save token
    await pool.query(
      `UPDATE users 
       SET reset_token = ?, reset_token_expires = ?
       WHERE id = ?`,
      [resetToken, expiresAt, user.id]
    );

    // 🚨 Normally we email the token
    // For now we return it (DEV ONLY)
    res.json({
      message: 'Password reset token generated',
      resetToken
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // 1️⃣ Find valid token
    const [[user]] = await pool.query(
      `SELECT id FROM users
       WHERE reset_token = ?
       AND reset_token_expires > NOW()`,
      [token]
    );

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // 2️⃣ Hash new password
    const hash = await bcrypt.hash(newPassword, 10);

    // 3️⃣ Update password & clear token
    await pool.query(
      `UPDATE users
       SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL
       WHERE id = ?`,
      [hash, user.id]
    );

    res.json({ message: 'Password reset successful' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

