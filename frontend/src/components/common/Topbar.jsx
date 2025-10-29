import { Link, useLocation } from 'react-router-dom';
import { BookOpen, MessageSquare, Home } from 'lucide-react';

const Topbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed top-0 left-64 right-0 bg-white border-b border-gray-200 shadow-sm z-30 h-20">
      <div className="flex items-center justify-between h-full px-8">
        <div className="flex items-center gap-3">
          <img 
            src="/icon.png" 
            alt="Yonna Akademia" 
            className="w-12 h-12 object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ff914d] to-[#00b894] bg-clip-text text-transparent">
              Yonna Akademia
            </h1>
            <p className="text-xs text-gray-500">Aprende Wayuunaiki</p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Link
            to="/"
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              isActive('/') 
                ? 'bg-gradient-to-r from-[#ff914d] to-[#ff7a2e] text-white shadow-lg' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Home size={20} />
            Inicio
          </Link>
          <Link
            to="/cursos"
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              isActive('/cursos') 
                ? 'bg-gradient-to-r from-[#ff914d] to-[#ff7a2e] text-white shadow-lg' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BookOpen size={20} />
            Cursos
          </Link>
          <Link
            to="/quizzes"
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              isActive('/quizzes') 
                ? 'bg-gradient-to-r from-[#ff914d] to-[#ff7a2e] text-white shadow-lg' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <MessageSquare size={20} />
            Quizzes
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Topbar;