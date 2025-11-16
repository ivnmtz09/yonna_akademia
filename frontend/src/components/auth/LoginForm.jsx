import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

import Button from '../common/Button';
import Input from '../common/Input';
import useAuth from '../../hooks/useAuth';

const loginSchema = yup.object({
  email: yup
    .string()
    .email('Ingresa un email válido')
    .required('El email es requerido'),
  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
});

const LoginForm = ({ onSwitchToRegister, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, googleLogin, loading } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('¡Bienvenido de nuevo!');
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      toast.success('¡Bienvenido con Google!');
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión con Google');
    }
  };

  const handleGoogleError = () => {
    toast.error('Error al iniciar sesión con Google');
  };

  return (
    <div className="w-full max-w-sm mx-auto p-1">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-[#60AB90] to-[#2D6B53] rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Bienvenido de vuelta
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Ingresa a tu cuenta para continuar aprendiendo
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-4">
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="tu@email.com"
            error={errors.email?.message}
            {...register('email')}
            icon={<Mail size={20} className="text-gray-400" />}
            className="w-full"
          />
          
          <div className="relative">
            <Input
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
              icon={<Lock size={20} className="text-gray-400" />}
              className="w-full pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-[#FF8025] focus:ring-[#FF8025]"
            />
            <span className="text-gray-600">Recordarme</span>
          </label>
          
          <button
            type="button"
            className="text-[#FF8025] hover:text-[#E65C00] font-medium transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="large"
          loading={loading}
          className="w-full py-3 text-base font-semibold"
        >
          Iniciar Sesión
        </Button>
      </form>

      {/* Separator */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-500">O continúa con</span>
          </div>
        </div>

        <div className="mt-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            text="continue_with"
            shape="rectangular"
            width="100%"
          />
        </div>
      </div>

      {/* Switch to Register */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-[#FF8025] hover:text-[#E65C00] font-semibold transition-colors"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;