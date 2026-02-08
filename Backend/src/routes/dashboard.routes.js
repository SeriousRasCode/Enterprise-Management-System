import express from "express";
import { getManagerDashboard } from "../controller/dashboard.controller.js";
import {authenticate} from "../middleware/auth.middleware.js";
import {authorizeRoles} from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/manager",
  authenticate,
  authorizeRoles("Manager"),
  getManagerDashboard
);

export default router;
