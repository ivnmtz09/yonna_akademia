// /src/services/authService.js - VERSIÓN SIMPLIFICADA
import api from '../api/axios';

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  // LOGIN - Usar solo tu endpoint personalizado que SÍ FUNCIONA
  login: async (credentials) => {
    const response = await api.post(`${API_URL}/api/auth/login/`, {
      email: credentials.email,    // ← Así funciona en tu backend
      password: credentials.password
    });
    return response.data;
  },

  // REGISTRO - Ya funciona bien
  register: async (userData) => {
    const response = await api.post(`${API_URL}/api/auth/register/`, userData);
    return response.data;
  },

  // OBTENER USUARIO ACTUAL - Con fallback
  getCurrentUser: async () => {
    try {
      // Primero intentar con /api/auth/me/ (después de arreglar el view)
      const response = await api.get(`${API_URL}/api/auth/me/`);
      return response.data;
    } catch (error) {
      console.warn('/api/auth/me/ no disponible, usando /api/auth/profile/');
      // Fallback al profile
      const profileResponse = await api.get(`${API_URL}/api/auth/profile/`);
      return profileResponse.data;
    }
  },

  // LOGOUT 
  logout: async (refreshToken) => {
    try {
      const response = await api.post(`${API_URL}/api/auth/logout/`, {
        refresh: refreshToken
      });
      return response.data;
    } catch (error) {
      console.warn('Logout endpoint failed, clearing local storage');
      return { message: 'Logged out locally' };
    }
  },

  // OBTENER PERFIL
  getProfile: async () => {
    const response = await api.get(`${API_URL}/api/auth/profile/`);
    return response.data;
  },

  // ACTUALIZAR PERFIL
  updateProfile: async (profileData) => {
    const response = await api.patch(`${API_URL}/api/auth/profile/`, profileData);
    return response.data;
  }
};