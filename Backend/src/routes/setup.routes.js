import express from 'express';
import fs from 'fs';
import path from 'path';
import pool from '../config/db.js';

const router = express.Router();

router.post('/setup-db', async (req, res) => {
  try {
    const sqlPath = path.resolve('../db/init.sql');  // path to your SQL file
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await pool.query(sql);  // execute full SQL file

    return res.status(200).json({
      message: 'Database initialized successfully'
    });
  } catch (err) {
    console.error('DB Setup Error:', err);
    return res.status(500).json({
      error: 'Database initialization failed'
    });
  }
});

export default router;
