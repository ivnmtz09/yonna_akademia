import React from 'react';
import { useStats } from '../../hooks/useStats';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Trophy, 
  Zap, 
  TrendingUp, 
  Smartphone, 
  Download,
  Award,
  Calendar
} from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const { stats, profile, loading } = useStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Datos normalizados
  const userData = profile?.usuario || user;
  const userXp = stats?.user_xp || userData?.xp || 0;
  const userLevel = stats?.user_level || userData?.level || 1;
  const progress = stats?.progress_to_next_level || 0;

  return (
    <div className="min-h-screen bg-slate-50 py-8 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-8 mb-8 relative overflow-hidden">
           {/* Decoración de fondo */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light rounded-full -mr-16 -mt-16 opacity-50 pointer-events-none"></div>
           
           <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
              {/* Avatar */}
              <div className="relative">
                 <div className="w-28 h-28 bg-gradient-to-br from-brand-green to-brand-dark rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl ring-4 ring-white">
                    {userData?.first_name?.[0]}{userData?.last_name?.[0]}
                 </div>
                 <div className="absolute -bottom-2 -right-2 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-md border-2 border-white">
                    Nivel {userLevel}
                 </div>
              </div>

              <div className="flex-1 pt-2">
                 <h1 className="text-3xl font-bold text-slate-900">
                    {userData?.first_name} {userData?.last_name}
                 </h1>
                 <p className="text-slate-500 font-medium mb-4">{userData?.email}</p>
                 
                 <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wide">
                       <User size={14} className="mr-1.5" /> {userData?.role}
                    </span>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Columna Izquierda: Estadísticas */}
           <div className="lg:col-span-2 space-y-8">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="p-2 bg-brand-light rounded-lg text-brand-dark">
                          <Trophy size={20} />
                       </div>
                       <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Nivel Actual</span>
                    </div>
                    <p className="text-4xl font-extrabold text-slate-800">{userLevel}</p>
                 </div>

                 <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="p-2 bg-orange-50 rounded-lg text-brand-orange">
                          <Zap size={20} />
                       </div>
                       <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">XP Total</span>
                    </div>
                    <p className="text-4xl font-extrabold text-slate-800">{userXp}</p>
                 </div>
              </div>

              {/* Progress Bar Card */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                       <TrendingUp className="text-brand-green" /> Tu Progreso
                    </h3>
                    <span className="text-sm font-bold text-slate-400">Siguiente Nivel</span>
                 </div>

                 <div className="relative pt-2 mb-6">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                       <span>Nivel {userLevel}</span>
                       <span>{progress}% Completado</span>
                       <span>Nivel {userLevel + 1}</span>
                    </div>
                    <div className="overflow-hidden h-4 text-xs flex rounded-full bg-slate-100">
                       <div 
                          style={{ width: `${progress}%` }} 
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-brand-green to-brand-dark transition-all duration-1000 ease-out relative"
                       >
                          <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-[shimmer_2s_infinite]"></div>
                       </div>
                    </div>
                 </div>

                 <p className="text-slate-500 text-sm text-center bg-slate-50 py-3 rounded-xl border border-slate-100">
                    {stats?.next_level_xp 
                       ? `Necesitas ${stats.next_level_xp - userXp} XP más para subir de nivel` 
                       : '¡Sigue aprendiendo para alcanzar la grandeza!'}
                 </p>
              </div>

              {/* Activity Log (Placeholder styled) */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                 <h3 className="text-lg font-bold text-slate-800 mb-6">Logros Recientes</h3>
                 <div className="flex items-center justify-center py-8 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                    <div className="text-center">
                       <Award size={32} className="mx-auto mb-2 opacity-50" />
                       <p className="text-sm">Comienza lecciones en la App para ganar insignias</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Columna Derecha: CTA App */}
           <div className="lg:col-span-1">
              <div className="bg-brand-dark rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl sticky top-24">
                 <div className="absolute inset-0 wayuu-pattern opacity-10"></div>
                 <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
                       <Smartphone size={40} className="text-brand-orange" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3">¡Lleva tu aprendizaje al siguiente nivel!</h3>
                    <p className="text-brand-light/80 mb-8 text-sm leading-relaxed">
                       Las estadísticas detalladas, lecciones interactivas y el ranking global están disponibles exclusivamente en nuestra App Móvil.
                    </p>

                    <a 
                       href="https://drive.google.com/file/d/1-c593ZnC-us-4zT5qWWVjP8N1rOfUoSp/view?usp=sharing"
                       target="_blank"
                       rel="noopener noreferrer"
                       className="block w-full bg-brand-orange hover:bg-orange-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-brand-orange/30 transition-transform hover:-translate-y-1 flex items-center justify-center gap-2"
                    >
                       <Download size={20} /> Descargar APK
                    </a>
                    
                    <p className="text-xs text-white/40 mt-4">Sincronización automática</p>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;