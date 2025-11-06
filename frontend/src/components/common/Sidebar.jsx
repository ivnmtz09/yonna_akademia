import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, LogOut, UserCircle, Award, BookOpen, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ onOpenLogin, onOpenRegister }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-3 bg-[#ff914d] text-white rounded-xl shadow-lg hover:bg-[#ff7a2e] transition-all lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : '-100%',
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="fixed left-0 top-0 h-screen w-80 bg-white shadow-2xl z-50 flex flex-col lg:translate-x-0"
      >
        {/* Logo Section */}
        <div className="px-6 py-6 bg-[#ff914d] border-b border-[#ff7a2e]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <img 
                src="/icon.png" 
                alt="Yonna" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">Yonna</h2>
              <p className="text-white/90 text-sm">Akademia</p>
            </div>
          </div>
        </div>

        {/* User Section */}
        <div className="flex-1 px-6 py-6 overflow-y-auto">
          {user ? (
            <div className="space-y-4">
              {/* User Card */}
              <div className="bg-orange-50 rounded-2xl p-4 border-2 border-orange-100">
                <div className="flex items-center gap-3 mb-4">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.first_name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#ff914d]"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#ff914d] flex items-center justify-center">
                      <UserCircle size={32} className="text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-bold text-base truncate">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-gray-600 text-xs truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-orange-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Award size={14} className="text-[#ff914d]" />
                      <span className="text-gray-600 text-xs font-medium">Nivel</span>
                    </div>
                    <p className="text-gray-800 text-sm font-bold capitalize">
                      {user.level === 'beginner' ? 'Inicial' : 
                       user.level === 'intermediate' ? 'Medio' : 'Avanzado'}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <BookOpen size={14} className="text-[#00b894]" />
                      <span className="text-gray-600 text-xs font-medium">Cursos</span>
                    </div>
                    <p className="text-gray-800 text-sm font-bold">0</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  to="/perfil"
                  onClick={closeSidebar}
                  className="flex items-center gap-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all group"
                >
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:bg-[#ff914d] group-hover:text-white transition-all">
                    <User size={20} />
                  </div>
                  <span className="text-gray-800 font-semibold">Mi Perfil</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    closeSidebar();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 rounded-xl transition-all group"
                >
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
                    <LogOut size={20} />
                  </div>
                  <span className="text-red-600 font-semibold">Cerrar Sesión</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Welcome Message */}
              <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-100">
                <div className="w-16 h-16 bg-[#ff914d] rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCircle size={36} className="text-white" />
                </div>
                <p className="text-gray-700 text-center text-sm leading-relaxed">
                  Inicia sesión para comenzar tu viaje de aprendizaje del Wayuunaiki
                </p>
              </div>

              {/* Auth Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    onOpenLogin();
                    closeSidebar();
                  }}
                  className="w-full px-6 py-4 bg-[#ff914d] text-white rounded-xl font-bold hover:bg-[#ff7a2e] transition-all shadow-lg"
                >
                  Iniciar Sesión
                </button>

                <button
                  onClick={() => {
                    onOpenRegister();
                    closeSidebar();
                  }}
                  className="w-full px-6 py-4 bg-white text-[#ff914d] rounded-xl font-bold hover:bg-gray-50 transition-all border-2 border-[#ff914d]"
                >
                  Registrarse
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
            <p className="text-gray-600 text-xs text-center leading-relaxed">
              Preservando la cultura Wayuu a través de la tecnología
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;