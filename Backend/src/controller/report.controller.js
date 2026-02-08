import { getOverdueTasksModel, getUserWorkloadModel } from "../model/report.model.js";

export const getOverdueTasks = async (req, res) => {
  try {
    const tasks = await getOverdueTasksModel();

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });

  } catch (error) {
    console.error("Overdue report error:", error);
    res.status(500).json({ message: "Failed to fetch overdue tasks" });
  }
};



export const getUserWorkload = async (req, res) => {
  try {
    const workload = await getUserWorkloadModel();

    res.status(200).json({
      success: true,
      data: workload
    });

  } catch (error) {
    console.error("Workload report error:", error);
    res.status(500).json({ message: "Failed to fetch workload report" });
  }
};
