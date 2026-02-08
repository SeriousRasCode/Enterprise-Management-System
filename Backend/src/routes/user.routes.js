import express from 'express';
import { getProfile , updateProfile, changePassword } from '../controller/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected route: only authenticated users
router.get('/profile', authenticate, getProfile);
router.get('/me', authenticate, getProfile);
router.put('/update-me', authenticate, updateProfile);
router.put('/me/password', authenticate, changePassword);


export default router;
