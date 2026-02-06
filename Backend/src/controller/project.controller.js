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
