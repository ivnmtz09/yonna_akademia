import React, { useState, useEffect } from 'react';
import { contentService } from '../../services/contentService';
import toast from 'react-hot-toast';
import { 
  Film, 
  Eye, 
  CheckCircle, 
  Star, 
  Trash2, 
  RefreshCw, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  AlertCircle,
  Clock
} from 'lucide-react';

const ContentTable = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await contentService.getAllMedia();
      
      // --- CORRECCIÓN AQUÍ ---
      // Verificamos si viene paginado (data.results) o si es una lista directa
      const items = data.results ? data.results : data;
      
      setContent(Array.isArray(items) ? items : []);
    } catch (err) {
      setError('Error al conectar con el servidor.');
      console.error('Error fetching content:', err);
      toast.error('No se pudo cargar la lista de contenido');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await contentService.approveMedia(id);
      toast.success('Contenido aprobado');
      fetchContent();
    } catch (err) {
      toast.error('Error al aprobar');
    }
  };

  const handleFeature = async (id) => {
    try {
      await contentService.featureMedia(id);
      toast.success('Estado destacado actualizado');
      fetchContent();
    } catch (err) {
      toast.error('Error al actualizar');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este contenido permanentemente?')) {
      try {
        await contentService.deleteMedia(id);
        toast.success('Contenido eliminado');
        fetchContent();
      } catch (err) {
        toast.error('Error al eliminar');
      }
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'video': return <Film size={18} className="text-blue-500" />;
      case 'image': return <ImageIcon size={18} className="text-purple-500" />;
      case 'audio': return <Music size={18} className="text-pink-500" />;
      default: return <FileText size={18} className="text-slate-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-slate-400">
         <div className="loading-spinner mb-4"></div>
         <p>Cargando biblioteca...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100 m-4">
        <AlertCircle className="mx-auto text-red-400 mb-2" size={32} />
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={fetchContent} className="btn-primary py-2 px-4 text-sm">
          <RefreshCw size={16} className="mr-2" /> Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FileText className="text-slate-400" /> Biblioteca Multimedia
        </h2>
        <div className="bg-brand-light text-brand-dark px-3 py-1 rounded-full text-sm font-bold">
          {content.length} archivos
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Archivo</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-50">
              {content.length > 0 ? content.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        {getTypeIcon(item.media_type)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-slate-800 line-clamp-1">{item.title || 'Sin título'}</div>
                        <div className="text-xs text-slate-500 capitalize">{item.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1.5 items-start">
                      {item.is_approved ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                          <CheckCircle size={10} className="mr-1" /> Aprobado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                          <Clock size={10} className="mr-1" /> Pendiente
                        </span>
                      )}
                      
                      {item.is_featured && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
                          <Star size={10} className="mr-1 fill-purple-700" /> Destacado
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                    {new Date(item.uploaded_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      {!item.is_approved && (
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                          title="Aprobar"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleFeature(item.id)}
                        className={`p-2 rounded-lg transition-colors ${item.is_featured ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'}`}
                        title={item.is_featured ? "Quitar destacado" : "Destacar"}
                      >
                        <Star size={18} fill={item.is_featured ? "currentColor" : "none"} />
                      </button>
                      
                      <div className="h-4 w-px bg-slate-200 mx-1"></div>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan="4" className="px-6 py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                         <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                            <Film size={32} className="opacity-50" />
                         </div>
                         <p className="font-medium">La biblioteca está vacía</p>
                         <p className="text-sm opacity-70">Sube contenido desde la pestaña "Subir Nuevo"</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContentTable;