import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import {
  uploadAttachment,
  getAttachments,
  deleteAttachment,
} from "../controller/attachmentController.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/upload", authenticate, upload.single("file"), uploadAttachment);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("Manager", "Admin"),
  getAttachments,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("Manager", "Admin"),
  deleteAttachment,
);

export default router;
