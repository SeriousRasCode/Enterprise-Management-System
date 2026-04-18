import pool from "../config/db.js";

export const assignUserToSubtask = async (subtask_id, user_id) => {
  await pool.query(
    `INSERT INTO subtask_assignments (subtask_id,user_id)
     VALUES (?,?)`,
    [subtask_id, user_id],
  );
};

export const getDeveloperSubtasks = async (user_id) => {
  const [rows] = await pool.query(
    `SELECT
s.id AS subtask_id,
s.title AS subtask_title,
s.status,
s.progress_percentage,
t.title AS task_title,
p.name AS project_name
FROM subtask_assignments sa
JOIN subtasks s ON sa.subtask_id = s.id
JOIN tasks t ON s.task_id = t.id
JOIN projects p ON t.project_id = p.id
WHERE sa.user_id = ?;`,
    [user_id],
  );

  return rows;
};
