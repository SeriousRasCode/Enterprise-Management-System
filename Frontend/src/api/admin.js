import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Assuming backend runs on port 3000

const api = axios.create({
  baseURL: API_URL,
});

// Optional: Add an interceptor to include the auth token if needed
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export const getAllUsers = () => api.get('/admin/all-users');

export const assignRole = (userId, roleName) => 
  api.put(`/admin/users/${userId}/change-roles`, { roleName });

export const updateUserStatus = (userId, isActive) =>
  api.patch(`/admin/users/${userId}/change-status`, { is_active: isActive });

export const createRole = (name, description) =>
  api.post('/admin/create-roles', { name, description });
