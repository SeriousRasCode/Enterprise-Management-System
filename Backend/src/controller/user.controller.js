import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [[user]] = await pool.query(
            `SELECT id, full_name, email, is_active, created_at
             FROM users
             WHERE id = ?`,
            [userId]
        );

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { full_name, email } = req.body;

    if (!full_name && !email) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    await pool.query(
      `UPDATE users
       SET full_name = COALESCE(?, full_name),
           email = COALESCE(?, email)
       WHERE id = ?`,
      [full_name, email, userId]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both passwords are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const [[user]] = await pool.query(
      `SELECT password_hash FROM users WHERE id = ?`,
      [userId]
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const samePassword = await bcrypt.compare(newPassword, user.password_hash);
    if (samePassword) {
      return res.status(400).json({ message: 'New password must be different' });
    }
    const newHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users SET password_hash = ? WHERE id = ?`,
      [newHash, userId]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
