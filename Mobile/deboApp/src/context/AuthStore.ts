import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { authAPI, userAPI, teamAPI } from '../services/api';

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  team: string; // name of first team, empty if none
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null; // Replace 'any' with a proper user type
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateUser: (user: User) => void;
  refreshUser: () => Promise<void>;
  // internal helpers (underscored to indicate private)
  _deriveRole: (payload: any) => string;
  _fetchTeamName: () => Promise<string>;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  user: null,

  login: async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user: payload } = response.data;

      // derive our internal user object
      const roleStr = useAuthStore.getState()._deriveRole(payload);
      const teamName = await useAuthStore.getState()._fetchTeamName();

      const userObj: User = {
        id: String(payload.id),
        full_name: payload.full_name || payload.fullName || '',
        email: payload.email || email,
        role: roleStr,
        team: teamName,
      };

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(userObj));
      set({ token, user: userObj, isAuthenticated: true });

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

  // internal helper to extract role string from backend user payload
  _deriveRole: (payload: any): string => {
    if (!payload) return 'Member';
    if (payload.role && typeof payload.role === 'string') return payload.role;
    if (Array.isArray(payload.roles) && payload.roles.length > 0) {
      const first = payload.roles[0];
      if (typeof first === 'string') return first;
      if (first && typeof first.name === 'string') return first.name;
    }
    if (payload.role_id != null) {
      switch (payload.role_id) {
        case 1:
          return 'Admin';
        case 2:
          return 'Manager';
        case 3:
          return 'Member';
        default:
          return 'Member';
      }
    }
    console.warn('Unable to derive role from payload', payload);
    return 'Member';
  },

  // fetches the first team name (if any) and returns string
  _fetchTeamName: async (): Promise<string> => {
    try {
      const resp = await teamAPI.getMyTeams();
      console.log('teamAPI.getMyTeams response', resp);
      const body: any = resp?.data;
      let teams: any[] = [];
      if (Array.isArray(body)) {
        teams = body;
      } else if (body && body.success && Array.isArray(body.data)) {
        teams = body.data;
      } else if (body && Array.isArray(body.data)) {
        teams = body.data;
      }
      console.log('teams array extracted', teams);
      if (teams.length > 0) {
        // assume each team has a "name" prop
        const name = teams[0].name || teams[0].team_name || '';
        console.log('chosen team name', name);
        return name;
      }
    } catch (e) {
      console.warn('Unable to fetch team list:', e);
    }
    return '';
  },

  checkAuth: async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      // if we have a stored user object, restore it immediately
      const stored = await AsyncStorage.getItem('user');
      if (stored) {
        try {
          const parsed: User = JSON.parse(stored);
          set({ token, user: parsed, isAuthenticated: true });
        } catch {
          // ignore invalid JSON
        }
      }

      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // refresh profile/role/team in background
        const response = await userAPI.getMe();
        const profile = response.data?.user || response.data || {};
        const existingUser = useAuthStore.getState().user;
        const roleStr = useAuthStore.getState()._deriveRole(profile);
        const teamName = await useAuthStore.getState()._fetchTeamName();
        const userObj: User = {
          id: String(profile.id),
          full_name: profile.full_name || profile.fullName || '',
          email: profile.email || '',
          // keep previous role unless the new one is more specific
          role: existingUser?.role && roleStr === 'Member' ? existingUser.role : roleStr,
          team: teamName || existingUser?.team || '',
        };
        await AsyncStorage.setItem('user', JSON.stringify(userObj));
        set({ token, user: userObj, isAuthenticated: true });
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        // Token might be invalid, so we log out
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        set({ token: null, user: null, isAuthenticated: false });
      }
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      await authAPI.resetPassword({ token, newPassword });
    } catch (error) {
      console.error('Failed to reset password:', error);
      throw error;
    }
  },
  
  updateUser: (user) => set({ user }),
  refreshUser: async () => {
    try {
      const existingUser = useAuthStore.getState().user;
      const response = await userAPI.getMe();
      const profile = response.data?.user || response.data || {};
      const roleStr = useAuthStore.getState()._deriveRole(profile);
      const teamName = await useAuthStore.getState()._fetchTeamName();

      const userObj: User = {
        id: String(profile.id),
        full_name: profile.full_name || profile.fullName || '',
        email: profile.email || '',
        role: existingUser?.role && roleStr === 'Member' ? existingUser.role : roleStr,
        team: teamName || existingUser?.team || '',
      };

      await AsyncStorage.setItem('user', JSON.stringify(userObj));
      set({ user: userObj });
    } catch (error) {
      throw error;
    }
  },
}));

export default useAuthStore;
