import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { contentService } from '../services/contentService';
import VideoPlayer from '../components/content/VideoPlayer';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Download, 
  Share2, 
  FileText, 
  Music,
  Image as ImageIcon,
  ShieldCheck,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

const ContentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const data = await contentService.getMediaById(id);
        setMedia(data);
        
        // Registrar visualización (solo si no es el propio autor)
        if (user && data.uploaded_by !== user.id) {
           contentService.recordView(id, 0).catch(err => console.warn("No se pudo registrar vista", err));
        }

      } catch (err) {
        console.error('Error cargando detalle:', err);
        setError('No pudimos cargar el contenido solicitado.');
        toast.error('Error al cargar el contenido');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMedia();
    }
  }, [id, user]);

  const handleDownload = () => {
    if (media?.file) {
      window.open(media.file, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Contenido no disponible</h2>
          <p className="text-slate-500 mb-6">{error || 'El contenido que buscas no existe o fue eliminado.'}</p>
          <button onClick={() => navigate(-1)} className="btn-primary">
            <ArrowLeft size={20} className="mr-2" /> Volver
          </button>
        </div>
      </div>
    );
  }

  // Renderizador condicional según el tipo de medio
  const renderMediaPlayer = () => {
    // IMPORTANTE: Usamos media.file porque es la URL directa del backend
    const fileUrl = media.file; 

    switch (media.media_type) {
      case 'video':
        return (
          <VideoPlayer 
            src={fileUrl} 
            title={media.title}
            onTimeUpdate={(time) => {
               // Opcional: Actualizar progreso de vista cada 30s
               if (time > 0 && time % 30 === 0) {
                 contentService.recordView(id, time);
               }
            }}
          />
        );
      
      case 'audio':
        return (
          <div className="bg-slate-900 rounded-2xl p-8 flex flex-col items-center justify-center aspect-video">
             <div className="w-32 h-32 bg-brand-green/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Music size={64} className="text-brand-green" />
             </div>
             <audio controls className="w-full max-w-lg">
                <source src={fileUrl} />
                Tu navegador no soporta audio.
             </audio>
          </div>
        );

      case 'image':
        return (
          <div className="rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200">
            <img 
              src={fileUrl} 
              alt={media.title} 
              className="w-full h-auto max-h-[600px] object-contain mx-auto" 
            />
          </div>
        );

      case 'document':
        return (
          <div className="bg-slate-50 rounded-2xl p-12 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center min-h-[400px]">
             <FileText size={80} className="text-slate-300 mb-4" />
             <h3 className="text-xl font-bold text-slate-700 mb-2">Visualización de Documento</h3>
             <p className="text-slate-500 mb-6">Este archivo es un documento ({fileUrl.split('.').pop()})</p>
             <button onClick={handleDownload} className="btn-primary">
                <Download size={20} className="mr-2" /> Descargar para ver
             </button>
          </div>
        );

      default:
        return <div className="p-12 text-center text-slate-400">Formato no soportado</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Navbar simplificado o volver */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center text-slate-600 hover:text-brand-green font-medium transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Volver al Feed
            </button>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">
               {media.category}
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        
        {/* Área Principal: Reproductor */}
        <div className="mb-8">
           {renderMediaPlayer()}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Columna Izquierda: Detalles */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                 <h1 className="text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
                    {media.title}
                 </h1>
                 
                 <div className="flex flex-wrap gap-4 mb-6 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                       <Calendar size={16} />
                       <span>{new Date(media.uploaded_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <Eye size={16} />
                       <span>{media.view_count} vistas</span>
                    </div>
                    {media.is_approved && (
                       <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-bold text-xs">
                          <ShieldCheck size={14} /> Verificado
                       </div>
                    )}
                 </div>

                 <div className="prose prose-slate max-w-none">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Descripción</h3>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                       {media.description || "Sin descripción disponible."}
                    </p>
                 </div>

                 {media.tags && media.tags.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-slate-50">
                       <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Etiquetas</h4>
                       <div className="flex flex-wrap gap-2">
                          {/* Manejo seguro de tags: aseguramos que sea un array */}
                          {(Array.isArray(media.tags) ? media.tags : String(media.tags).split(',')).map((tag, idx) => (
                             <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors cursor-default">
                                #{typeof tag === 'string' ? tag.trim() : tag}
                             </span>
                          ))}
                       </div>
                    </div>
                 )}
              </div>
           </div>

           {/* Columna Derecha: Sidebar */}
           <div className="lg:col-span-1 space-y-6">
              {/* Tarjeta de Autor */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Subido por</h3>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-green to-brand-dark rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                       <User size={24} />
                    </div>
                    <div>
                       <p className="font-bold text-slate-900">{media.uploaded_by_name || 'Usuario de Yonna'}</p>
                       <p className="text-xs text-slate-500">{media.uploaded_by_email}</p>
                    </div>
                 </div>
              </div>

              {/* Metadatos Legales */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Información Legal</h3>
                 <div className="space-y-4 text-sm">
                    <div>
                       <p className="text-slate-400 text-xs mb-1">Licencia</p>
                       <p className="font-medium text-slate-700">
                          {media.license === 'educational' && 'Uso Educativo'}
                          {media.license === 'creative_commons' && 'Creative Commons'}
                          {media.license === 'all_rights_reserved' && 'Todos los derechos reservados'}
                       </p>
                    </div>
                    {media.attribution && (
                       <div>
                          <p className="text-slate-400 text-xs mb-1">Atribución / Créditos</p>
                          <p className="font-medium text-slate-700 italic">"{media.attribution}"</p>
                       </div>
                    )}
                 </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-col gap-3">
                 <button 
                   onClick={handleDownload}
                   className="w-full py-3 px-4 bg-brand-dark text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                 >
                    <Download size={18} /> Descargar Recurso
                 </button>
                 <button 
                   className="w-full py-3 px-4 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                   onClick={() => {
                     navigator.clipboard.writeText(window.location.href);
                     toast.success('¡Enlace copiado!');
                   }}
                 >
                    <Share2 size={18} /> Compartir
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ContentDetailPage;