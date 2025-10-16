import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from "./GoogleLoginButton";
import { Eye, EyeOff } from "lucide-react";

export default function LoginModal({ onClose, onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password1: "", password2: "" });
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(form);
    if (!res.success) setError(res.error);
    else onClose();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-center text-[#FF8025] mb-4">
          Inicia Sesión
        </h2>

        {error && (
          <p className="text-red-600 text-sm text-center mb-3">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            onChange={handleChange}
            value={form.email}
            className="border rounded-lg p-3"
            required
          />

          <div className="relative">
            <input
              type={showPassword1 ? "text" : "password"}
              name="password1"
              placeholder="Contraseña"
              onChange={handleChange}
              value={form.password1}
              className="border rounded-lg p-3 w-full pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword1(!showPassword1)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword1 ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showPassword2 ? "text" : "password"}
              name="password2"
              placeholder="Repite la contraseña"
              onChange={handleChange}
              value={form.password2}
              className="border rounded-lg p-3 w-full pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword2(!showPassword2)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="bg-[#60AB90] text-white rounded-lg p-3 font-semibold hover:bg-[#4b917a] transition"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="my-4">
          <GoogleLoginButton onSuccess={onClose} />
        </div>

        <p className="text-center text-sm text-gray-500 mt-2">
          ¿No tienes cuenta?{" "}
          <button
            className="text-[#FF8025] font-medium hover:underline"
            onClick={() => onSwitch("register")}
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
}
