import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PlayCircle,
  Image as ImageIcon,
  Music,
  FileText,
  Eye,
  Calendar,
  User,
  Star
} from 'lucide-react';

const MediaCard = ({ item, user }) => {
  // PROTECCIÓN: Si item no existe, no renderizamos nada para evitar el crash
  if (!item) return null;

  const getMediaIcon = () => {
    switch (item.media_type) {
      case 'video': return <PlayCircle size={20} />;
      case 'image': return <ImageIcon size={20} />;
      case 'audio': return <Music size={20} />;
      case 'document': return <FileText size={20} />;
      default: return <FileText size={20} />;
    }
  };

  const getCategoryStyle = (category) => {
    const styles = {
      cultural: 'bg-purple-50 text-purple-700 border-purple-100',
      educational: 'bg-blue-50 text-blue-700 border-blue-100',
      language: 'bg-brand-light text-brand-dark border-brand-green/20',
      music: 'bg-yellow-50 text-yellow-700 border-yellow-100',
      crafts: 'bg-orange-50 text-brand-orange border-orange-100',
      stories: 'bg-rose-50 text-rose-700 border-rose-100',
      cooking: 'bg-pink-50 text-pink-700 border-pink-100',
      other: 'bg-slate-50 text-slate-600 border-slate-100',
    };
    return styles[category] || styles.other;
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-brand-green/30 flex flex-col h-full">
      
      {/* Preview Section */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        {item.preview_url ? (
          <img
            src={item.preview_url}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-slate-50 group-hover:bg-slate-100 transition-colors">
            <div className="p-4 rounded-full bg-white shadow-sm mb-2 group-hover:scale-110 transition-transform">
               {getMediaIcon()}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">{item.media_type}</span>
          </div>
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
           <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm text-xs font-bold text-slate-700 uppercase tracking-wide">
              {getMediaIcon()}
              <span className="ml-1">{item.media_type}</span>
           </div>
           
           {item.is_featured && (
             <div className="bg-yellow-400 text-yellow-900 p-1.5 rounded-full shadow-md animate-pulse">
               <Star size={14} fill="currentColor" />
             </div>
           )}
        </div>

        <div className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold border shadow-sm ${getCategoryStyle(item.category)}`}>
           {item.category}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 leading-tight group-hover:text-brand-green transition-colors">
            {item.title}
          </h3>
          
          <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
            {item.description || "Sin descripción disponible."}
          </p>
        </div>

        {/* Metadata Footer */}
        <div className="pt-4 border-t border-slate-50 mt-2 space-y-3">
           <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                 <User size={14} />
                 <span className="font-medium text-slate-600 max-w-[100px] truncate">{item.uploaded_by_name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                 <Calendar size={14} />
                 <span>{new Date(item.uploaded_at).toLocaleDateString()}</span>
              </div>
           </div>

           <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold bg-slate-50 px-2 py-1 rounded-md">
                 <Eye size={14} className="text-brand-orange" />
                 <span>{item.view_count || 0}</span>
              </div>
              
              <Link
                to={`/content/${item.id}`}
                className="text-sm font-bold text-brand-dark hover:text-brand-green transition-colors flex items-center gap-1"
              >
                Ver Detalle
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;