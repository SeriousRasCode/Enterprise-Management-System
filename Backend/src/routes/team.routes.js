import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { getMyTeams,createTeamController, addTeamMemberController, getAllTeams, getTeamMembers  } from '../controller/team.controller.js';

const router = express.Router();

router.get(
  '/:teamId/members',
  authenticate,
  authorizeRoles("Admin", "Manager"),
  getTeamMembers
);
router.get(
  '/all-teams',
  authenticate,
  authorizeRoles("Admin"),
  getAllTeams
);
router.get('/my-teams', authenticate, getMyTeams);
router.post('/create', authenticate,authorizeRoles("Admin"), createTeamController);
router.post('/:userId/members', authenticate,authorizeRoles("Admin"), addTeamMemberController);
export default router;
