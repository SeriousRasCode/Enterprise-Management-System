import express from 'express';
import { getProfile } from '../controller/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected route: only authenticated users
router.get('/profile', authenticate, getProfile);

export default router;
