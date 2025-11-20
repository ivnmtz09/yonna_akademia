import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import RegisterForm from './RegisterForm';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  
  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-200 border border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur z-20">
          <div>
             <h2 className="text-2xl font-extrabold text-slate-800">Únete a Yonna Akademia</h2>
             <p className="text-slate-500 text-sm">Empieza tu viaje de aprendizaje hoy</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 md:p-8">
          <RegisterForm onSuccess={onClose} />
          
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-600">
              ¿Ya tienes una cuenta?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-[#60AB90] hover:text-[#2D6B53] font-bold transition-colors"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;