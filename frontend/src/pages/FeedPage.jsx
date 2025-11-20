import React, { useState } from 'react';
import { useMedia } from '../hooks/useMedia';
import MediaCard from '../components/content/MediaCard';
import FilterBar from '../components/content/FilterBar';
import { useAuth } from '../context/AuthContext';
import { 
  RefreshCw, 
  SearchX, 
  Smartphone, 
  Download,
  Sparkles
} from 'lucide-react';

const FeedPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    media_type: '',
    category: '',
    search: ''
  });

  const { media, loading, error, setFilters: applyFilters } = useMedia();

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
         <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 text-center">
        <div className="bg-red-50 p-8 rounded-2xl max-w-md w-full">
          <div className="text-red-500 mb-4 flex justify-center">
            <SearchX size={48} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Error de conexión</h3>
          <p className="text-slate-600 mb-6">No pudimos cargar el contenido. Por favor verifica tu conexión.</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary w-full justify-center"
          >
            <RefreshCw size={20} className="mr-2" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header de la Sección */}
      <div className="bg-white border-b border-slate-200 pt-12 pb-8 relative overflow-hidden">
         <div className="absolute inset-0 wayuu-pattern opacity-5"></div>
         <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light text-brand-dark text-xs font-bold uppercase tracking-wide mb-4">
                <Sparkles size={14} />
                Archivo Digital
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Explora la <span className="text-brand-green">Cultura Wayuu</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Un repositorio vivo de videos, relatos sonoros y documentos históricos para preservar nuestra memoria.
              </p>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 py-8 -mt-4">
        {/* Filtros */}
        <div className="relative z-20 mb-8 shadow-lg rounded-2xl bg-white p-1">
           <FilterBar 
             filters={filters} 
             onFilterChange={handleFilterChange}
           />
        </div>

        {/* Grid de Contenido */}
        {media.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
            <div className="mx-auto w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <SearchX size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Sin resultados</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              No encontramos contenido con esos filtros. Intenta buscar otra cosa o limpia los filtros.
            </p>
            <button 
              onClick={() => handleFilterChange({})}
              className="text-brand-green font-bold hover:underline"
            >
              Limpiar todos los filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {media.map((item) => (
              // CORRECCIÓN: Ahora pasamos 'item={item}' en lugar de 'media={item}'
              // para coincidir con lo que espera MediaCard
              <MediaCard 
                key={item.id} 
                item={item} 
                user={user}
              />
            ))}
          </div>
        )}

        {/* CTA App Download */}
        <div className="mt-20 relative rounded-3xl overflow-hidden bg-brand-dark text-white shadow-2xl">
           <div className="absolute inset-0 wayuu-pattern opacity-10"></div>
           <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="flex-1 text-center md:text-left">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 text-brand-orange text-xs font-bold uppercase tracking-wide mb-4">
                    <Smartphone size={14} />
                    Aprende Jugando
                 </div>
                 <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    ¿Quieres hablar Wayuunaiki?
                 </h2>
                 <p className="text-brand-light/90 text-lg mb-8">
                    Descarga <strong>Yonna App</strong> para acceder a cursos interactivos. 
                    Completa lecciones, gana XP y mantén tu racha diaria.
                 </p>
                 <a 
                    href="https://drive.google.com/file/d/1-c593ZnC-us-4zT5qWWVjP8N1rOfUoSp/view?usp=sharing"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold transition-transform hover:-translate-y-1 shadow-lg shadow-brand-orange/30"
                 >
                    <Download size={20} />
                    Descargar App (APK)
                 </a>
              </div>
              <div className="w-full md:w-1/3 flex justify-center">
                 <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <Smartphone size={80} className="text-brand-light" />
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default FeedPage;