import pool from "../config/db.js";

export const createTaskComment = async (data) => {

  const { task_id, user_id, comment, parent_comment_id } = data;

  const [result] = await pool.query(
    `INSERT INTO task_comments
    (task_id,user_id,comment,parent_comment_id)
    VALUES (?,?,?,?)`,
    [task_id, user_id, comment, parent_comment_id || null]
  );

  return result.insertId;
};

export const getTaskComments = async (taskId) => {

  const [rows] = await pool.query(
    `SELECT tc.*, u.full_name
     FROM task_comments tc
     JOIN users u ON tc.user_id = u.id
     WHERE task_id = ?
     ORDER BY created_at ASC`,
    [taskId]
  );

  return rows;
};