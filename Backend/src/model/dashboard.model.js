import pool from "../config/db.js";

export const getManagerDashboardModel = async (managerId) => {
  const [[projects]] = await pool.query(
    `
    SELECT
      COUNT(*) AS total_projects,
      SUM(status = 'active') AS active_projects
    FROM projects
    WHERE manager_id = ?
    `,
    [managerId]
  );

  const [[tasks]] = await pool.query(
    `
    SELECT
      COUNT(*) AS total_tasks,
      SUM(status = 'completed') AS completed_tasks,
      SUM(due_date < CURDATE() AND status != 'completed') AS overdue_tasks
    FROM tasks
    WHERE project_id IN (
      SELECT id FROM projects WHERE manager_id = ?
    )
    `,
    [managerId]
  );

  return {
    ...projects,
    ...tasks
  };
};
