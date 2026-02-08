import pool from "../config/db.js";

export const updateProjectProgressModel = async (projectId) => {
  const [[result]] = await pool.query(
    `SELECT 
        IFNULL(AVG(progress_percentage), 0) AS progress
     FROM tasks
     WHERE project_id = ?`,
    [projectId]
  );

  await pool.query(
    `UPDATE projects
     SET progress_percentage = ?
     WHERE id = ?`,
    [result.progress, projectId]
  );
};
