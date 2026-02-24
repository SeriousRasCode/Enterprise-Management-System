import pool from '../config/db.js';
import { findTeamsByUserId, createTeam, addUserToTeam  } from '../model/team.model.js';

export const getMyTeams = async (req, res) => {
  try {
    const userId = req.user.userId; // from JWT

    const teams = await findTeamsByUserId(userId);

    res.json({
      success: true,
      count: teams.length,
      data: teams
    });

  } catch (error) {
    console.error('Get my teams error:', error);
    res.status(500).json({ message: 'Failed to fetch teams' });
  }
};



export const createTeamController = async (req, res) => {
  try {
    const { name } = req.body;
    const adminId = req.user.userId;

    if (!name) {
      return res.status(400).json({ message: 'Team name is required' });
    }

    const teamId = await createTeam(name, adminId);

    res.status(201).json({
      message: 'Team created successfully',
      teamId
    });

  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ message: 'Failed to create team' });
  }
};


export const addTeamMemberController = async (req, res) => {
  try {
    const { id: teamId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    await addUserToTeam(teamId, userId);

    res.json({ message: 'User added to team successfully' });

  } catch (error) {
    console.error('Add team member error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'User already in team' });
    }

    res.status(500).json({ message: 'Failed to add user to team' });
  }
};

export const getAllTeams = async (req, res) => {
  try {
    const [teams] = await pool.query(`
      SELECT t.id, t.name, t.created_at, u.full_name AS created_by
      FROM teams t
      JOIN users u ON t.created_by = u.id
      ORDER BY t.created_at DESC
    `);

    res.json({
      success: true,
      count: teams.length,
      data: teams
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};