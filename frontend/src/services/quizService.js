import axios from '../api/axios';

export const quizService = {
  // Obtener quizzes disponibles
  getAvailableQuizzes: async () => {
    try {
      const response = await axios.get('/quizzes/available/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener quizzes');
    }
  },

  // Crear nuevo quiz (solo para sabedores/profesores)
  createQuiz: async (quizData) => {
    try {
      const response = await axios.post('/quizzes/create/', quizData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear quiz');
    }
  },

  // Enviar resultado de quiz
  submitQuizAttempt: async (quizId, score) => {
    try {
      const response = await axios.post('/quizzes/attempt/', {
        quiz: quizId,
        score: score
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al enviar quiz');
    }
  },

  // Obtener historial de quizzes
  getQuizHistory: async () => {
    try {
      const response = await axios.get('/quizzes/history/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener historial');
    }
  }
};