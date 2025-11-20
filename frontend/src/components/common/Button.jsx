import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  loading = false,
  disabled,
  type = 'button',
  ...props 
}) => {
  
  const baseClasses = `
    relative inline-flex items-center justify-center 
    font-bold rounded-xl transition-all duration-300 
    transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-brand-orange to-[#E65C00] 
      hover:from-[#E65C00] hover:to-[#CC4A00] 
      text-white shadow-lg shadow-brand-orange/30 hover:shadow-brand-orange/50
      focus:ring-brand-orange
    `,
    secondary: `
      bg-gradient-to-r from-brand-green to-brand-dark 
      hover:from-brand-dark hover:to-[#1E4E3A] 
      text-white shadow-lg shadow-brand-green/30 hover:shadow-brand-green/50
      focus:ring-brand-green
    `,
    outline: `
      bg-white border-2 border-slate-200 
      text-slate-600 hover:border-brand-green hover:text-brand-green hover:bg-brand-light/30
      focus:ring-slate-200
    `,
    danger: `
      bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:border-red-200
      focus:ring-red-500
    `,
    ghost: `
      bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100
    `
  };

  // Tamaños
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    icon: 'p-3' // Para botones que son solo iconos
  };

  const sizeClass = props.size ? sizes[props.size] : sizes.md;

  return (
    <button 
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
      )}
      {children}
    </button>
  );
};

export default Button;