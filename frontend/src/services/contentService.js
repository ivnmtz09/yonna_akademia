import api from '../api/axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const contentService = {
  // Obtener todo el contenido multimedia con manejo de errores mejorado
  getAllMedia: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/api/media/media/?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error en getAllMedia:', error);
      // Retornar array vacío en caso de error
      return [];
    }
  },

  // Obtener mis subidas con manejo de errores
  getMyUploads: async () => {
    try {
      const response = await api.get(`/api/media/media/my_uploads/`);
      return response.data;
    } catch (error) {
      console.error('Error en getMyUploads:', error);
      return [];
    }
  },

  // Obtener contenido por ID
  getMediaById: async (id) => {
    const response = await api.get(`/api/media/media/${id}/`);
    return response.data;
  },

// Subir nuevo contenido
  createMedia: async (mediaData) => {
    const formData = new FormData();
    
    Object.keys(mediaData).forEach(key => {
      if (mediaData[key] !== null && mediaData[key] !== undefined) {
        // Manejo especial para arrays (tags)
        if (key === 'tags' && Array.isArray(mediaData[key])) {
            formData.append(key, JSON.stringify(mediaData[key]));
        } else {
            formData.append(key, mediaData[key]);
        }
      }
    });

    // YA NO NECESITAMOS 'headers: { Content-Type: undefined }'
    // El interceptor de axios.js lo hará por nosotros.
    const response = await api.post(`/api/media/media/`, formData);
    return response.data;
  },

  // Actualizar contenido
  updateMedia: async (id, mediaData) => {
    const response = await api.patch(`/api/media/media/${id}/`, mediaData);
    return response.data;
  },

  // Eliminar contenido
  deleteMedia: async (id) => {
    const response = await api.delete(`/api/media/media/${id}/`);
    return response.data;
  },

  // Aprobar contenido
  approveMedia: async (mediaId) => {
    const response = await api.post(`/api/media/media/${mediaId}/approve/`);
    return response.data;
  },

  // Destacar contenido
  featureMedia: async (mediaId) => {
    const response = await api.post(`/api/media/media/${mediaId}/feature/`);
    return response.data;
  },

  // Registrar visualización
  recordView: async (mediaId, duration = 0) => {
    const response = await api.post(`/api/media/media/${mediaId}/record_view/`, {
      duration_watched: duration
    });
    return response.data;
  }
};