import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null; // Replace 'any' with a proper user type
  login: (email, password) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  user: null,

  login: async (email, password) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user: User = {
        id: '1',
        name: 'John Doe',
        email: email,
        role: 'Manager',
        team: 'Development'
      };
      const token = 'fake-token';

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
        // Here you might want to verify the token with your backend
        // For simplicity, we'll just set the state
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ token, isAuthenticated: true });
    }
  }
}));

export default useAuthStore;
