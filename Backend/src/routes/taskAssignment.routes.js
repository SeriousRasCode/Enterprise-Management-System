import express from "express";
import {
  assignTask,
  getTaskAssignments
} from "../controller/taskAssignment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Only Admin or Project Manager
router.post(
  "/:taskId/assign",
  authenticate,
  authorizeRoles("Admin", "Manager"),
  assignTask
);

router.get(
  "/:taskId/assignments",
  authenticate,
  getTaskAssignments
);

export default router;
