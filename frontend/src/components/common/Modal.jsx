import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, leftContent }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop con blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all"
              >
                <X size={24} className="text-gray-600" />
              </button>

              <div className="flex flex-col md:flex-row min-h-[600px]">
                {/* Left Panel - Information */}
                <div className="hidden md:flex md:w-5/12 bg-[#ff914d] p-12 flex-col justify-center relative overflow-hidden">
                  {/* Patron decorativo */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 border-4 border-white rounded-full"></div>
                    <div className="absolute top-1/2 left-1/4 w-20 h-20 border-4 border-white transform rotate-45"></div>
                  </div>

                  <div className="relative z-10">
                    <div className="mb-8">
                      <img 
                        src="/icon.png" 
                        alt="Yonna" 
                        className="w-20 h-20 object-contain mb-4"
                      />
                      <h2 className="text-3xl font-bold text-white mb-2">
                        Yonna Akademia
                      </h2>
                      <p className="text-white/90 text-lg">
                        Aprende Wayuunaiki
                      </p>
                    </div>

                    {leftContent || (
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <BookOpen size={24} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg mb-1">
                              Lecciones Interactivas
                            </h3>
                            <p className="text-white/80 text-sm">
                              Aprende con contenido estructurado y adaptado a tu nivel
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Award size={24} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg mb-1">
                              Sistema de Logros
                            </h3>
                            <p className="text-white/80 text-sm">
                              Gana puntos y desbloquea logros mientras aprendes
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Users size={24} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg mb-1">
                              Comunidad Activa
                            </h3>
                            <p className="text-white/80 text-sm">
                              Únete a miles de estudiantes preservando el Wayuunaiki
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Panel - Form */}
                <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[600px]">
                  <div className="max-w-md mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      {title}
                    </h2>
                    <p className="text-gray-600 mb-8">
                      {title === 'Iniciar Sesión' 
                        ? 'Bienvenido de vuelta a Yonna Akademia' 
                        : 'Crea tu cuenta y comienza a aprender'}
                    </p>
                    
                    {children}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;