import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

const RegisterForm = ({ onSuccess }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password1: '',
    password2: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Nuevo estado
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password1 !== formData.password2) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password1.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data?.error || 
                  err.response?.data?.detail || 
                  err.response?.data?.email?.[0] ||
                  'Error al crear la cuenta. Intenta nuevamente.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#60AB90]/20 focus:border-[#60AB90] transition-all placeholder:text-slate-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl text-sm mb-4 animate-in fade-in slide-in-from-top-2">
          <p className="font-bold">Oops!</p>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Nombre</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className={inputClasses}
              placeholder="Tu nombre"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Apellido</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className={inputClasses}
              placeholder="Tu apellido"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Correo Electrónico</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={inputClasses}
            placeholder="tu@email.com"
          />
        </div>
      </div>

      {/* Contraseña 1 */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Contraseña</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password1"
            value={formData.password1}
            onChange={handleChange}
            required
            className={`${inputClasses} pr-10`}
            placeholder="Mínimo 6 caracteres"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Contraseña 2 */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Confirmar Contraseña</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            required
            className={`${inputClasses} pr-10`}
            placeholder="Repite tu contraseña"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#60AB90] hover:bg-[#4da385] disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#60AB90]/20 flex items-center justify-center gap-2 mt-6 transform active:scale-[0.98]"
      >
        {loading ? <Loader2 className="animate-spin" /> : <ArrowRight size={20} />}
        {loading ? 'Creando cuenta...' : 'Crear Cuenta Gratis'}
      </button>
    </form>
  );
};

export default RegisterForm;