import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { createProject, getAllProjectsAdmin, updateProject } from "../controller/project.controller.js";

const router = express.Router();

// router.post(
//   "/projects",
//   authenticate,
//   authorizeRoles("Admin", "Manager"),
//   (req, res) => {
//     res.json({ message: "Project created" });
//   }
// );
router.post("/create-projects", authenticate, authorizeRoles("Manager"), createProject);
router.get("/all-projects", authenticate, authorizeRoles("Admin"), getAllProjectsAdmin);
router.put(
  '/update-projects/:projectId',
  authenticate,
  authorizeRoles("Manager"),
  updateProject
);

export default router;
