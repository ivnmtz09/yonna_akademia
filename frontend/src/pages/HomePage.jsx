import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, Trophy, Users, Sparkles } from 'lucide-react';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';

const HomePage = () => {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#ff914d]/20 via-orange-50 to-[#00b894]/20 pt-20 pl-64">
        <div className="max-w-6xl mx-auto px-8 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-6">
              <Sparkles size={20} className="text-[#ff914d]" />
              <span className="text-sm font-semibold text-gray-700">
                Plataforma de aprendizaje gamificada
              </span>
            </div>

            <h1 className="text-6xl font-bold text-gray-800 mb-6">
              Aprende{' '}
              <span className="text-[#ff914d]">Wayuunaiki</span>
              <br />
              de forma interactiva
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              Descubre el idioma Wayuunaiki a través de lecciones dinámicas,
              quizzes desafiantes y una experiencia de aprendizaje única.
            </p>

            {!user && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setShowRegister(true)}
                  className="px-8 py-4 bg-[#ff914d] hover:bg-[#ff7a2e] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
                >
                  Comenzar Ahora
                </button>
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg border-2 border-gray-300"
                >
                  Iniciar Sesión
                </button>
              </div>
            )}

            {user && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-2xl mx-auto border-2 border-[#ff914d]/20">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Bienvenido de nuevo, {user.first_name}
                </h2>
                <p className="text-gray-600 mb-6">
                  Continúa tu viaje de aprendizaje del Wayuunaiki
                </p>
                <button className="px-6 py-3 bg-[#ff914d] hover:bg-[#ff7a2e] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all">
                  Continuar Aprendiendo
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-[#ff914d]/10">
              <div className="w-16 h-16 bg-gradient-to-br from-[#ff914d] to-[#ff7a2e] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <BookOpen size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Lecciones Interactivas
              </h3>
              <p className="text-gray-600">
                Aprende con lecciones estructuradas que se adaptan a tu nivel
                y ritmo de aprendizaje.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-[#00b894]/10">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00b894] to-[#00a884] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Trophy size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Quizzes Desafiantes
              </h3>
              <p className="text-gray-600">
                Pon a prueba tus conocimientos con quizzes diseñados para
                reforzar tu aprendizaje.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-purple-500/10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Users size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Comunidad Activa
              </h3>
              <p className="text-gray-600">
                Únete a una comunidad de estudiantes apasionados por preservar
                el idioma Wayuunaiki.
              </p>
            </div>
          </div>

          <div className="mt-20 bg-gradient-to-r from-[#ff914d] to-[#00b894] rounded-3xl p-12 shadow-2xl text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              ¿Listo para comenzar tu aventura?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Únete a Yonna Akademia y descubre una nueva forma de aprender
              idiomas a través de la gamificación.
            </p>
            {!user && (
              <button
                onClick={() => setShowRegister(true)}
                className="px-10 py-4 bg-white hover:bg-gray-100 text-[#ff914d] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
              >
                Registrarse Gratis
              </button>
            )}
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />

      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
};

export default HomePage;