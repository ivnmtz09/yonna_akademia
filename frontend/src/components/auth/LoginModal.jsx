import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  
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
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-200 border border-white/20">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">Bienvenido</h2>
            <p className="text-slate-500 text-sm">Ingresa a tu cuenta Yonna Akademia</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 md:p-8">
          <LoginForm 
            onSuccess={onClose} 
            onSwitchToRegister={onSwitchToRegister} 
          />
        </div>
      </div>
    </div>
  );
};

export default LoginModal;