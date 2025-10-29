import { useAuth } from '../../hooks/useAuth';
import { User, LogOut, UserCircle, Award, BookOpen as BookIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = ({ onOpenLogin, onOpenRegister }) => {
  const { user, logout } = useAuth();

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-br from-[#ff914d] via-[#ff8040] to-[#ff7a2e] shadow-2xl z-50 flex flex-col">
      {/* Logo Section */}
      <div className="px-6 py-8 border-b border-white/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <img 
              src="/icon.png" 
              alt="Yonna" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Yonna</h2>
            <p className="text-white/80 text-xs">Akademia</p>
          </div>
        </div>
      </div>

      {/* User Section */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {user ? (
          <div className="space-y-4">
            {/* User Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.first_name}
                    className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center border-3 border-white shadow-lg">
                    <UserCircle size={32} className="text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-base truncate">
                    {user.first_name}
                  </p>
                  <p className="text-white/80 text-xs truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/20">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Award size={14} className="text-white" />
                    <span className="text-white/80 text-xs font-medium">Nivel</span>
                  </div>
                  <p className="text-white text-sm font-bold capitalize">
                    {user.level === 'beginner' ? 'Inicial' : 
                     user.level === 'intermediate' ? 'Medio' : 'Avanzado'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <BookIcon size={14} className="text-white" />
                    <span className="text-white/80 text-xs font-medium">Cursos</span>
                  </div>
                  <p className="text-white text-sm font-bold">0</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                to="/perfil"
                className="flex items-center gap-3 px-4 py-3 bg-white/15 hover:bg-white/25 rounded-xl transition-all border border-white/30 backdrop-blur-sm group"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all">
                  <User size={20} className="text-white" />
                </div>
                <span className="text-white font-semibold">Mi Perfil</span>
              </Link>

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white/15 hover:bg-red-500/30 rounded-xl transition-all border border-white/30 backdrop-blur-sm group"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition-all">
                  <LogOut size={20} className="text-white" />
                </div>
                <span className="text-white font-semibold">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Welcome Message */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCircle size={36} className="text-white" />
              </div>
              <p className="text-white text-center text-sm leading-relaxed">
                Inicia sesión para comenzar tu viaje de aprendizaje del Wayuunaiki
              </p>
            </div>

            {/* Auth Buttons */}
            <div className="space-y-3">
              <button
                onClick={onOpenLogin}
                className="w-full px-6 py-4 bg-white text-[#ff914d] rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                Iniciar Sesión
              </button>

              <button
                onClick={onOpenRegister}
                className="w-full px-6 py-4 bg-white/15 backdrop-blur-md text-white rounded-xl font-bold hover:bg-white/25 transition-all border-2 border-white/40 hover:scale-105 transform"
              >
                Registrarse
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <p className="text-white/90 text-xs text-center leading-relaxed">
            Preservando la cultura Wayuu a través de la tecnología
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;