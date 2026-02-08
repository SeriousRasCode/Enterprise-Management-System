import pool from "../config/db.js";

export const getOverdueTasksModel = async () => {
  const [rows] = await pool.query(
    `
    SELECT 
      t.id,
      t.title,
      t.status,
      t.due_date,
      t.progress_percentage,
      p.name AS project_name
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    WHERE t.due_date < CURDATE()
      AND t.status != 'completed'
    ORDER BY t.due_date ASC
    `
  );

  return rows;
};

export const getUserWorkloadModel = async () => {
  const [rows] = await pool.query(
    `
    SELECT 
      u.id AS user_id,
      u.full_name,
      COUNT(ta.task_id) AS task_count
    FROM users u
    LEFT JOIN task_assignments ta ON u.id = ta.user_id
    LEFT JOIN tasks t ON ta.task_id = t.id
      AND t.status != 'completed'
    GROUP BY u.id
    ORDER BY task_count DESC
    `
  );

  return rows;
};
