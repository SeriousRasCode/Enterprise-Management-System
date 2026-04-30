import pool from "../config/db.js";

// export const saveAttachment = async (data) => {

//   const {
//     project_id,
//     task_id,
//     subtask_id,
//     file_name,
//     file_path,
//     file_size,
//     file_type,
//     uploaded_by
//   } = data;

//   const [result] = await pool.query(
//     `INSERT INTO attachments
//     (project_id,task_id,subtask_id,file_name,file_path,file_size,file_type,uploaded_by)
//     VALUES (?,?,?,?,?,?,?,?)`,
//     [
//       project_id,
//       task_id,
//       subtask_id,
//       file_name,
//       file_path,
//       file_size,
//       file_type,
//       uploaded_by
//     ]
//   );

//   return result.insertId;
// };

export const saveAttachment = async (data) => {

  const {
    project_id,
    task_id,
    subtask_id,
    phase_id,  // ADD THIS
    file_name,
    file_path,
    file_size,
    file_type,
    uploaded_by
  } = data;

  const [result] = await pool.query(
    `INSERT INTO attachments
    (project_id,task_id,subtask_id,phase_id,file_name,file_path,file_size,file_type,uploaded_by)
    VALUES (?,?,?,?,?,?,?,?,?)`,  // ADD ? for phase_id
    [
      project_id,
      task_id,
      subtask_id,
      phase_id,  // ADD THIS
      file_name,
      file_path,
      file_size,
      file_type,
      uploaded_by
    ]
  );

  return result.insertId;
};