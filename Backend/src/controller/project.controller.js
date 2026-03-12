import { 
  createProjectModel, 
  getAllProjectsAdminModel, 
  getProjectByIdModel, 
  updateProjectModel, 
  getMyProjectsModel, 
  deleteProjectModel 
} from "../model/project.model.js";
import { triggerEvent } from "../utils/eventEngine.js";

export const createProject = async (req, res) => {
  try {
    const { name, description, start_date, end_date, team_id } = req.body;

    if (!name || !team_id) {
      return res.status(400).json({
        message: "Project name and team_id are required"
      });
    }

    const managerId = req.user.userId;

    const result = await createProjectModel(name, description, start_date, end_date, managerId, team_id);

    await triggerEvent({
      actor_id: managerId,
      action_type: "PROJECT_CREATED",
      entity_type: "project",
      entity_id: result.insertId,
      description: `Project created: ${name}`,
      notify_users: [],
      notification_title: "Project Created",
      notification_message: "A new project was created"
    });

    res.status(201).json({
      message: "Project created successfully",
      project_id: result.insertId
    });

  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllProjectsAdmin = async (req, res) => {
  try {
    const projects = await getAllProjectsAdminModel();

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await getProjectByIdModel(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;
    const roles = req.user.roles;

    const {
      name,
      description,
      status,
      start_date,
      end_date
    } = req.body;

    // Ownership check (manager only)
    if (!roles.includes('admin')) {
      const project = await getProjectByIdModel(projectId);

      if (!project || project.manager_id !== userId) {
        return res.status(403).json({
          message: 'You can only update your own projects'
        });
      }
    }

    await updateProjectModel(projectId, name, description, status, start_date, end_date);

    await triggerEvent({
      actor_id: userId,
      action_type: "PROJECT_UPDATED",
      entity_type: "project",
      entity_id: projectId,
      description: `Project updated: ${name}`,
      notify_users: [],
      notification_title: "Project Updated",
      notification_message: "A project you are part of was updated"
    });

    res.json({ message: 'Project updated successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const roles = req.user.roles || [];

    const projects = await getMyProjectsModel(userId, roles);

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;
    const roles = req.user.roles;

    // Ownership check (manager only)
    if (!roles.includes('admin')) {
      const project = await getProjectByIdModel(projectId);

      if (!project || project.manager_id !== userId) {
        return res.status(403).json({
          message: 'You can only delete your own projects'
        });
      }
    }

    await deleteProjectModel(projectId);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};