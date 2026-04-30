import pool from "../config/db.js";
import { saveAttachment } from "../model/attachmentModel.js";
import { triggerEvent } from "../utils/eventEngine.js";
import { getTaskAssignmentsModel } from "../model/taskAssignment.model.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/b2.js";

// export const uploadAttachment = async (req, res) => {
//   try {
//     console.log("BODY:", req.body);
//     console.log("FILE:", req.file);
//     console.log("USER:", req.user);

//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     if (!req.user) {
//       return res.status(401).json({ error: "User not authenticated" });
//     }

//     const actorId = req.user.userId;

//     const fileName = Date.now() + "-" + file.originalname;

//     // Upload to Backblaze
//     await s3.send(
//       new PutObjectCommand({
//         Bucket: process.env.B2_BUCKET_NAME,
//         Key: fileName,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//       }),
//     );

//     const fileUrl = `${process.env.B2_ENDPOINT}/${process.env.B2_BUCKET_NAME}/${fileName}`;

//     const data = {
//       project_id: req.body.project_id || null,
//       task_id: req.body.task_id || null,
//       subtask_id: req.body.subtask_id || null,
//       file_name: file.originalname,
//       file_path: fileUrl,
//       file_size: file.size,
//       file_type: file.mimetype,
//       uploaded_by: actorId,
//     };

//     console.log("DATA TO SAVE:", data);

//     const id = await saveAttachment(data);

//     let notifyUsers = [];

//     if (req.body.task_id) {
//       const assignments = await getTaskAssignmentsModel(req.body.task_id);

//       notifyUsers = assignments.map((a) => a.id).filter((id) => id !== actorId);
//     }

//     if (req.body.task_id) {
//       await triggerEvent({
//         actor_id: actorId,
//         action_type: "FILE_UPLOADED",
//         entity_type: "task",
//         entity_id: req.body.task_id,
//         description: `File uploaded: ${file.originalname}`,
//         notify_users: notifyUsers,
//         notification_title: "File Uploaded",
//         notification_message:
//           "A file was uploaded to the task you are assigned to",
//       });
//     }

//     res.json({
//       success: true,
//       attachment_id: id,
//       file_url: fileUrl,
//     });
//   } catch (error) {
//     console.error("UPLOAD ERROR:", error);

//     res.status(500).json({
//       error: error.message,
//     });
//   }
// };

// // export const getAttachments = async (req, res) => {
// //   try {
// //    const [rows] = await pool.query(
// //   `SELECT 
// //       a.*,
// //       u.full_name AS uploaded_by_name
// //    FROM attachments a
// //    JOIN users u ON a.uploaded_by = u.id
// //    WHERE a.task_id=? OR a.subtask_id=?`,
// //   [req.params.id, req.params.id]
// // );

// //     res.json(rows);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// export const getAttachments = async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT
//         a.*,
//         u.full_name AS uploaded_by_name
//       FROM attachments a
//       JOIN users u ON a.uploaded_by = u.id
//       WHERE a.project_id=? OR a.task_id=? OR a.subtask_id=?`,
//       [req.params.id, req.params.id, req.params.id]
//     );

//     res.json(rows);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

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

export const getAttachments = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        a.*,
        u.full_name AS uploaded_by_name
      FROM attachments a
      JOIN users u ON a.uploaded_by = u.id
      WHERE a.project_id=? OR a.task_id=? OR a.subtask_id=? OR a.phase_id=?`,  // ADD OR a.phase_id=?
      [req.params.id, req.params.id, req.params.id, req.params.id]  // ADD req.params.id
    );

    res.json(rows);
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