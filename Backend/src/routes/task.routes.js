import express from "express";
import { createTask, getTasksByProject, updateTask, deleteTask, updateTaskProgress, getMyTasks, getTaskById} from "../controller/task.controller.js";
import {authenticate} from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getTaskUpdatesModel } from "../model/taskUpdate.model.js";


const router = express.Router();
 router.get(
   "/:taskId/history",
   authenticate,
   authorizeRoles("Member"),
   async (req, res) => {
     try {
       const { taskId } = req.params;

       const updates = await getTaskUpdatesModel(taskId);

       res.json(updates);

     } catch (error) {  
       console.error("Get task updates error:", error);
       res.status(500).json({ message: "Failed to fetch task history" });
     }
   }
 );

router.post(
  "/projects/:projectId",
  authenticate,
  authorizeRoles("Manager"),
  createTask
);
router.get(
  "/projects/:projectId",
  authenticate,
  getTasksByProject
);
router.put(
  "/:taskId",
  authenticate,
  updateTask
);
router.delete(
  "/:taskId",
  authenticate,
  deleteTask
);
router.get(
  "/:taskId",
  authenticate,
  getTaskById
);
router.patch(
  "/:taskId/progress",
  authenticate,
  authorizeRoles("Member"),
  updateTaskProgress
);

router.get(
  "/my-tasks",
  authenticate,
  getMyTasks
);
export default router;
