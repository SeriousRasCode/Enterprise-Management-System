import {
  createTaskComment,
  getTaskComments
} from "../model/taskComment.model.js";
import { getTaskAssignmentsModel } from "../model/taskAssignment.model.js";
import { triggerEvent } from "../utils/eventEngine.js";

export const addComment = async (req, res) => {

  try {

    const id = await createTaskComment(req.body);
    const { user_id, task_id } = req.body;
    
    // Fetch assigned users to notify them
    const assignments = await getTaskAssignmentsModel(task_id);
    const actorId = user_id || req.user?.userId;
    
    const notifyUsers = assignments
      .map(assignee => assignee.id)
      .filter(id => id !== actorId);

    await triggerEvent({
      actor_id: actorId,
      action_type: "TASK_COMMENT_ADDED",
      entity_type: "task",
      entity_id: task_id,
      description: "User added a comment",

      notify_users: notifyUsers,

      notification_title: "New Task Comment",
      notification_message: "Someone commented on a task you are assigned to"
    });
    res.json({
      success: true,
      comment_id: id
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

export const fetchComments = async (req, res) => {

  try {

    const comments = await getTaskComments(req.params.taskId);

    res.json(comments);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};