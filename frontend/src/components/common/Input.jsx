import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

const Input = forwardRef(({ label, error, className = '', icon: Icon, ...props }, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        
        <input
          ref={ref}
          className={`
            w-full bg-white border text-slate-900 text-sm rounded-xl px-4 py-3
            transition-all duration-200 outline-none
            placeholder:text-slate-400
            ${Icon ? 'pl-10' : ''}
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
              : 'border-slate-200 hover:border-slate-300 focus:border-brand-green focus:ring-4 focus:ring-brand-green/10'
            }
          `}
          {...props}
        />

        {/* Icono de error a la derecha */}
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none animate-in fade-in zoom-in">
            <AlertCircle size={18} />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 ml-1 text-sm text-red-500 font-medium flex items-center gap-1 animate-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;