import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Mail, Lock, Loader2, LogIn, Eye, EyeOff } from "lucide-react";

const LoginForm = ({ onSuccess, onSwitchToRegister }) => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para ver contraseña
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login({
        email: data.email,
        password: data.password
      });
      
      toast.success('¡Bienvenido de nuevo a Yonna!');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error de login:', error);
      const errorMessage = error.response?.data?.detail || 'Credenciales incorrectas. Intenta de nuevo.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
          Correo electrónico
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="email"
            {...register("email", { 
              required: "El email es requerido",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Email inválido"
              }
            })}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#60AB90]/20 transition-all ${
              errors.email ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-[#60AB90]'
            }`}
            placeholder="tu@email.com"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.email.message}</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5 ml-1">
          <label className="block text-sm font-bold text-slate-700">
            Contraseña
          </label>
          <a href="#" className="text-xs font-medium text-[#60AB90] hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type={showPassword ? "text" : "password"} // Tipo dinámico
            {...register("password", { 
              required: "La contraseña es requerida",
              minLength: { value: 6, message: "Mínimo 6 caracteres" }
            })}
            className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#60AB90]/20 transition-all ${
              errors.password ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-[#60AB90]'
            }`}
            placeholder="••••••••"
          />
          {/* Botón de Ver Contraseña */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#60AB90] hover:bg-[#4da385] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#60AB90]/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
      >
        {loading ? <Loader2 className="animate-spin" /> : <LogIn size={20} />}
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>

      <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">o continúa con</span>
          </div>
      </div>

      <div className="text-center">
        <p className="text-slate-600">
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-[#60AB90] hover:text-[#2D6B53] font-bold transition-colors"
          >
            Regístrate gratis
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;