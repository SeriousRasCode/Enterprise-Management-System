import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { createProject } from "../controller/project.controller.js";

const router = express.Router();

// router.post(
//   "/projects",
//   authenticate,
//   authorizeRoles("Admin", "Manager"),
//   (req, res) => {
//     res.json({ message: "Project created" });
//   }
// );
router.post("/projects", authenticate, authorizeRoles("Manager"), createProject);

export default router;
