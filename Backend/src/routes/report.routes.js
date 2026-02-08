import express from "express";
import { getOverdueTasks, getUserWorkload } from "../controller/report.controller.js";
import {authenticate} from "../middleware/auth.middleware.js";
import {authorizeRoles} from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/overdue-tasks",
  authenticate,
  authorizeRoles("Admin", "Manager"),
  getOverdueTasks
);
router.get(
  "/workload",
  authenticate,
  authorizeRoles("Admin", "Manager"),
  getUserWorkload
);


export default router;
