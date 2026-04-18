import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          set({ user: data.user, token: data.token, isLoading: false });
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
      },

      register: async (formData) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/register', formData);
          set({ user: data.user, token: data.token, isLoading: false });
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, message: err.response?.data?.message || 'Registration failed' };
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      refreshUser: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data });
        } catch (err) {
          if (err.response?.status === 401) get().logout();
        }
      },

      levelUpData: null,
clearLevelUp: () => set({ levelUpData: null }),

updateXP: (newXp, newLevel) => {
  set(state => ({
    levelUpData: state.user && newLevel > state.user.level ? newLevel : state.levelUpData,
    user: state.user ? { ...state.user, xp: newXp, level: newLevel } : null,
  }));
},
    }),
    { name: 'cybershield-auth', partialize: (s) => ({ token: s.token, user: s.user }) }
  )
);

export default useStore;
