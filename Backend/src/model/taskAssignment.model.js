import pool from "../config/db.js";

export const assignTaskModel = async (taskId, userId) => {
  const [result] = await pool.query(
    `INSERT INTO task_assignments (task_id, user_id)
     VALUES (?, ?)`,
    [taskId, userId]
  );

  return result;
};

export const getTaskAssignmentsModel = async (taskId) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.full_name, u.email
     FROM task_assignments ta
     JOIN users u ON ta.user_id = u.id
     WHERE ta.task_id = ?`,
    [taskId]
  );

  return rows;
};

export const isUserAssignedToTaskModel = async (taskId, userId) => {
  const [rows] = await pool.query(
    `SELECT 1
     FROM task_assignments
     WHERE task_id = ? AND user_id = ?
     LIMIT 1`,
    [taskId, userId]
  );

  return rows.length > 0;
};
