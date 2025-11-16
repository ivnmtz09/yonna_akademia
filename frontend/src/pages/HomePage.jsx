import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Award, Users, BookOpen, ChevronDown, Sparkles, Target, Star, Clock, CheckCircle } from 'lucide-react';

import Button from '../components/common/Button';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';
import useAuth from '../hooks/useAuth';

const HomePage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />,
      title: 'Aprende Wayuunaiki',
      description: 'Domina el idioma del pueblo Wayuu con lecciones interactivas y culturalmente relevantes.',
      color: 'from-[#60AB90] to-[#2D6B53]',
      stats: '50+ Lecciones'
    },
    {
      icon: <Award className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />,
      title: 'Sistema de Niveles',
      description: 'Sube de nivel, gana XP y desbloquea nuevos cursos mientras progresas en tu aprendizaje.',
      color: 'from-[#FF8025] to-[#E65C00]',
      stats: 'XP Progresivo'
    },
    {
      icon: <Users className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />,
      title: 'Comunidad Activa',
      description: 'Conecta con otros estudiantes y sabedores Wayuu para practicar y compartir conocimientos.',
      color: 'from-[#60AB90] to-[#2D6B53]',
      stats: 'Comunidad Viva'
    },
    {
      icon: <Target className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />,
      title: 'Aprendizaje Gamificado',
      description: 'Logros, recompensas y desafíos que hacen del aprendizaje una experiencia divertida.',
      color: 'from-[#FF8025] to-[#E65C00]',
      stats: '++ Motivación'
    }
  ];

  const benefits = [
    {
      icon: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: 'Método probado y efectivo'
    },
    {
      icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: 'Aprende a tu propio ritmo'
    },
    {
      icon: <Star className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: 'Contenido culturalmente auténtico'
    },
    {
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: 'Soporte de la comunidad Wayuu'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F9F5] via-white to-[#F0F9F5] overflow-x-hidden">
      {/* Header Simple para Home (sin navegación) */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#60AB90]/20 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#60AB90] to-[#2D6B53] rounded-lg sm:rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-base">Y</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#60AB90] to-[#2D6B53] bg-clip-text text-transparent">
                  Yonna Akademia
                </h1>
                <p className="text-xs text-gray-500 font-medium hidden sm:block">Cultura Wayuu • Idioma Vivo</p>
              </div>
            </motion.div>
            
            {/* Botones de Acción */}
            {!user && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2 sm:space-x-3"
              >
                <Button 
                  variant="outline"
                  onClick={() => setShowLogin(true)}
                  className="text-xs sm:text-sm border-[#60AB90] text-[#60AB90] hover:bg-[#60AB90] hover:text-white transition-all duration-300 px-3 sm:px-4 py-2"
                >
                  Iniciar Sesión
                </Button>
                <Button 
                  variant="primary"
                  onClick={() => setShowRegister(true)}
                  className="text-xs sm:text-sm bg-gradient-to-r from-[#FF8025] to-[#E65C00] hover:from-[#E65C00] hover:to-[#CC4A00] shadow-lg hover:shadow-xl px-3 sm:px-4 py-2"
                >
                  Comenzar
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left space-y-6 sm:space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-[#60AB90]/10 text-[#2D6B53] px-4 py-2 rounded-full border border-[#60AB90]/20 text-sm"
              >
                <Sparkles className="w-4 h-4 text-[#FF8025]" />
                <span className="font-semibold">Plataforma especializada en Wayuunaiki</span>
              </motion.div>
              
              {/* Título Principal */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Aprende{' '}
                  <span className="bg-gradient-to-r from-[#60AB90] to-[#FF8025] bg-clip-text text-transparent">
                    Wayuunaiki
                  </span>{' '}
                  de forma divertida
                </h1>
                
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Sumérgete en la cultura Wayuu mientras dominas su idioma a través de 
                  lecciones gamificadas, quizzes interactivos y una comunidad vibrante.
                </p>
              </motion.div>

              {/* Benefits List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center space-x-3 text-gray-700 text-sm sm:text-base"
                  >
                    <div className="w-6 h-6 bg-[#60AB90]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <span className="font-medium">{benefit.text}</span>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Botones de Acción */}
              {!user && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-4"
                >
                  <Button 
                    size="large" 
                    variant="primary"
                    onClick={() => setShowRegister(true)}
                    className="text-sm sm:text-base px-6 sm:px-8 py-3 bg-gradient-to-r from-[#FF8025] to-[#E65C00] hover:from-[#E65C00] hover:to-[#CC4A00] shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Comenzar Ahora
                  </Button>
                  <Button 
                    size="large" 
                    variant="outline"
                    onClick={() => setShowLogin(true)}
                    className="text-sm sm:text-base px-6 sm:px-8 py-3 border-2 border-[#60AB90] text-[#60AB90] hover:bg-[#60AB90] hover:text-white font-semibold"
                  >
                    Ver Demo
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {/* Feature Showcase */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mt-8 lg:mt-0"
            >
              <div className="relative z-10 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-4"
                  >
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-r ${features[currentFeature].color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                      {features[currentFeature].icon}
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        {features[currentFeature].title}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {features[currentFeature].description}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-[#60AB90] to-[#2D6B53] text-white py-2 px-4 rounded-full inline-block text-sm">
                      <span className="font-semibold">{features[currentFeature].stats}</span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Feature Indicators */}
                <div className="flex justify-center space-x-2 mt-6">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFeature(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentFeature 
                          ? 'bg-[#FF8025] w-6' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Background Elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#FF8025]/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#60AB90]/10 rounded-full blur-xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Por qué elegir{' '}
              <span className="bg-gradient-to-r from-[#60AB90] to-[#FF8025] bg-clip-text text-transparent">
                Yonna Akademia
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Combinamos la sabiduría ancestral del pueblo Wayuu con tecnología moderna 
              para crear una experiencia de aprendizaje única y efectiva.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <div className="bg-gray-50 rounded-2xl p-6 h-full border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#60AB90] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-[#60AB90] to-[#2D6B53]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center text-white space-y-6"
            >
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                  ¿Listo para comenzar tu viaje?
                </h2>
                <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
                  Únete a nuestra comunidad y descubre la riqueza cultural del pueblo Wayuu 
                  mientras aprendes su idioma de manera divertida y efectiva.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
                <Button 
                  size="large" 
                  variant="secondary"
                  onClick={() => setShowRegister(true)}
                  className="text-sm sm:text-base px-6 sm:px-8 py-3 bg-white text-[#60AB90] hover:bg-gray-100 hover:scale-105 transform transition-all duration-300 shadow-xl font-semibold"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Crear Cuenta Gratis
                </Button>
                <Button 
                  size="large" 
                  variant="outline"
                  onClick={() => setShowLogin(true)}
                  className="text-sm sm:text-base px-6 sm:px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-[#60AB90] font-semibold"
                >
                  Ya tengo cuenta
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2 lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#60AB90] to-[#2D6B53] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Y</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Yonna Akademia</h3>
                  <p className="text-[#60AB90] font-medium">Cultura Wayuu • Idioma Vivo</p>
                </div>
              </div>
              <p className="text-gray-400 max-w-md leading-relaxed text-sm">
                Plataforma educativa dedicada a preservar y enseñar el idioma Wayuunaiki 
                mediante tecnología moderna y metodologías gamificadas.
              </p>
            </div>
            
            {/* Links */}
            <div className="space-y-3">
              <h3 className="font-bold text-white">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[#60AB90] transition-colors duration-300 text-sm">Inicio</a></li>
                <li><a href="#" className="hover:text-[#60AB90] transition-colors duration-300 text-sm">Cursos</a></li>
                <li><a href="#" className="hover:text-[#60AB90] transition-colors duration-300 text-sm">Quizzes</a></li>
                <li><a href="#" className="hover:text-[#60AB90] transition-colors duration-300 text-sm">Comunidad</a></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-bold text-white">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[#60AB90] transition-colors duration-300 text-sm">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-[#60AB90] transition-colors duration-300 text-sm">Contacto</a></li>
                <li><a href="#" className="hover:text-[#60AB90] transition-colors duration-300 text-sm">Política de Privacidad</a></li>
                <li><a href="#" className="hover:text-[#60AB90] transition-colors duration-300 text-sm">Términos</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              &copy; 2024 Yonna Akademia. Honrando la cultura Wayuu.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal 
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />

      <RegisterModal 
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </div>
  );
};

export default HomePage;