import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { 
  createProject, 
  getAllProjectsAdmin, 
  updateProject, 
  getMyProjects,
  getProjectById,
  deleteProject
} from "../controller/project.controller.js";

const router = express.Router();

router.get(
  '/projects/my-projects',
  authenticate,
  authorizeRoles("Member", "Manager"),
  getMyProjects
);
router.post("/create-projects", authenticate, authorizeRoles("Manager"), createProject);
router.get("/all-projects", authenticate, authorizeRoles("Admin"), getAllProjectsAdmin);
router.get("/projects/:projectId", authenticate, getProjectById);
router.put(
  '/update-projects/:projectId',
  authenticate,
  authorizeRoles("Manager"),
  updateProject
);
router.delete(
  '/projects/:projectId',
  authenticate,
  authorizeRoles("Manager"),
  deleteProject
);

export default router;
