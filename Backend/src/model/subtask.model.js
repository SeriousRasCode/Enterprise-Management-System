import db from "../config/db.js";

export const createSubtask = async (data) => {

  const {
    task_id,
    title,
    description,
    start_date,
    due_date
  } = data;

  const [result] = await db.query(
    `INSERT INTO subtasks
    (task_id,title,description,start_date,due_date)
    VALUES (?,?,?,?,?)`,
    [task_id, title, description, start_date, due_date]
  );

  return result.insertId;
};

export const updateSubtask = async (id, data) => {

  const { title, description, start_date, due_date } = data;

  await db.query(
    `UPDATE subtasks
     SET title=?, description=?, start_date=?, due_date=?
     WHERE id=?`,
    [title, description, start_date, due_date, id]
  );

};

export const deleteSubtask = async (id) => {

  await db.query(
    `DELETE FROM subtasks WHERE id=?`,
    [id]
  );

};

export const updateSubtaskProgress = async (id, progress, status) => {

  await db.query(
    `UPDATE subtasks
     SET progress_percentage=?, status=?
     WHERE id=?`,
    [progress, status, id]
  );
};

export const getSubtaskByIdModel = async (id) => {
  const [[subtask]] = await db.query(
    `SELECT * FROM subtasks WHERE id = ?`,
    [id]
  );
  return subtask;
};