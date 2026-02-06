import express from "express";
import { createTask, getTasksByProject, updateTask, deleteTask, updateTaskProgress} from "../controller/task.controller.js";
import {authenticate} from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";


const router = express.Router();

router.post(
  "/projects/:projectId",
  authenticate,
  createTask
);
router.get(
  "/projects/:projectId",
  authenticate,
  getTasksByProject
);
router.put(
  "/:taskId",
  authenticate,
  updateTask
);
router.delete(
  "/:taskId",
  authenticate,
  deleteTask
);
router.patch(
  "/:taskId/progress",
  authenticate,
  authorizeRoles("Member"),
  updateTaskProgress
);

export default router;
