import pool from "../config/db.js";
import { saveAttachment } from "../model/attachmentModel.js";
import { triggerEvent } from "../utils/eventEngine.js";
import { getTaskAssignmentsModel } from "../model/taskAssignment.model.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/b2.js";

export const uploadAttachment = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("USER:", req.user);

    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const actorId = req.user.userId;

    const fileName = Date.now() + "-" + file.originalname;

    // Upload to Backblaze
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const fileUrl = `${process.env.B2_ENDPOINT}/${process.env.B2_BUCKET_NAME}/${fileName}`;

    const data = {
      project_id: req.body.project_id || null,
      task_id: req.body.task_id || null,
      subtask_id: req.body.subtask_id || null,
      file_name: file.originalname,
      file_path: fileUrl,
      file_size: file.size,
      file_type: file.mimetype,
      uploaded_by: actorId,
    };

    console.log("DATA TO SAVE:", data);

    const id = await saveAttachment(data);

    let notifyUsers = [];

    if (req.body.task_id) {
      const assignments = await getTaskAssignmentsModel(req.body.task_id);

      notifyUsers = assignments.map((a) => a.id).filter((id) => id !== actorId);
    }

    if (req.body.task_id) {
      await triggerEvent({
        actor_id: actorId,
        action_type: "FILE_UPLOADED",
        entity_type: "task",
        entity_id: req.body.task_id,
        description: `File uploaded: ${file.originalname}`,
        notify_users: notifyUsers,
        notification_title: "File Uploaded",
        notification_message:
          "A file was uploaded to the task you are assigned to",
      });
    }

    res.json({
      success: true,
      attachment_id: id,
      file_url: fileUrl,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
};

export const getAttachments = async (req, res) => {
  try {
   const [rows] = await pool.query(
  `SELECT 
      a.*,
      u.full_name AS uploaded_by_name
   FROM attachments a
   JOIN users u ON a.uploaded_by = u.id
   WHERE a.task_id=? OR a.subtask_id=?`,
  [req.params.id, req.params.id]
);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAttachment = async (req, res) => {
  try {
    await pool.query(`DELETE FROM attachments WHERE id=?`, [req.params.id]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const downloadAttachment = async (req, res) => {
  try {

    const [rows] = await pool.query(
      `SELECT file_path FROM attachments WHERE id=?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const fileUrl = rows[0].file_path;

    res.redirect(fileUrl);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};