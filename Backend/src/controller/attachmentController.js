import pool from "../config/db.js";
import { saveAttachment } from "../model/attachmentModel.js";
import { triggerEvent } from "../utils/eventEngine.js";
import { getTaskAssignmentsModel } from "../model/taskAssignment.model.js";
import { s3Client, getSignedUrl, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '../utils/s3Config.js';

export const uploadAttachment = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: "No file uploaded" });
        if (!req.user) return res.status(401).json({ error: "User not authenticated" });

        const actorId = req.user.userId;
        // Sanitize filename for cloud storage
        const safeName = file.originalname.replace(/\s+/g, '-');
        const fileKey = `attachments/${Date.now()}-${safeName}`;

        // 1. Upload to Backblaze B2
        await s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.B2_BUCKET_NAME,
                Key: fileKey,
                Body: file.buffer,
                ContentType: file.mimetype,
            })
        );

        // 2. Prepare data for Database
        const data = {
            project_id: req.body.project_id || null,
            task_id: req.body.task_id || null,
            subtask_id: req.body.subtask_id || null,
            file_name: file.originalname,
            file_path: fileKey, // Store the KEY, not the full URL, for better flexibility
            file_size: file.size,
            file_type: file.mimetype,
            uploaded_by: actorId,
        };

        const id = await saveAttachment(data);

        // 3. Handle Notifications
        let notifyUsers = [];
        if (req.body.task_id) {
            const assignments = await getTaskAssignmentsModel(req.body.task_id);
            notifyUsers = assignments.map((a) => a.id).filter((uid) => uid !== actorId);

            await triggerEvent({
                actor_id: actorId,
                action_type: "FILE_UPLOADED",
                entity_type: "task",
                entity_id: req.body.task_id,
                description: `File uploaded: ${file.originalname}`,
                notify_users: notifyUsers,
                notification_title: "File Uploaded",
                notification_message: "A file was uploaded to a task you are assigned to",
            });
        }

        res.json({
            success: true,
            attachment_id: id,
            file_key: fileKey,
        });
    } catch (error) {
        console.error("UPLOAD ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

export const downloadAttachment = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT file_path FROM attachments WHERE id=?`,
            [req.params.id]
        );

        if (rows.length === 0) return res.status(404).json({ message: "File not found" });

        const fileKey = rows[0].file_path;

        // Generate a temporary Signed URL (Valid for 1 hour)
        // This bypasses Backblaze login screens and works for private buckets
        const command = new GetObjectCommand({
            Bucket: process.env.B2_BUCKET_NAME,
            Key: fileKey,
        });

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        // Redirect user to the secure download link
        //res.redirect(signedUrl);
        res.json({ signed_url: signedUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteAttachment = async (req, res) => {
    try {
        // 1. Get the key from DB before deleting record
        const [rows] = await pool.query(`SELECT file_path FROM attachments WHERE id=?`, [req.params.id]);
        
        if (rows.length > 0) {
            // 2. Delete from Backblaze
            await s3Client.send(new DeleteObjectCommand({
                Bucket: process.env.B2_BUCKET_NAME,
                Key: rows[0].file_path
            }));
        }

        // 3. Delete from DB
        await pool.query(`DELETE FROM attachments WHERE id=?`, [req.params.id]);

        res.json({ success: true, message: "Deleted from storage and database" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAttachments = async (req, res) => {
  try {
    const { id } = req.params; // This 'id' could be project_id, task_id, etc.
    
    // Note: Changed 'db' to 'pool' to match your database config import
    const [rows] = await pool.query(
      `SELECT 
        a.*,
        u.full_name as uploaded_by_name
      FROM attachments a
      LEFT JOIN users u ON a.uploaded_by = u.id
      WHERE a.project_id = ? 
         OR a.task_id = ? 
         OR a.subtask_id = ? 
      ORDER BY a.uploaded_at DESC`,
      [id, id, id]
    );

    res.json(rows);
  } catch (error) {
    console.error("GET ATTACHMENTS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};