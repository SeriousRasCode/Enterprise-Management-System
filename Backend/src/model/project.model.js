import pool from "../config/db.js";

export const createProjectModel = async (name, description, start_date, end_date, managerId, team_id) => {
  const [result] = await pool.query(
    `
    INSERT INTO projects
    (name, description, manager_id, team_id, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [name, description, managerId, team_id, start_date, end_date]
  );
  return result;
};

export const getAllProjectsAdminModel = async () => {
  const [projects] = await pool.query(`
    SELECT 
      p.id,
      p.name,
      p.description,
      p.status,
      p.start_date,
      p.end_date,
      p.created_at,
      t.name AS team_name,
      u.full_name AS manager_name
    FROM projects p
    JOIN teams t ON t.id = p.team_id
    JOIN users u ON u.id = p.manager_id
    ORDER BY p.created_at DESC
  `);
  return projects;
};

export const getProjectByIdModel = async (projectId) => {
  const [[project]] = await pool.query(
    `SELECT * FROM projects WHERE id = ?`,
    [projectId]
  );
  return project;
};

export const updateProjectModel = async (projectId, name, description, status, start_date, end_date) => {
  await pool.query(
    `UPDATE projects
     SET name = ?, description = ?, status = ?, start_date = ?, end_date = ?
     WHERE id = ?`,
    [name, description, status, start_date, end_date, projectId]
  );
};

export const getMyProjectsModel = async (userId, roles) => {
  let query = `
    SELECT DISTINCT
      p.id,
      p.name,
      p.description,
      p.status,
      p.start_date,
      p.end_date,
      p.manager_id,
      p.created_at,
      t.name AS team_name
    FROM projects p
    JOIN teams t ON p.team_id = t.id
    LEFT JOIN team_members tm ON t.id = tm.team_id
  `;

  let values = [];

  if (roles.includes('Admin')) {
    // Admin sees everything
  } 
  else if (roles.includes('Manager')) {
    query += ` WHERE p.manager_id = ?`;
    values.push(userId);
  } 
  else if (roles.includes('Member')) {
    query += ` WHERE tm.user_id = ?`;
    values.push(userId);
  }

  query += ` ORDER BY p.created_at DESC`;

  const [projects] = await pool.query(query, values);
  return projects;
};

export const deleteProjectModel = async (projectId) => {
  await pool.query(`DELETE FROM projects WHERE id = ?`, [projectId]);
};

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
