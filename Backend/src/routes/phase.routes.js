import express from "express";
import {
  createProjectPhase,
  getProjectPhases,
  updatePhase,
  deletePhase
} from "../controller/phase.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", authenticate, authorizeRoles("Admin", "Manager"), createProjectPhase);
router.get("/:projectId", authenticate, getProjectPhases);
router.put("/:phaseId", authenticate, authorizeRoles("Admin", "Manager"), updatePhase);
router.delete("/:phaseId", authenticate, authorizeRoles("Admin", "Manager"), deletePhase);

export default router;