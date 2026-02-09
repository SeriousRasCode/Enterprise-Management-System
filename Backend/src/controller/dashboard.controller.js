import pool from "../config/db.js";
import { getManagerDashboardModel } from "../model/dashboard.model.js";

export const getManagerDashboard = async (req, res) => {
  try {
    const managerId = req.user.userId;

    const summary = await getManagerDashboardModel(managerId);

    res.status(200).json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};


export const getAdminDashboardSummary = async (req, res) => {
  try {
    const [[totalUsers]] = await pool.query(
      `SELECT COUNT(*) AS total FROM users WHERE deleted_at IS NULL`
    );

    const [[totalProjects]] = await pool.query(
      `SELECT COUNT(*) AS total FROM projects`
    );

    const [[activeProjects]] = await pool.query(
      `SELECT COUNT(*) AS total FROM projects WHERE status = 'active'`
    );

    const [[completedProjects]] = await pool.query(
      `SELECT COUNT(*) AS total FROM projects WHERE status = 'completed'`
    );

    const [[onHoldProjects]] = await pool.query(
      `SELECT COUNT(*) AS total FROM projects WHERE status = 'on_hold'`
    );

    res.json({
      success: true,
      data: {
        total_users: totalUsers.total,
        total_projects: totalProjects.total,
        active_projects: activeProjects.total,
        completed_projects: completedProjects.total,
        on_hold_projects: onHoldProjects.total
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
