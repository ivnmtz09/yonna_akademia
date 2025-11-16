import axios from '../api/axios';

export const profileService = {
  // Obtener perfil completo del usuario
  getProfile: async () => {
    try {
      const response = await axios.get('/auth/profile/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener perfil');
    }
  },

  // Actualizar perfil del usuario
  updateProfile: async (profileData) => {
    try {
      const response = await axios.patch('/auth/profile/', profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar perfil');
    }
  },

  // Subir avatar del usuario
  uploadAvatar: async (avatarFile) => {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const response = await axios.post('/auth/upload-avatar/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al subir avatar');
    }
  },

  // Cambiar contraseña
  changePassword: async (passwordData) => {
    try {
      const response = await axios.post('/auth/change-password/', passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al cambiar contraseña');
    }
  }
};