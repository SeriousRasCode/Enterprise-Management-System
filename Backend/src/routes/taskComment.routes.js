import express from "express";
import {
  addComment,
  fetchComments
} from "../controller/taskComment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, addComment);
router.get("/:taskId", authenticate, fetchComments);

export default router;