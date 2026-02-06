import express from 'express';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from "./src/routes/user.routes.js";
import projectRoutes from "./src/routes/project.routes.js";

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', projectRoutes);
app.use('/api/users', userRoutes);
export default app;
