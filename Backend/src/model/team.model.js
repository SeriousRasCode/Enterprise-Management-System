import pool from '../config/db.js';

export const findTeamsByUserId = async (userId) => {
  const [rows] = await pool.query(
    `SELECT 
        t.id,
        t.name,
        t.created_at
     FROM team_members tm
     JOIN teams t ON tm.team_id = t.id
     WHERE tm.user_id = ?
     ORDER BY t.created_at DESC`,
    [userId]
  );

  return rows;
};

export const createTeam = async (name, createdBy) => {
  const [result] = await pool.query(
    `INSERT INTO teams (name, created_by)
     VALUES (?, ?)`,
    [name, createdBy]
  );

  return result.insertId;
};

export const addUserToTeam = async (teamId, userId) => {
  await pool.query(
    `INSERT INTO team_members (team_id, user_id)
     VALUES (?, ?)`,
    [teamId, userId]
  );
};