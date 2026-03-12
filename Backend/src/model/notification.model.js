import pool from "../config/db.js";

export const createNotification = async (data) => {

  const { user_id, title, message, entity_type, entity_id } = data;

  const [result] = await pool.query(
    `INSERT INTO notifications
    (user_id,title,message,entity_type,entity_id)
    VALUES (?,?,?,?,?)`,
    [user_id, title, message, entity_type, entity_id]
  );

  return result.insertId;
};

export const getUserNotifications = async (userId) => {

  const [rows] = await pool.query(
    `SELECT * FROM notifications
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );

  return rows;
};

export const markNotificationReadModel = async (notificationId) => {
  await pool.query(
    `UPDATE notifications
     SET is_read = TRUE
     WHERE id = ?`,
    [notificationId]
  );
};