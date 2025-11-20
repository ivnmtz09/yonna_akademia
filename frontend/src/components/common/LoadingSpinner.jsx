import React from 'react';

const LoadingSpinner = ({ fullScreen = false, size = 'md', text = 'Cargando...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  const Spinner = () => (
    <div className={`rounded-full border-gray-200 border-t-brand-orange animate-spin ${sizeClasses[size]}`}></div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
        <Spinner />
        {text && (
          <p className="mt-4 text-brand-dark font-semibold animate-pulse">
            {text}
          </p>
        )}
      </div>
    );
  }

  return <Spinner />;
};

export default LoadingSpinner;