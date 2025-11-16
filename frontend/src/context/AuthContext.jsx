import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/auth/profile/');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login/', {
        email,
        password,
      });

      const { access, refresh, ...userData } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      setUser(userData);
      return userData;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const googleLogin = async (credential) => {
    try {
      const response = await axios.post('/auth/google/', {
        access_token: credential
      });

      const { access, refresh, ...userData } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      setUser(userData);
      return userData;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión con Google');
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register/', userData);
      
      // Auto-login después del registro
      const loginResponse = await axios.post('/auth/login/', {
        email: userData.email,
        password: userData.password1
      });

      const { access, refresh, ...userDataFromLogin } = loginResponse.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      setUser(userDataFromLogin);
      return userDataFromLogin;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al registrar usuario');
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    toast.success('¡Hasta pronto!');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.patch('/auth/profile/', profileData);
      setUser(prev => ({ ...prev, ...response.data }));
      toast.success('Perfil actualizado correctamente');
      return response.data;
    } catch (error) {
      toast.error('Error al actualizar el perfil');
      throw error;
    }
  };

  const addXP = async (xpAmount) => {
    try {
      const response = await axios.post('/auth/add-xp/', { xp_amount: xpAmount });
      setUser(prev => ({
        ...prev,
        xp: response.data.xp,
        level: response.data.level,
      }));
      toast.success(`¡Ganaste ${xpAmount} XP!`);
      return response.data;
    } catch (error) {
      toast.error('Error al agregar XP');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    googleLogin,
    register,
    logout,
    updateProfile,
    addXP,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;