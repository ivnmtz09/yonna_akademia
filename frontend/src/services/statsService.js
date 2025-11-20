// /src/services/statsService.js - CORREGIDO
import api from '../api/axios';

const API_URL = import.meta.env.VITE_API_URL;

export const statsService = {
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