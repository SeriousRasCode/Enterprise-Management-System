import { createUser, findUserByEmail, getUserRoles } from '../model/user.model.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import pool from '../config/db.js';

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

    res.json({ token });
};
