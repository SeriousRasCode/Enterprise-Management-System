import express from "express";
import {
  addSubtaskComment,
  getSubtaskComments
} from "../controller/subtaskComment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", authenticate, addSubtaskComment);
router.get("/:subtaskId",authenticate, getSubtaskComments);

export default router;