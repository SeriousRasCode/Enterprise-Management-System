import pool from "../config/db.js";

export const createSubtaskComment = async (data) => {

  const { subtask_id, user_id, comment } = data;

  const [result] = await pool.query(
    `INSERT INTO subtask_comments
     (subtask_id,user_id,comment)
     VALUES (?,?,?)`,
    [subtask_id, user_id, comment]
  );

  return result.insertId;
};

export const getSubtaskCommentsModel = async (subtaskId) => {
  const [rows] = await pool.query(
    `SELECT sc.*, u.full_name
     FROM subtask_comments sc
     JOIN users u ON sc.user_id = u.id
     WHERE sc.subtask_id = ?
     ORDER BY sc.created_at ASC`,
    [subtaskId]
  );
  return rows;
};