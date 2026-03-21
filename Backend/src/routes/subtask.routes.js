import express from "express";
import {
  createSubtaskController,
  updateSubtaskController,
  updateSubtaskProgressController,
  deleteSubtaskController,
} from "../controller/subtask.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
const router = express.Router();

router.post(
  "/create-subtask/:taskId",authenticate,
  authorizeRoles("Manager"),
    createSubtaskController,
);

router.put(
  "/update-subtask/:id/:taskId", authenticate,
  authorizeRoles("Manager"),
  updateSubtaskController,
);

router.delete(
  "/delete-subtask/:id/:taskId",authenticate,
  authorizeRoles("Manager"),
  deleteSubtaskController,
);

router.get("/task/:taskId", authenticate, getSubtasksByTaskIdController);

/* assigned users */

router.patch("/progress/:id", authenticate, updateSubtaskProgressController);

export default router;
