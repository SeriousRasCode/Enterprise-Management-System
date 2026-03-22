import pool from "../config/db.js";

export const createSubtask = async (data) => {

  const {
    task_id,
    title,
    description,
    start_date,
    due_date
  } = data;

  const [result] = await pool.query(
    `INSERT INTO subtasks
    (task_id,title,description,start_date,due_date)
    VALUES (?,?,?,?,?)`,
    [task_id, title, description, start_date, due_date]
  );

  return result.insertId;
};

export const updateSubtask = async (id, data) => {

  const { title, description, start_date, due_date } = data;

  await pool.query(
    `UPDATE subtasks
     SET title=?, description=?, start_date=?, due_date=?
     WHERE id=?`,
    [title, description, start_date, due_date, id]
  );

};

export const deleteSubtask = async (id) => {

  await pool.query(
    `DELETE FROM subtasks WHERE id=?`,
    [id]
  );

};

export const updateSubtaskProgress = async (id, progress, status) => {

  await pool.query(
    `UPDATE subtasks
     SET progress_percentage=?, status=?
     WHERE id=?`,
    [progress, status, id]
  );

};

export const getSubtasksByTaskId = async (taskId) => {
  const [rows] = await db.query(
    `SELECT * FROM subtasks WHERE task_id = ? ORDER BY created_at DESC`,
    [taskId]
  );
  return rows;
};