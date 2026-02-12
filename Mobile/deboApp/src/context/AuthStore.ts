import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  team: string;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null; // Replace 'any' with a proper user type
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  user: null,

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      await AsyncStorage.setItem('token', token);
      set({ token, user, isAuthenticated: true });

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    set({ token: null, user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/users/me');
        const user = response.data;
        set({ token, user, isAuthenticated: true });
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        // Token might be invalid, so we log out
        await AsyncStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        set({ token: null, user: null, isAuthenticated: false });
      }
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      await api.post('/auth/reset-password', { token, newPassword });
    } catch (error) {
      console.error('Failed to reset password:', error);
      throw error;
    }
  }
}));

export default useAuthStore;
