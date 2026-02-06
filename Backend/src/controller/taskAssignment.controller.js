import {
  assignTaskModel,
  getTaskAssignmentsModel
} from "../model/taskAssignment.model.js";

export const assignTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required"
      });
    }

    await assignTaskModel(taskId, userId);

    res.status(201).json({
      message: "Task assigned successfully"
    });

  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "User already assigned to this task"
      });
    }

    console.error("Assign task error:", error);
    res.status(500).json({
      message: "Failed to assign task"
    });
  }
};

export const getTaskAssignments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const users = await getTaskAssignmentsModel(taskId);

    res.json(users);

  } catch (error) {
    console.error("Get task assignments error:", error);
    res.status(500).json({
      message: "Failed to fetch task assignments"
    });
  }
};
