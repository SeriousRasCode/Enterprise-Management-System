import pool from "../config/db.js";

export const getAllUsersModel = async () => {
  const [rows] = await pool.query(`
    SELECT 
      u.id,
      u.full_name,
      u.email,
      u.is_active,
      u.created_at,
      GROUP_CONCAT(r.name) AS roles
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `);

  return rows;
};

export const assignUserRoleModel = async (userId, roleName) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. we Check role exists
    const [[role]] = await connection.query(
      `SELECT id FROM roles WHERE name = ?`,
      [roleName]
    );

    if (!role) {
      throw new Error("Role does not exist");
    }

    // 2. We Remove existing roles (single-role system)
    await connection.query(
      `DELETE FROM user_roles WHERE user_id = ?`,
      [userId]
    );

    // 3. Assign new role
    await connection.query(
      `INSERT INTO user_roles (user_id, role_id)
       VALUES (?, ?)`,
      [userId, role.id]
    );

    await connection.commit();
    return true;

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
