import express from "express";
import {
  sendNotification,
  getNotifications,
  markNotificationRead
} from "../controller/notification.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, sendNotification);
router.get("/:userId", authenticate, getNotifications);
router.put("/:id/read", authenticate, markNotificationRead);

export default router;