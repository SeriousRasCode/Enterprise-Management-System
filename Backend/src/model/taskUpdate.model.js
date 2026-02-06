import pool from "../config/db.js";

export const createTaskUpdateModel = async (
  taskId,
  userId,
  progress_percentage,
  status,
  update_note
) => {
  const [result] = await pool.query(
    `INSERT INTO task_updates
     (task_id, user_id, progress_percentage, status, update_note)
     VALUES (?, ?, ?, ?, ?)`,
    [taskId, userId, progress_percentage, status, update_note]
  );

  return result;
};

export const getTaskUpdatesModel = async (taskId) => {
  const [rows] = await pool.query(
    `SELECT 
        tu.progress_percentage,
        tu.status,
        tu.update_note,
        tu.updated_at,
        u.full_name
     FROM task_updates tu
     JOIN users u ON tu.user_id = u.id
     WHERE tu.task_id = ?
     ORDER BY tu.updated_at DESC`,
    [taskId]
  );

  return rows;
};
