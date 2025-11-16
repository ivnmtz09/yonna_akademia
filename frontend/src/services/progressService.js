import axios from '../api/axios';

export const progressService = {
  // Obtener progreso general del usuario
  getOverallProgress: async () => {
    try {
      const response = await axios.get('/progress/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener progreso');
    }
  },

  // Obtener progreso por curso específico
  getCourseProgress: async (courseId) => {
    try {
      const response = await axios.get(`/progress/${courseId}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener progreso del curso');
    }
  },

  // Obtener estadísticas de aprendizaje
  getLearningStats: async () => {
    try {
      const response = await axios.get('/progress/stats/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  }
};