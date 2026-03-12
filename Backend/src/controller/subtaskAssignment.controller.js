import pool from "../config/db.js";
import { assignUserToSubtask, getDeveloperSubtasks } from "../model/subtaskAssignment.model.js";
import { logActivity } from "../utils/logger.js";

export const assignSubtask = async (req, res) => {

  try {

    const { subtask_id, user_id } = req.body;

    await assignUserToSubtask(subtask_id, user_id);
  await logActivity({
      user_id,
      action_type: "SUBTASK_ASSIGNED",
      entity_type: "subtask",
      entity_id: subtask_id,
      description: "User assigned to subtask"
    });
    res.json({
      success: true,
      message: "User assigned to subtask"
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

export const getSubtaskAssignments = async (req, res) => {

  try {

    const [rows] = await pool.query(
      `SELECT sa.*, u.full_name
       FROM subtask_assignments sa
       JOIN users u ON sa.user_id = u.id
       WHERE sa.subtask_id = ?`,
      [req.params.subtaskId]
    );

    res.json(rows);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

export const removeSubtaskAssignment = async (req, res) => {

  try {

    await pool.query(
      `DELETE FROM subtask_assignments
       WHERE subtask_id=? AND user_id=?`,
      [req.params.subtaskId, req.params.userId]
    );

    res.json({ success: true });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

export const getMySubtasks = async (req, res) => {

  try {

    const { user_id } = req.params;

    const subtasks = await getDeveloperSubtasks(user_id);

    res.json({
      success: true,
      subtasks
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};