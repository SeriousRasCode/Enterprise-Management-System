import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// base URL is driven by Expo constants (extra) or hard-coded fallback
const API_URL =
  Constants.manifest?.extra?.apiUrl ||
  'https://54c4-196-189-127-151.ngrok-free.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// attach token from storage on every request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// optional global response handler for network errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // network / CORS error
      return Promise.reject(
        new Error(`Unable to connect to server at ${API_URL}`)
      );
    }
    return Promise.reject(error);
  }
);

// helper wrappers mirroring the web version
// each function returns the axios promise so callers can `await`.

export const authAPI = {
  register: (data: { full_name: string; email: string; password: string }) =>
    api.post('/auth/register', {
      full_name: data.full_name,
      email: data.email,
      password: data.password,
      role_id: 3, // default to member
    }),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  forgotPassword: (data: { email: string }) =>
    api.post('/auth/forgot-password', data),

  resetPassword: (data: { token: string; newPassword: string }) =>
    api.post('/auth/reset-password', data),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  getMe: () => api.get('/users/me'),
  getMyRole: () => api.get('/users/me/role'),
  updateProfile: (data: { full_name?: string; email?: string }) =>
    api.put('/users/update-me', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/users/me/password', data),
};

export const adminAPI = {
  getAllUsers: () => api.get('/admin/all-users'),
  assignRole: (userId: number, roleName: string) =>
    api.post(`/admin/users/${userId}/change-roles`, { roleName }),
  updateUserStatus: (userId: number, is_active: boolean) =>
    api.patch(`/admin/users/${userId}/change-status`, { is_active }),
  createRole: (data: { name: string; description: string }) =>
    api.post('/admin/create-roles', data),
  addUserToTeam: (teamId: number, userId: number) =>
    api.post(`/teams/${teamId}/members`, { userId }),
};

export const projectAPI = {
  createProject: (data: {
    name: string;
    description: string;
    team_id: number;
    start_date: string;
    end_date: string;
  }) => api.post('/create-projects', data),
  getAllProjects: () => api.get('/all-projects'),
  getMyProjects: () => api.get('/projects/my-projects'),
  getProjectMembers: (projectId: number) =>
    api.get(`/projects/${projectId}/members`),
  updateProject: (
    projectId: number,
    data: {
      name?: string;
      description?: string;
      status?: string;
      start_date?: string;
      end_date?: string;
    }
  ) => api.put(`/update-projects/${projectId}`, data),
};

export const taskAPI = {
  createTask: (
    projectId: number,
    data: {
      title: string;
      description: string;
      start_date: string;
      due_date: string;
      status: string;
      progress_percentage: number;
    }
  ) => api.post(`/tasks/projects/${projectId}`, data),
  getTasksByProject: (projectId: number) =>
    api.get(`/tasks/projects/${projectId}`),
  updateTask: (
    taskId: number,
    data: { progress_percentage?: number }
  ) => api.put(`/tasks/${taskId}`, data),
  deleteTask: (taskId: number) => api.delete(`/tasks/${taskId}`),
  updateProgress: (
    taskId: number,
    data: { progress_percentage: number; update_note: string }
  ) => api.patch(`/tasks/${taskId}/progress`, data),
  getTaskHistory: (taskId: number) =>
    api.get(`/tasks/${taskId}/history`),
  getMyTasks: () => api.get('/tasks/my-tasks'),
  assignTask: (taskId: number, userId: number) =>
    api.post(`/tasks/${taskId}/assign`, { userId }),
  getAssignments: (taskId: number) =>
    api.get(`/tasks/${taskId}/assignments`),
};

export const reportAPI = {
  getOverdueTasks: () => api.get('/reports/overdue-tasks'),
  getWorkload: () => api.get('/reports/workload'),
};

export const dashboardAPI = {
  getManagerDashboard: () => api.get('/dashboard/manager'),
  getAdminSummary: () => api.get('/dashboard/admin-summary'),
};

export const teamAPI = {
  getMyTeams: () => api.get('/teams/my-teams'),
  getAllTeams: () => api.get('/teams/all-teams'),
  getTeamMembers: (teamId: number) => api.get(`/teams/${teamId}/members`),
  createTeam: (data: { name: string }) => api.post('/teams/create', data),
  addTeamMember: (teamId: number, data: { userId: number }) =>
    api.post(`/teams/${teamId}/members`, data),
};

export default api;
