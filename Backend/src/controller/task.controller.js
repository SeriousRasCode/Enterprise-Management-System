import pool from "../config/db.js";

export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      title,
      description,
      start_date,
      due_date,
      status,
      progress_percentage
    } = req.body;

    // backend validation (important)
    if (progress_percentage < 0 || progress_percentage > 100) {
      return res.status(400).json({ message: "Progress must be 0–100" });
    }

    const [result] = await pool.query(
      `INSERT INTO tasks 
      (project_id, title, description, start_date, due_date, status, progress_percentage)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        projectId,
        title,
        description,
        start_date,
        due_date,
        status || "not_started",
        progress_percentage || 0
      ]
    );

    res.status(201).json({
      message: "Task created successfully",
      taskId: result.insertId
    });

  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
};


export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const [tasks] = await pool.query(
      `SELECT *
       FROM tasks
       WHERE project_id = ?
       ORDER BY created_at DESC`,
      [projectId]
    );

    res.json(tasks);

  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};
