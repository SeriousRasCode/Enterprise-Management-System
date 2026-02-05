import pool from '../config/db.js';

export const createUser = async (full_name, email, password_hash) => {
    const [result] = await pool.query(
        `INSERT INTO users (full_name, email, password_hash)
         VALUES (?, ?, ?)`,
        [full_name, email, password_hash]
    );
    return result.insertId;
};

export const findUserByEmail = async (email) => {
    const [[user]] = await pool.query(
        `SELECT * FROM users WHERE email = ? AND deleted_at IS NULL`,
        [email]
    );
    return user;
};

export const getUserRoles = async (userId) => {
    const [roles] = await pool.query(
        `SELECT r.name
         FROM user_roles ur
         JOIN roles r ON ur.role_id = r.id
         WHERE ur.user_id = ?`,
        [userId]
    );
    return roles.map(r => r.name);
};
