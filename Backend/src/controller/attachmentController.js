import pool from "../config/db.js";
import { saveAttachment } from "../model/attachmentModel.js";
import { triggerEvent } from "../utils/eventEngine.js";
import { getTaskAssignmentsModel } from "../model/taskAssignment.model.js";

export const uploadAttachment = async (req, res) => {

  try {

    const file = req.file;

    const data = {
      ...req.body,
      file_name: file.originalname,
      file_path: file.path,
      file_size: file.size,
      file_type: file.mimetype
    };

    const id = await saveAttachment(data);

    const assignments = await getTaskAssignmentsModel(req.body.task_id);
    const actorId = req.body.uploaded_by;
    const notifyUsers = assignments
      .map(assignee => assignee.id)
      .filter(id => id !== actorId);

    await triggerEvent({
      actor_id: actorId,
      action_type: "FILE_UPLOADED",
      entity_type: "task",
      entity_id: req.body.task_id,
      description: `File uploaded: ${file.originalname}`,

      notify_users: notifyUsers,

      notification_title: "File Uploaded",
      notification_message: "A file was uploaded to the task you are assigned to"
    });
    res.json({
      success: true,
      attachment_id: id
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

export const getAttachments = async (req, res) => {

  try {

    const [rows] = await pool.query(
      `SELECT *
       FROM attachments
       WHERE task_id=? OR subtask_id=?`,
      [req.params.id, req.params.id]
    );

    res.json(rows);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

export const deleteAttachment = async (req, res) => {

  try {

    await pool.query(
      `DELETE FROM attachments WHERE id=?`,
      [req.params.id]
    );

    res.json({ success: true });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};