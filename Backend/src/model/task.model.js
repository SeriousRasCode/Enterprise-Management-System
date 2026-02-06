import pool from "../config/db.js";

export const createTaskModel = async (
  projectId,
  title,
  description,
  start_date,
  due_date,
  status,
  progress_percentage
) => {
  const [result] = await pool.query(
    `INSERT INTO tasks 
     (project_id, title, description, start_date, due_date, status, progress_percentage)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      projectId,
      title,
      description,
      start_date,
      due_date,
      status,
      progress_percentage
    ]
  );

  return result;
};

export const getTasksByProjectModel = async (projectId) => {
  const [tasks] = await pool.query(
    `SELECT *
     FROM tasks
     WHERE project_id = ?
     ORDER BY created_at DESC`,
    [projectId]
  );

  return tasks;
};

export const updateTaskById = async (taskId, status, progress) => {
  const [result] = await pool.query(
    `UPDATE tasks
     SET status = ?, progress_percentage = ?
     WHERE id = ?`,
    [status, progress, taskId]
  );
  return result;
};

export const deleteTaskById = async (taskId) => {
  const [result] = await pool.query(
    "DELETE FROM tasks WHERE id = ?",
    [taskId]
  );
  return result;
};
