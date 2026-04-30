import pool from "../config/db.js";

export const createTaskModel = async (
  projectId,
  title,
  description,
  start_date,
  due_date,
  status,
  progress_percentage,
   phase_id = null
) => {
  const [result] = await pool.query(
    `INSERT INTO tasks 
     (project_id, title, description, start_date, due_date, status, progress_percentage,phase_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      projectId,
      title,
      description,
      start_date,
      due_date,
      status,
      progress_percentage,
      phase_id
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

export const getTaskByIdModel = async (taskId) => {
  const [[task]] = await pool.query(
    `SELECT * FROM tasks WHERE id = ?`,
    [taskId]
  );
  return task;
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


export const getMyTasksModel = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT 
      t.id,
      t.title,
      t.description,
      t.status,
      t.progress_percentage,
      t.start_date,
      t.due_date,
      t.created_at,
      p.id AS project_id,
      p.name AS project_name
    FROM task_assignments ta
    JOIN tasks t ON ta.task_id = t.id
    JOIN projects p ON t.project_id = p.id
    WHERE ta.user_id = ?
    ORDER BY t.created_at DESC
    `,
    [userId]
  );

  return rows;
};
