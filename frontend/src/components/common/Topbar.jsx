import { Link, useLocation } from 'react-router-dom';
import { BookOpen, MessageSquare, Home } from 'lucide-react';

const Topbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed top-0 left-0 lg:left-80 right-0 bg-white border-b border-gray-200 shadow-sm z-30 h-20">
      <div className="flex items-center justify-between h-full px-8 lg:px-8">
        <div className="flex items-center gap-3 ml-16 lg:ml-0">
          <img 
            src="/icon.png" 
            alt="Yonna Akademia" 
            className="w-12 h-12 object-contain"
          />
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
              Yonna Akademia
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">Aprende Wayuunaiki</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          <Link
            to="/"
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              isActive('/') 
                ? 'bg-[#ff914d] text-white shadow-lg' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Home size={20} />
            <span className="hidden lg:inline">Inicio</span>
          </Link>
          <Link
            to="/cursos"
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              isActive('/cursos') 
                ? 'bg-[#ff914d] text-white shadow-lg' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BookOpen size={20} />
            <span className="hidden lg:inline">Cursos</span>
          </Link>
          <Link
            to="/quizzes"
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              isActive('/quizzes') 
                ? 'bg-[#ff914d] text-white shadow-lg' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <MessageSquare size={20} />
            <span className="hidden lg:inline">Quizzes</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Topbar;