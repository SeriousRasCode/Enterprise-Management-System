import { verifyToken } from '../utils/jwt.js';
import pool from '../config/db.js';

export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 1 We Verify JWT
        const decoded = verifyToken(token);

        // 2 We Check user status from DB
        const [[user]] = await pool.query(
            'SELECT is_active FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (user.is_active === 0) {
            return res.status(403).json({ message: "Account is deactivated" });
        }

        // 3 We Attach user to request
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
