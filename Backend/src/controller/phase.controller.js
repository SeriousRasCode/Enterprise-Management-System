import pool from "../config/db.js";
import { createPhase } from "../model/phase.model.js";
import { logActivity } from "../utils/logger.js";

export const createProjectPhase = async (req, res) => {

  try {

    const id = await createPhase(req.body);
    await logActivity({
      user_id: req.body.user_id,
      action_type: "PHASE_CREATED",
      entity_type: "phase",
      entity_id: id,
      description: "New project phase created"
    });
    res.json({
      success: true,
      phase_id: id
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

export const getProjectPhases = async (req, res) => {

  try {

    const [rows] = await pool.query(
      `SELECT *
       FROM project_phases
       WHERE project_id = ?
       ORDER BY phase_order ASC`,
      [req.params.projectId]
    );

    res.json(rows);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

export const updatePhase = async (req, res) => {

  try {

    await pool.query(
      `UPDATE project_phases
       SET name=?, description=?, start_date=?, end_date=?, status=?
       WHERE id=?`,
      [
        req.body.name,
        req.body.description,
        req.body.start_date,
        req.body.end_date,
        req.body.status,
        req.params.phaseId
      ]
    );

    res.json({ success: true });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

export const deletePhase = async (req, res) => {

  try {

    await pool.query(
      `DELETE FROM project_phases WHERE id=?`,
      [req.params.phaseId]
    );

    res.json({ success: true });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};