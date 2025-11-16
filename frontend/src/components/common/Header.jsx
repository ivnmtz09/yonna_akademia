import React, { useState } from 'react';
import { Bell, Search, Menu, X, User, Settings, HelpCircle, LogOut, BookOpen, Award, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    {
      id: 1,
      title: '¡Nuevo curso disponible!',
      message: 'Curso "Saludos Básicos" está listo para comenzar',
      time: 'Hace 5 min',
      unread: true,
      type: 'course'
    },
    {
      id: 2,
      title: 'Subiste de nivel',
      message: 'Felicidades, ahora eres nivel 2',
      time: 'Hace 1 hora',
      unread: true,
      type: 'level'
    },
    {
      id: 3,
      title: 'Recordatorio de práctica',
      message: 'No olvides practicar hoy',
      time: 'Hace 2 horas',
      unread: false,
      type: 'reminder'
    }
  ];

  const menuItems = [
    { path: '/courses', icon: BookOpen, label: 'Cursos' },
    { path: '/quizzes', icon: HelpCircle, label: 'Quizzes' },
    { path: '/progress', icon: BarChart3, label: 'Progreso' },
    { path: '/achievements', icon: Award, label: 'Logros' },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Aquí puedes implementar la búsqueda
      console.log('Buscando:', searchQuery);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y Navegación Principal */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-[#60AB90] to-[#2D6B53] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-[#60AB90] to-[#2D6B53] bg-clip-text text-transparent">
                  Yonna Akademia
                </h1>
              </div>
            </motion.div>

            {/* Navegación Desktop */}
            <nav className="hidden lg:flex items-center space-x-6">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);
                
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-[#60AB90]/10 text-[#2D6B53]'
                        : 'text-gray-600 hover:text-[#60AB90] hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Barra de Búsqueda - Centrada en desktop */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar cursos, quizzes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60AB90] focus:border-transparent text-sm"
                />
              </div>
            </form>
          </div>

          {/* Sección Derecha - Acciones del Usuario */}
          <div className="flex items-center space-x-3">
            {/* Barra de Búsqueda Mobile */}
            <div className="lg:hidden">
              <button
                onClick={() => {/* Implementar búsqueda móvil */}}
                className="p-2 text-gray-600 hover:text-[#60AB90] transition-colors rounded-lg hover:bg-gray-100"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Notificaciones */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-600 hover:text-[#60AB90] transition-colors rounded-lg hover:bg-gray-100"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsNotificationsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
                    >
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Notificaciones
                        </h3>
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors ${
                              notification.unread ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => setIsNotificationsOpen(false)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 text-sm">
                                  {notification.title}
                                </p>
                                <p className="text-gray-600 text-xs mt-1">
                                  {notification.message}
                                </p>
                              </div>
                              {notification.unread && (
                                <div className="w-2 h-2 bg-[#60AB90] rounded-full ml-2 flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-gray-500 text-xs mt-2">
                              {notification.time}
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-4 border-t border-gray-200">
                        <button className="text-[#60AB90] hover:text-[#2D6B53] text-sm font-medium w-full text-center transition-colors">
                          Ver todas las notificaciones
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Menú de Perfil */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Nivel {Math.floor((user?.xp || 0) / 1000) + 1} • {user?.xp || 0} XP
                  </p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF8025] to-[#E65C00] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
                    >
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#FF8025] to-[#E65C00] rounded-full flex items-center justify-center text-white font-semibold">
                            {user?.first_name?.[0]}{user?.last_name?.[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user?.first_name} {user?.last_name}
                            </p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <button
                          onClick={() => {
                            handleNavigation('/profile');
                            setIsProfileMenuOpen(false);
                          }}
                          className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <User size={18} />
                          <span className="text-sm">Mi Perfil</span>
                        </button>
                        
                        <button className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                          <Settings size={18} />
                          <span className="text-sm">Configuración</span>
                        </button>
                        
                        <button className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                          <HelpCircle size={18} />
                          <span className="text-sm">Ayuda</span>
                        </button>
                        
                        <div className="border-t border-gray-200 my-2"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LogOut size={18} />
                          <span className="text-sm">Cerrar Sesión</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Botón Menú Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-[#60AB90] transition-colors rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 bg-white overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {/* Barra de búsqueda móvil */}
              <form onSubmit={handleSearch} className="pb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60AB90] focus:border-transparent text-sm"
                  />
                </div>
              </form>

              {/* Navegación móvil */}
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);
                
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-[#60AB90]/10 text-[#2D6B53]'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;