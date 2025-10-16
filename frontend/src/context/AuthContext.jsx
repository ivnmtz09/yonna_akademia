import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("auth/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Error verificando autenticación:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const res = await api.post("auth/login/", credentials);
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      await checkAuth();
      return { success: true };
    } catch (err) {
      console.error("Error en login:", err);
      return {
        success: false,
        error: err.response?.data?.detail || "Credenciales inválidas",
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post("auth/register/", userData);
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Error en registro:", err);
      return {
        success: false,
        error:
          err.response?.data?.detail ||
          err.response?.data?.email?.[0] ||
          "Error al registrar usuario",
      };
    }
  };

  const loginWithGoogle = async (idToken) => {
    try {
      const res = await api.post("auth/google/", { token: idToken });
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      await checkAuth();
      return { success: true };
    } catch (err) {
      console.error("Error en login con Google:", err);
      return {
        success: false,
        error: err.response?.data?.detail || "Error en autenticación Google",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
