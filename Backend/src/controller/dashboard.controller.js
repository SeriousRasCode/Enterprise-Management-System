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
