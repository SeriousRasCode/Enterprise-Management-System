import {
  createTaskModel,
  getTasksByProjectModel,
  updateTaskById,
  deleteTaskById,
  getMyTasksModel,
  getTaskByIdModel
} from "../model/task.model.js";
import { createTaskUpdateModel } from "../model/taskUpdate.model.js";
import { isUserAssignedToTaskModel, getTaskAssignmentsModel } from "../model/taskAssignment.model.js";
import { updateProjectProgressModel } from "../model/project.model.js";
import { triggerEvent } from "../utils/eventEngine.js";


export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    let {
      title,
      description,
      start_date,
      due_date,
      status,
      progress_percentage,
      phase_id
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
      progress_percentage,
      phase_id
    );
await updateProjectProgressModel(projectId);

    await triggerEvent({
      actor_id: req.user.userId,
      action_type: "TASK_CREATED",
      entity_type: "task",
      entity_id: result.insertId,
      description: `Task created: ${title}`,
      notify_users: [],
      notification_title: "Task Created",
      notification_message: "A new task was created in your project"
    });

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

export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await getTaskByIdModel(taskId);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    res.json({ success: true, data: task });
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({ message: "Failed to fetch task" });
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

    const assignments = await getTaskAssignmentsModel(taskId);
    const notifyUsers = assignments.map(a => a.id).filter(id => id !== req.user.userId);

    await triggerEvent({
      actor_id: req.user.userId,
      action_type: "TASK_UPDATED",
      entity_type: "task",
      entity_id: taskId,
      description: "Task details were updated",
      notify_users: notifyUsers,
      notification_title: "Task Updated",
      notification_message: "A task you are assigned to was updated"
    });

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

    await triggerEvent({
      actor_id: req.user.userId,
      action_type: "TASK_DELETED",
      entity_type: "task",
      entity_id: taskId,
      description: "Task was deleted",
      notify_users: [],
      notification_title: "Task Deleted",
      notification_message: "A task was deleted"
    });

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
    await updateTaskById(taskId, status, progress_percentage);

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

    const assignments = await getTaskAssignmentsModel(taskId);
    const notifyUsers = assignments.map(a => a.id).filter(id => id !== userId);

    await triggerEvent({
      actor_id: userId,
      action_type: "TASK_PROGRESS_UPDATED",
      entity_type: "task",
      entity_id: taskId,
      description: `Task progress updated to ${progress_percentage}%`,
      notify_users: notifyUsers,
      notification_title: "Task Progress Updated",
      notification_message: `Task progress is now ${progress_percentage}%`
    });

    // update project progress
    const task = await getTaskByIdModel(taskId);
    if (task) {
      await updateProjectProgressModel(task.project_id);
    }


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
