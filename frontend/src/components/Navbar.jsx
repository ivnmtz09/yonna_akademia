import { Link, useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Home, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-white hover:text-yellow-100 transition-colors duration-200"
            onClick={closeMenu}
          >
            🌅 Wayuu Platform
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-white hover:text-yellow-100 hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200"
            >
              <Home size={18} />
              <span className="font-medium">Inicio</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-white hover:text-yellow-100 hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  <User size={18} />
                  <span className="font-medium">Perfil</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-white hover:text-yellow-100 hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Salir</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-white hover:text-yellow-100 hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  <LogIn size={18} />
                  <span className="font-medium">Iniciar Sesión</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 bg-white text-orange-600 hover:bg-yellow-100 px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <UserPlus size={18} />
                  <span>Registrarse</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-yellow-100 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/10 backdrop-blur-sm rounded-lg mt-2 mb-4 p-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="flex items-center gap-3 text-white hover:text-yellow-100 hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200"
                onClick={closeMenu}
              >
                <Home size={20} />
                <span className="font-medium">Inicio</span>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 text-white hover:text-yellow-100 hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200"
                    onClick={closeMenu}
                  >
                    <User size={20} />
                    <span className="font-medium">Perfil ({user?.username})</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-white hover:text-yellow-100 hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200 w-full text-left"
                  >
                    <LogOut size={20} />
                    <span className="font-medium">Salir</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-3 text-white hover:text-yellow-100 hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200"
                    onClick={closeMenu}
                  >
                    <LogIn size={20} />
                    <span className="font-medium">Iniciar Sesión</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-3 bg-white text-orange-600 hover:bg-yellow-100 px-3 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md"
                    onClick={closeMenu}
                  >
                    <UserPlus size={20} />
                    <span>Registrarse</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;