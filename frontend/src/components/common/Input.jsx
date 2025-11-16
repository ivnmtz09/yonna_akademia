import React from 'react';
import { clsx } from 'clsx';

const Input = React.forwardRef(({
  label,
  error,
  helperText,
  className = '',
  variant = 'default',
  ...props
}, ref) => {
  const baseClasses = 'w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2';
  
  const variants = {
    default: 'border-gray-300 focus:border-orange-500 focus:ring-orange-200 bg-white',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-200 bg-white',
    success: 'border-green-500 focus:border-green-500 focus:ring-green-200 bg-white',
  };
  
  const inputClasses = clsx(
    baseClasses,
    variants[error ? 'error' : variant],
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={inputClasses}
        {...props}
      />
      {(error || helperText) && (
        <p className={clsx(
          "mt-1 text-sm",
          error ? "text-red-600" : "text-gray-500"
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;