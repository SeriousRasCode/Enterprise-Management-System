import {
  createSubtask,
  updateSubtask,
  deleteSubtask,
  updateSubtaskProgress,
  getSubtaskByIdModel
} from "../model/subtask.model.js";
import { getTaskAssignmentsModel } from "../model/taskAssignment.model.js";

import { triggerEvent } from "../utils/eventEngine.js";

export const createSubtaskController = async (req, res) => {

  try {

    const id = await createSubtask(req.body);

    const assignments = await getTaskAssignmentsModel(req.params.taskId || req.body.task_id);
    const actorId = req.body.user_id || req.user?.userId;
    const notifyUsers = assignments.map(a => a.id).filter(userId => userId !== actorId);

    await triggerEvent({
      actor_id: actorId,
      action_type: "SUBTASK_CREATED",
      entity_type: "subtask",
      entity_id: id,
      description: "Manager created a new subtask",
      notify_users: notifyUsers,
      notification_title: "Subtask Created",
      notification_message: "A new subtask was created in a task you are assigned to"
    });

    res.json({
      success: true,
      subtask_id: id
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

export const updateSubtaskController = async (req, res) => {

  try {

    await updateSubtask(req.params.id, req.body);

    const assignments = await getTaskAssignmentsModel(req.params.taskId || req.body.task_id);
    const actorId = req.body.user_id || req.user?.userId;
    const notifyUsers = assignments.map(a => a.id).filter(userId => userId !== actorId);

    await triggerEvent({
      actor_id: actorId,
      action_type: "SUBTASK_UPDATED",
      entity_type: "subtask",
      entity_id: req.params.id,
      description: "Subtask updated by manager",
      notify_users: notifyUsers,
      notification_title: "Subtask Updated",
      notification_message: "A subtask inside your assigned task was updated"
    });

    res.json({ success: true });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

export const deleteSubtaskController = async (req, res) => {

  try {

    await deleteSubtask(req.params.id);

    const assignments = await getTaskAssignmentsModel(req.params.taskId || req.body.task_id);
    const actorId = req.body.user_id || req.user?.userId;
    const notifyUsers = assignments.map(a => a.id).filter(userId => userId !== actorId);

    await triggerEvent({
      actor_id: actorId,
      action_type: "SUBTASK_DELETED",
      entity_type: "subtask",
      entity_id: req.params.id,
      description: "Subtask removed",
      notify_users: notifyUsers,
      notification_title: "Subtask Deleted",
      notification_message: "A subtask was removed from your task"
    });

    res.json({ success: true });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

export const updateSubtaskProgressController = async (req, res) => {

  try {

    const { progress_percentage, status } = req.body;

    await updateSubtaskProgress(
      req.params.id,
      progress_percentage,
      status
    );

    const subtask = await getSubtaskByIdModel(req.params.id);
    let notifyUsers = [];
    const actorId = req.body.user_id || req.user?.userId;
    if (subtask && subtask.task_id) {
      const assignments = await getTaskAssignmentsModel(subtask.task_id);
      notifyUsers = assignments.map(a => a.id).filter(userId => userId !== actorId);
    }

    await triggerEvent({
      actor_id: actorId,
      action_type: "SUBTASK_PROGRESS_UPDATED",
      entity_type: "subtask",
      entity_id: req.params.id,
      description: "Subtask progress updated",
      notify_users: notifyUsers,
      notification_title: "Subtask Progress Updated",
      notification_message: "Progress was updated for a subtask inside your task"
    });

    res.json({ success: true });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};