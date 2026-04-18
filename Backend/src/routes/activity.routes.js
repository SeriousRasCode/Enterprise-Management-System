import express from "express";
import {
  getActivities,
  logActivity,
} from "../controller/activityLogcontroller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", authenticate, logActivity);
router.get(
  "/",
  authenticate,
  authorizeRoles("Admin", "Manager"),
  getActivities
);

export default router;