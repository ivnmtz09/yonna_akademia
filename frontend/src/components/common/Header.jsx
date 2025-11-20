import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import { 
  Home, 
  Film, 
  User, 
  BarChart2, 
  Menu, 
  X, 
  LogOut,
  Smartphone,
  ChevronRight
} from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleOpenLogin = () => {
    setIsLoginModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleOpenRegister = () => {
    setIsRegisterModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleCloseModals = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  const navigation = user ? [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Cultura Wayuu', href: '/feed', icon: Film },
    ...(user?.role === 'admin' || user?.role === 'moderator' 
      ? [{ name: 'Dashboard', href: '/dashboard', icon: BarChart2 }]
      : []
    ),
    { name: 'Mi Perfil', href: '/profile', icon: User },
  ] : [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Cultura Wayuu', href: '/feed', icon: Film },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-green/20 rounded-full blur-md group-hover:blur-lg transition-all"></div>
                <img 
                  src="/yonna.png" 
                  alt="Yonna" 
                  className="relative h-10 w-10 object-contain transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-2xl font-bold text-slate-800 tracking-tight group-hover:text-brand-green transition-colors">
                Yonna Akademia
              </span>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-brand-light text-brand-dark ring-1 ring-brand-green/20'
                        : 'text-slate-500 hover:text-brand-dark hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={18} className={`mr-2 ${isActive(item.href) ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Actions - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              {/* App Download Link Mini */}
              <a 
                href="https://drive.google.com/file/d/1-c593ZnC-us-4zT5qWWVjP8N1rOfUoSp/view?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-brand-orange transition-colors"
                title="Descargar App Android"
              >
                <Smartphone size={20} />
              </a>

              <div className="h-6 w-px bg-slate-200"></div>

              {user ? (
                <div className="flex items-center gap-3 pl-2">
                  <div className="text-right hidden lg:block">
                    <div className="text-sm font-bold text-slate-700 leading-none mb-1">
                      {user?.first_name || user?.email?.split('@')[0]}
                    </div>
                    <div className="text-xs font-medium text-brand-orange bg-orange-50 px-2 py-0.5 rounded-full inline-block">
                      Nivel {user?.level || 1}
                    </div>
                  </div>
                  
                  <div className="relative group cursor-pointer">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-green to-brand-dark flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white group-hover:ring-brand-light transition-all">
                      {user?.first_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    
                    {/* Dropdown Logout (Simple hover logic for demo) */}
                    <div className="absolute right-0 top-full mt-2 w-48 py-1 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleOpenLogin}
                    className="text-slate-600 hover:text-brand-dark font-semibold text-sm px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Ingresar
                  </button>
                  <button
                    onClick={handleOpenRegister}
                    className="bg-brand-dark hover:bg-brand-green text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg shadow-brand-green/30 hover:shadow-brand-green/50 transition-all transform hover:-translate-y-0.5"
                  >
                    Crear Cuenta
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl absolute w-full shadow-2xl animate-in slide-in-from-top-5 duration-200">
            <div className="p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                      isActive(item.href)
                        ? 'bg-brand-light/50 text-brand-dark font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} />
                      {item.name}
                    </div>
                    {isActive(item.href) && <ChevronRight size={16} />}
                  </Link>
                );
              })}

              <div className="h-px bg-slate-100 my-4"></div>

              {/* Mobile Download CTA */}
              <a 
                href="https://drive.google.com/file/d/1-c593ZnC-us-4zT5qWWVjP8N1rOfUoSp/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:text-brand-orange hover:bg-orange-50 transition-colors"
              >
                <Smartphone size={20} />
                <span>Descargar App Móvil</span>
              </a>

              <div className="h-px bg-slate-100 my-4"></div>

              {user ? (
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-brand-dark flex items-center justify-center text-white font-bold">
                      {user?.first_name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{user?.first_name}</p>
                      <p className="text-xs text-slate-500">Nivel {user?.level}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-lg text-red-500 font-medium text-sm shadow-sm active:scale-95 transition-transform"
                  >
                    <LogOut size={16} />
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleOpenLogin}
                    className="py-3 rounded-xl font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    Ingresar
                  </button>
                  <button
                    onClick={handleOpenRegister}
                    className="py-3 rounded-xl font-semibold text-white bg-brand-dark hover:bg-brand-green transition-colors shadow-lg shadow-brand-green/20"
                  >
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseModals}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
      
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={handleCloseModals}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </>
  );
};

export default Header;