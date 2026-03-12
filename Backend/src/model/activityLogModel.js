import pool from "../config/db.js";

export const createActivityLog = async (data) => {
  const { user_id, action_type, entity_type, entity_id, description } = data;

  const [result] = await pool.query(
    `INSERT INTO activity_logs
    (user_id, action_type, entity_type, entity_id, description)
    VALUES (?,?,?,?,?)`,
    [user_id, action_type, entity_type, entity_id, description]
  );

  return result.insertId;
};

export const getActivityLogs = async (filters = {}) => {
  let query = `
    SELECT al.*, u.full_name 
    FROM activity_logs al
    JOIN users u ON al.user_id = u.id
  `;
  const queryParams = [];
  const whereClauses = [];

  if (filters.entity_type && filters.entity_id) {
    whereClauses.push('al.entity_type = ? AND al.entity_id = ?');
    queryParams.push(filters.entity_type, filters.entity_id);
  }

  if (whereClauses.length > 0) {
    query += ' WHERE ' + whereClauses.join(' AND ');
  }

  query += ' ORDER BY al.created_at DESC';

  // You can add pagination later

  const [rows] = await pool.query(query, queryParams);
  return rows;
};

export const getActivityFeedModel = async () => {
  const [rows] = await pool.query(
    `SELECT
      al.*,
      u.full_name
    FROM activity_logs al
    JOIN users u ON al.user_id = u.id
    ORDER BY al.created_at DESC
    LIMIT 50`
  );
  return rows;
};