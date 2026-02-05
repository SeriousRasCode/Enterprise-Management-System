import pool from '../config/db.js';

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
