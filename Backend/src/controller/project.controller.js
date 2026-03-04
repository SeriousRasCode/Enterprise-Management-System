import pool from "../config/db.js";
export const createProject = async (req, res) => {
  try {
    const { name, description, start_date, end_date, team_id } = req.body;

    if (!name || !team_id) {
      return res.status(400).json({
        message: "Project name and team_id are required"
      });
    }

    const managerId = req.user.userId;

    const [result] = await pool.query(
      `
      INSERT INTO projects
      (name, description, manager_id, team_id, start_date, end_date)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [name, description, managerId, team_id, start_date, end_date]
    );

    res.status(201).json({
      message: "Project created successfully",
      project_id: result.insertId
    });

  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




export const getAllProjectsAdmin = async (req, res) => {
  try {
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

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;
    const roles = req.user.roles;

    const {
      name,
      description,
      status,
      start_date,
      end_date
    } = req.body;

    // Ownership check (manager only)
    if (!roles.includes('admin')) {
      const [[project]] = await pool.query(
        `SELECT id FROM projects WHERE id = ? AND manager_id = ?`,
        [projectId, userId]
      );

      if (!project) {
        return res.status(403).json({
          message: 'You can only update your own projects'
        });
      }
    }

    await pool.query(
      `UPDATE projects
       SET name = ?, description = ?, status = ?, start_date = ?, end_date = ?
       WHERE id = ?`,
      [name, description, status, start_date, end_date, projectId]
    );

    res.json({ message: 'Project updated successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const roles = req.user.roles || [];

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

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// export const getMyProjects = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const roles = req.user.roles || [];

//     let query = `
//       SELECT 
//         p.id,
//         p.name,
//         p.description,
//         p.status,
//         p.start_date,
//         p.end_date,
//         t.name AS team_name
//       FROM projects p
//       JOIN teams t ON p.team_id = t.id
//     `;

//     let values = [];

//     // 🔐 If not Admin → filter by manager_id
//     if (!roles.includes('Admin')) {
//       query += ` WHERE p.manager_id = ?`;
//       values.push(userId);
//     }

//     query += ` ORDER BY p.created_at DESC`;

//     const [projects] = await pool.query(query, values);

//     res.json({
//       success: true,
//       count: projects.length,
//       data: projects
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };