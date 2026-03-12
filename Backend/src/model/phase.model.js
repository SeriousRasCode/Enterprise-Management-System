import db from "../config/db.js";

export const createPhase = async (data) => {

  const {
    project_id,
    name,
    description,
    start_date,
    end_date
  } = data;

  const [result] = await db.query(
    `INSERT INTO project_phases
    (project_id,name,description,start_date,end_date)
    VALUES (?,?,?,?,?)`,
    [project_id, name, description, start_date, end_date]
  );

  return result.insertId;
};