import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // --- CORRECCIÓN CRÍTICA AQUÍ ---
    // Si estamos enviando archivos (FormData), borramos el Content-Type
    // para dejar que el navegador establezca el boundary correcto automáticamente.
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (Igual que antes)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/api/auth/token/refresh/`, {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          localStorage.setItem('accessToken', access);
          
          // Actualizar headers para el reintento
          originalRequest.headers.Authorization = `Bearer ${access}`;
          // Asegurar que el reintento también respete la regla de FormData
          if (originalRequest.data instanceof FormData) {
             delete originalRequest.headers['Content-Type'];
          }
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    // Logs para depuración del error 400
    if (error.response?.status === 400) {
       console.error("Detalle del Error 400:", error.response.data);
    }

    if (error.response?.status >= 500) {
      toast.error('Error del servidor. Por favor, intenta más tarde.');
    } else if (error.response?.data?.detail) {
      toast.error(error.response.data.detail);
    }

    return Promise.reject(error);
  }
);

export default api;