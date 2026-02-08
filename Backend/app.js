import express from 'express';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from "./src/routes/user.routes.js";
import projectRoutes from "./src/routes/project.routes.js";
import taskRoutes from "./src/routes/task.routes.js";
import taskAssignmentRoutes from "./src/routes/taskAssignment.routes.js";
import reportRoutes from "./src/routes/report.routes.js";

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskAssignmentRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api', projectRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
export default app;
