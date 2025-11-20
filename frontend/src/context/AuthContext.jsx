// /src/context/AuthContext.jsx - VERSIÓN SIMPLIFICADA
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
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

  // LOGIN SIMPLIFICADO - Usa solo tu endpoint personalizado
  const login = async (credentials) => {
    try {
      console.log('🔐 Iniciando sesión con:', credentials);
      
      // Usar directamente tu LoginView que SÍ FUNCIONA
      const result = await authService.login(credentials);
      
      localStorage.setItem('accessToken', result.access);
      localStorage.setItem('refreshToken', result.refresh);
      
      // Los datos del usuario vienen en la respuesta del login
      setUser({
        id: result.id,
        email: result.email,
        role: result.role,
        level: result.level,
        xp: result.xp,
        first_name: result.first_name,
        last_name: result.last_name
      });
      
      return result;
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error;
    }
  };

  // REGISTRO - Ya funciona bien
  const register = async (userData) => {
    const result = await authService.register(userData);
    if (result.access) {
      localStorage.setItem('accessToken', result.access);
      localStorage.setItem('refreshToken', result.refresh);
      setUser(result.user || result);
    }
    return result;
  };

  // LOGOUT - Simplificado
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.warn('Error durante logout, limpiando localmente:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      toast.success('Sesión cerrada');
    }
  };

  // VERIFICAR AUTENTICACIÓN
  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Intentar obtener usuario actual
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      // Limpiar tokens inválidos
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};