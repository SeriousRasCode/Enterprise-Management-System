import express from 'express';
import cors from 'cors';
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
export default app;
