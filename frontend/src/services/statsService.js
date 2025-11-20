// /src/services/statsService.js - CORREGIDO
import api from '../api/axios';

const API_URL = import.meta.env.VITE_API_URL;

export const statsService = {
  // Obtener estadísticas generales (Dashboard)
  getGeneralStats: async () => {
    try {
      const response = await api.get('/api/media/statistics/');
      return response.data;
    } catch (error) {
      console.error('Error fetching general stats:', error);
      throw error;
    }
  },

  // Obtener engagement de usuarios
  getUserEngagement: async () => {
    try {
      const response = await api.get('/api/media/statistics/user_engagement/');
      return response.data;
    } catch (error) {
      console.error('Error fetching user engagement:', error);
      throw error;
    }
  },

  // --- GESTIÓN DE USUARIOS ---
  
  // Obtener lista de todos los usuarios
  // NOTA: Asegúrate de que tu backend tenga: router.register(r'users', UserViewSet, basename='users')
  // Obtener lista de todos los usuarios
  getUsers: async () => {
    try {
      // CORRECCIÓN: Llamamos a la ruta que *realmente* existe: /api/auth/users/
      const response = await api.get('/api/auth/users/'); 
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Actualizar rol de usuario (Solo Admin)
  updateUserRole: async (userId, role) => {
    try {
      // CORRECCIÓN: Llamamos a la ruta que *realmente* existe: /api/auth/users/{id}/role/
      const response = await api.patch(`/api/auth/users/${userId}/role/`, { role });
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  // Obtener perfil de usuario específico (o el propio)
  getUserProfile: async (userId = 'me') => {
      try {
          const endpoint = userId === 'me' ? '/api/users/users/me/' : `/api/users/users/${userId}/`;
          const response = await api.get(endpoint);
          return response.data;
      } catch (error) {
          console.error('Error fetching profile:', error);
          throw error;
      }
  },
  // Obtener overview de estadísticas del usuario
  getOverview: async () => {
    try {
      const response = await api.get(`${API_URL}/api/stats/overview/`);
      return response.data;
    } catch (error) {
      console.warn('Stats overview endpoint not available:', error);
      return getFallbackStats();
    }
  },

  // Obtener estadísticas detalladas del usuario
  getUserStatistics: async () => {
    try {
      const response = await api.get(`${API_URL}/api/stats/user-statistics/`);
      return response.data;
    } catch (error) {
      console.warn('User statistics endpoint not available:', error);
      return null;
    }
  },

  // Obtener perfil del usuario - ESTA ES LA QUE FALTABA
  getProfile: async () => {
    try {
      const response = await api.get(`${API_URL}/api/auth/profile/`);
      return response.data;
    } catch (error) {
      console.warn('Profile endpoint not available:', error);
      return null;
    }
  },

  // Obtener historial de XP
  getXpHistory: async (timeframe = 'month') => {
    try {
      const response = await api.get(`${API_URL}/api/stats/xp-history/?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      console.warn('XP history endpoint not available:', error);
      return [];
    }
  },

  // Obtener leaderboard
  getLeaderboard: async (metric = 'xp', limit = 20) => {
    try {
      const response = await api.get(
        `${API_URL}/api/stats/leaderboard/?metric=${metric}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.warn('Leaderboard endpoint not available:', error);
      return [];
    }
  }
};

// Estadísticas de fallback
const getFallbackStats = () => ({
  user_level: 1,
  user_xp: 0,
  next_level_xp: 100,
  progress_to_next_level: 0,
  weekly_xp_gain: 0,
  monthly_xp_gain: 0,
  courses_completed: 0,
  quizzes_attempted: 0,
  quizzes_passed: 0,
  success_rate: 0,
  current_streak: 0,
  rank: 0
});