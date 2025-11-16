import axios from '../api/axios';

export const courseService = {
  // Obtener cursos disponibles según el nivel del usuario
  getAvailableCourses: async () => {
    try {
      const response = await axios.get('/courses/available/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener cursos');
    }
  },

  // Crear nuevo curso (solo para sabedores/profesores)
  createCourse: async (courseData) => {
    try {
      const response = await axios.post('/courses/create/', courseData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear curso');
    }
  },

  // Inscribirse a un curso
  enrollInCourse: async (courseId) => {
    try {
      const response = await axios.post('/courses/enroll/', { course_id: courseId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al inscribirse al curso');
    }
  },

  // Obtener detalles de un curso específico
  getCourseDetails: async (courseId) => {
    try {
      const response = await axios.get(`/courses/${courseId}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener detalles del curso');
    }
  }
};