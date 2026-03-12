export const log = (message) => {
  console.log(`[LOG] ${new Date().toISOString()} - ${message}`);
};

import pool from "../config/db.js";

export const logActivity = async ({
  user_id,
  action_type,
  entity_type,
  entity_id,
  description
}) => {

  try {

    await pool.query(
      `INSERT INTO activity_logs
      (user_id, action_type, entity_type, entity_id, description)
      VALUES (?,?,?,?,?)`,
      [
        user_id,
        action_type,
        entity_type,
        entity_id,
        description
      ]
    );

  } catch (error) {

    console.error("Activity log error:", error);

  }

};