import {
  createTaskModel,
  getTasksByProjectModel,
  updateTaskById,
  deleteTaskById
} from "../model/task.model.js";
import { createTaskUpdateModel } from "../model/taskUpdate.model.js";
import { isUserAssignedToTaskModel } from "../model/taskAssignment.model.js";
import pool from "../config/db.js";
import { updateProjectProgressModel } from "../model/project.model.js";
import { getMyTasksModel } from "../model/task.model.js";


export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    let {
      title,
      description,
      start_date,
      due_date,
      status,
      progress_percentage
    } = req.body;

    // validation
    progress_percentage = progress_percentage ?? 0;
    if (progress_percentage < 0 || progress_percentage > 100) {
      return res.status(400).json({
        message: "Progress must be between 0 and 100"
      });
    }

    status = status || "not_started";

    const result = await createTaskModel(
      projectId,
      title,
      description,
      start_date,
      due_date,
      status,
      progress_percentage
    );
await updateProjectProgressModel(projectId);
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

    const tasks = await getTasksByProjectModel(projectId);

    res.json(tasks);

  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};




export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    let { progress_percentage } = req.body;

    if (progress_percentage < 0 || progress_percentage > 100) {
      return res.status(400).json({
        message: "Progress must be between 0 and 100"
      });
    }

    // auto status logic
    let status = "not_started";
    if (progress_percentage > 0) status = "started";
    if (progress_percentage === 100) status = "completed";

    const result = await updateTaskById(
      taskId,
      status,
      progress_percentage
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task updated successfully" });

  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Failed to update task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const result = await deleteTaskById(taskId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });

  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
};



export const updateTaskProgress = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.userId; // from JWT
    const { progress_percentage, update_note } = req.body;

    // validate progress
    let status = "not_started";
    if (progress_percentage > 0) status = "started";
    if (progress_percentage === 100) status = "completed";
    if (
      progress_percentage !== undefined &&
      (progress_percentage < 0 || progress_percentage > 100)
    ) {
      return res.status(400).json({
        message: "Progress must be between 0 and 100"
      });
    }

    // 🔐 CHECK ASSIGNMENT
    const isAssigned = await isUserAssignedToTaskModel(taskId, userId);

    if (!isAssigned) {
      return res.status(403).json({
        message: "You are not assigned to this task"
      });
    }

    // update task
    await pool.query(
      `UPDATE tasks
       SET status = ?, progress_percentage = ?
       WHERE id = ?`,
      [status, progress_percentage, taskId]
    );

    // res.json({
    //   message: "Task updated successfully"
    // });

    // 🧾 save history
    await createTaskUpdateModel(
      taskId,
      userId,
      progress_percentage,
      status,
      update_note || null
    );

    res.json({
      message: "Task updated and history recorded"
    });

    // update project progress
const [[task]] = await pool.query(
  `SELECT project_id FROM tasks WHERE id = ?`,
  [taskId]
);

await updateProjectProgressModel(task.project_id);


  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      message: "Failed to update task"
    });
  }
};



export const getMyTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await getMyTasksModel(userId);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks"
    });
  }
};
