import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BookOpen, Users, Award, ArrowRight, Play, Globe } from "lucide-react";

function Home() {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: "Cursos Interactivos",
      description: "Aprende Wayuunaiki con lecciones diseñadas por expertos en la lengua.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Users,
      title: "Comunidad Wayuu",
      description: "Conecta con otros estudiantes y sabedores de la cultura Wayuu.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Award,
      title: "Certificaciones",
      description: "Obtén reconocimiento por tu progreso y dominio del idioma.",
      color: "from-amber-500 to-yellow-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-yellow-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            {/* Welcome message for authenticated users */}
            {isAuthenticated && (
              <div className="mb-8 inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
                <span className="text-sm text-gray-600">¡Bienvenido de vuelta, </span>
                <span className="text-sm font-semibold text-orange-600 ml-1">
                  {user?.username}!
                </span>
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              <span className="block">Aprende</span>
              <span className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Wayuunaiki
              </span>
            </h1>
            
            <p className="max-w-3xl mx-auto text-xl text-gray-600 mb-8 leading-relaxed">
              Preserva y comparte la lengua y cultura Wayuu a través de nuestra plataforma 
              digital. Conecta con la sabiduría ancestral desde cualquier lugar del mundo.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Continuar Aprendiendo
                  </Link>
                  <button className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-full shadow-lg hover:shadow-xl border-2 border-orange-200 hover:border-orange-300 transform hover:scale-105 transition-all duration-200">
                    <Globe className="mr-2 h-5 w-5" />
                    Explorar Cursos
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Comenzar Ahora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-full shadow-lg hover:shadow-xl border-2 border-orange-200 hover:border-orange-300 transform hover:scale-105 transition-all duration-200"
                  >
                    Ya tengo cuenta
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">1000+</div>
                <div className="text-gray-600">Estudiantes Activos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">50+</div>
                <div className="text-gray-600">Lecciones Disponibles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">95%</div>
                <div className="text-gray-600">Satisfacción</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir nuestra plataforma?
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Ofrecemos una experiencia única de aprendizaje que respeta y celebra 
              la rica tradición oral Wayuu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${feature.color} mb-6`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cultural Section */}
      <div className="py-16 sm:py-24 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Preservando la Cultura Wayuu
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-white/90 mb-8 leading-relaxed">
            El Wayuunaiki es más que un idioma, es la expresión viva de una cultura milenaria. 
            Cada palabra lleva consigo la sabiduría de generaciones de abuelos y abuelas Wayuu.
          </p>
          
          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Únete a la Comunidad
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Wayuu Platform
              </h3>
              <p className="text-gray-400">
                Conectando generaciones a través del aprendizaje de la lengua Wayuu.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Cursos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Diccionario</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cultura</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Comunidad</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Foro</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Eventos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 Wayuu Platform. Hecho con 💛 para preservar la cultura Wayuu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;