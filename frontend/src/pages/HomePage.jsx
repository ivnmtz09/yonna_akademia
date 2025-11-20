import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';
// IMPORTANTE: Aseguramos que Home esté importado aquí
import { 
  BookOpen,
  Film,
  ArrowRight,
  Users,
  Download,
  Smartphone,
  PlayCircle,
  Headphones,
  Home 
} from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const features = [
    {
      icon: Film,
      title: 'Cine y Documentales',
      description: 'Visualiza historias narradas por sabedores. Un archivo audiovisual para preservar la memoria.',
      link: '/feed?type=video',
      bg: 'bg-brand-light',
      iconColor: 'text-brand-dark'
    },
    {
      icon: Headphones,
      title: 'Relatos y Audio',
      description: 'Escucha la tradición oral, música y narraciones ancestrales en alta calidad.',
      link: '/feed?type=audio',
      bg: 'bg-orange-50',
      iconColor: 'text-brand-orange'
    },
    {
      icon: BookOpen,
      title: 'Documentos e Historia',
      description: 'Acceso a fotografías, escritos y archivos digitalizados sobre la cultura Wayuu.',
      link: '/feed?type=document',
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }
  ];

  const handleOpenLogin = () => setIsLoginModalOpen(true);
  const handleOpenRegister = () => setIsRegisterModalOpen(true);
  const handleCloseModals = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        
        {/* Hero Section */}
        <section className="relative pt-12 pb-16 lg:pt-32 lg:pb-32 overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden -z-10">
             <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[100px]"></div>
             <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-brand-orange/10 rounded-full blur-[80px]"></div>
             <div className="absolute inset-0 wayuu-pattern opacity-[0.03]"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              <div className="space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-light border border-brand-green/20 text-brand-dark font-semibold text-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
                  </span>
                  Archivo Digital Cultural
                </div>

                <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                  Memoria Viva <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-dark">
                    Wayuu
                  </span>
                </h1>
                
                <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Explora nuestra colección multimedia. Documentales, fotografías y escritos que preservan la esencia y sabiduría de nuestro pueblo.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  {user ? (
                    <Link to="/feed" className="btn-primary group">
                      <span>Explorar Archivo</span>
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                    </Link>
                  ) : (
                    <>
                      <button onClick={handleOpenRegister} className="btn-primary group">
                        <span>Crear Cuenta</span>
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                      </button>
                      <button onClick={handleOpenLogin} className="px-8 py-4 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-brand-green/50 transition-all shadow-sm">
                        Ingresar
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="relative z-10 animate-[float_6s_ease-in-out_infinite]">
                  <img 
                    src="/mascota.png" 
                    alt="Yonna Archivo Digital" 
                    className="w-full max-w-md mx-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-brand-green/20 to-transparent rounded-full blur-3xl -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-brand-dark py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/welcome.png')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
              {[
                { label: 'Usuarios', value: '20+', icon: Users },
                { label: 'Documentos', value: '10+', icon: BookOpen },
                { label: 'Multimedia', value: '10+', icon: PlayCircle },
                { label: 'Comunidades', value: '2', icon: Home }, // Aquí se usa Home
              ].map((stat, i) => (
                <div key={i} className="text-center px-4">
                  <stat.icon className="w-6 h-6 text-brand-orange mx-auto mb-2 opacity-80" />
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-brand-light/70 uppercase tracking-widest font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Un Museo Digital Abierto</h2>
              <p className="text-lg text-slate-500">Accede a contenido curado para conocer la profundidad de la cultura Wayuu.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Link 
                    to={feature.link} 
                    key={index}
                    className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-slate-100 hover:border-brand-green/30 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 ${feature.bg} rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 opacity-50`}></div>
                    
                    <div className={`inline-flex p-4 rounded-xl ${feature.bg} ${feature.iconColor} mb-6 relative z-10`}>
                      <Icon size={32} strokeWidth={1.5} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-brand-dark transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center text-sm font-bold text-brand-green group-hover:gap-2 transition-all">
                      Ver Contenido <ArrowRight size={16} className="ml-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* App Download Section */}
        <section className="py-20 bg-white relative overflow-hidden border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-brand-dark rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 wayuu-pattern opacity-10"></div>
              
              <div className="grid md:grid-cols-2 gap-12 items-center p-12 relative z-10">
                <div className="text-white space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 text-brand-orange text-xs font-bold uppercase tracking-wide">
                    <Smartphone size={14} />
                    Solo en la App Móvil
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold">¿Quieres aprender Wayuunaiki?</h2>
                  <p className="text-brand-light/90 text-lg">
                    Descarga <strong>Yonna App</strong> para acceder al curso interactivo gamificado.
                    Completa lecciones, mantén tu racha y aprende palabras nuevas cada día jugando.
                  </p>

                  <ul className="space-y-3 pt-2 text-brand-light/80">
                     <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div>
                        Sistema de vidas y niveles
                     </li>
                     <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div>
                        Ejercicios de pronunciación y escritura
                     </li>
                     <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div>
                        Modo offline incluido
                     </li>
                  </ul>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <a 
                      href="https://drive.google.com/file/d/1-c593ZnC-us-4zT5qWWVjP8N1rOfUoSp/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 bg-brand-orange hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-brand-orange/20 transform hover:-translate-y-1"
                    >
                      <Download size={20} />
                      <span>Descargar APK y Jugar</span>
                    </a>
                  </div>
                </div>
                
                <div className="hidden md:flex justify-center items-center relative">
                  <div className="absolute w-64 h-64 bg-brand-green/30 rounded-full blur-3xl"></div>
                  <img 
                    src="/welcome.png" 
                    alt="Yonna App Gamificada" 
                    className="relative w-72 drop-shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white py-12 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <img src="/yonna.png" alt="Yonna" className="h-12 w-12 mx-auto mb-4 opacity-80 grayscale hover:grayscale-0 transition-all" />
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} Yonna Akademia. Preservando el futuro.
            </p>
          </div>
        </footer>
      </div>

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

export default HomePage;