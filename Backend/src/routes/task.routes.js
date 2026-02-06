import express from "express";
import { createTask, getTasksByProject } from "../controller/task.controller.js";
import {authenticate} from "../middleware/auth.middleware.js";

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

export default router;
