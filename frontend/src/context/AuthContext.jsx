import { createContext, useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await api.get('/auth/profile/');
        setUser(response.data);
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData);
      
      if (response.data.access && response.data.refresh) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        await checkAuth();
        toast.success('Registro exitoso');
        return { success: true };
      } else {
        toast.success('Registro exitoso. Por favor, inicia sesión.');
        return { success: true, needsLogin: true };
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg = error.response?.data?.email?.[0] || 
                       error.response?.data?.password1?.[0] ||
                       error.response?.data?.non_field_errors?.[0] ||
                       'Error en el registro';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login/', credentials);
      
      if (response.data.access && response.data.refresh) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        await checkAuth();
        toast.success('Inicio de sesión exitoso');
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.non_field_errors?.[0] ||
                       error.response?.data?.detail ||
                       'Credenciales incorrectas';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const loginWithGoogle = async (accessToken) => {
    try {
      console.log('Attempting Google login with token:', accessToken);
      
      // El backend de Django espera el token en el campo "access_token"
      const response = await api.post('/auth/google/', {
        access_token: accessToken,
      });
      
      console.log('Google login response:', response.data);
      
      if (response.data.access && response.data.refresh) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        await checkAuth();
        toast.success('Inicio de sesión con Google exitoso');
        return { success: true };
      }
    } catch (error) {
      console.error('Google login error:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMsg = error.response?.data?.non_field_errors?.[0] ||
                       error.response?.data?.detail ||
                       'Error al iniciar sesión con Google';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    toast.success('Sesión cerrada');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.patch('/auth/profile/', profileData);
      setUser(response.data);
      toast.success('Perfil actualizado');
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Error al actualizar el perfil');
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        loginWithGoogle,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};