import { useEffect } from "react";
import api from "../api/axios";

const GoogleLoginButton = ({ onSuccess }) => {
  const handleCallback = async (response) => {
    const { credential } = response;
    try {
      const res = await api.post("auth/google/", { id_token: credential });
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      onSuccess?.(res.data);
    } catch (err) {
      console.error("Error en login con Google", err.response?.data || err);
      alert("Error al iniciar sesión con Google");
    }
  };

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCallback,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleButton"),
        { theme: "outline", size: "large", width: 300 } // fix de ancho
      );
    }
  }, []);

  return <div id="googleButton" className="flex justify-center mt-2"></div>;
};

export default GoogleLoginButton;
