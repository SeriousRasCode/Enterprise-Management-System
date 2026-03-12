import express from "express";
import {
  assignSubtask,
  getSubtaskAssignments,
  removeSubtaskAssignment,
  getMySubtasks
} from "../controller/subtaskAssignment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", authenticate,authorizeRoles("Manager"), assignSubtask);
router.get("/:subtaskId", authenticate, authorizeRoles("Manager", "Member"), getSubtaskAssignments);
router.delete("/:subtaskId/:userId", authenticate, authorizeRoles("Manager"), removeSubtaskAssignment);
router.get("/my-subtask/:user_id", authenticate, getMySubtasks);


export default router;