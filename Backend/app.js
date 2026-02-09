import express from 'express';
import cors from 'cors';
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from "./src/routes/user.routes.js";
import projectRoutes from "./src/routes/project.routes.js";
import taskRoutes from "./src/routes/task.routes.js";
import taskAssignmentRoutes from "./src/routes/taskAssignment.routes.js";
import reportRoutes from "./src/routes/report.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import teamRoutes from "./src/routes/team.routes.js";

const app = express();
app.use(cors());

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskAssignmentRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api', projectRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teams', teamRoutes);

// Swagger UI -
try {
  const specPath = path.join(process.cwd(), "Backend", "src", "docs", "openapi.yaml");
  const altSpecPath = path.join(process.cwd(), "src", "docs", "openapi.yaml");
  const finalPath = fs.existsSync(specPath) ? specPath : altSpecPath;
  if (fs.existsSync(finalPath)) {
    const file = fs.readFileSync(finalPath, "utf8");
    const doc = yaml.load(file);
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(doc));
  } else {
    console.warn("OpenAPI spec not found at", specPath, "or", altSpecPath);
  }
} catch (err) {
  console.error("Failed to mount Swagger UI:", err);
}
export default app;
