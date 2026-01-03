import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: true,
  error: null,

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post('/auth/login', { email, password });
      const { token, refreshToken, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Set authorization header for all subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      set({ user, token, loading: false });
      return user;
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  register: async (email, password, firstName, lastName, organizationName) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post('/auth/register', {
        email,
        password,
        firstName,
        lastName,
        organizationName
      });

      const { token, refreshToken, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Set authorization header for all subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      set({ user, token, loading: false });
      return user;
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  loadUser: async () => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user) {
        // Restore authorization header on app load
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ user: JSON.parse(user), token, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    set({ user: null, token: null });
  },

  setError: (error) => set({ error })
}));