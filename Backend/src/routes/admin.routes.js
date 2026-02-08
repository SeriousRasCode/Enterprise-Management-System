import express from "express";
import { getAllUsers, assignUserRole, updateUserStatus, createRole } from "../controller/admin.controller.js";
import {authenticate} from "../middleware/auth.middleware.js";
import {authorizeRoles} from "../middleware/role.middleware.js";


const router = express.Router();

router.get(
  "/all-users",
  authenticate,
  authorizeRoles("Admin"),
  getAllUsers
);

router.post(
  "/users/:userId/change-roles",
  authenticate,
  authorizeRoles("Admin"),
  assignUserRole
);

router.patch(
  "/users/:userId/change-status",
  authenticate,
  authorizeRoles("Admin"),
  updateUserStatus
);
router.post(
  '/create-roles',
  authenticate,
  authorizeRoles("Admin"),
  createRole
);
export default router;
