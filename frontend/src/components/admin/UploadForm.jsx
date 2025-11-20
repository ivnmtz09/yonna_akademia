import React, { useState } from 'react';
import { contentService } from '../../services/contentService';
import toast from 'react-hot-toast';
import { 
  UploadCloud, 
  Type, 
  FileText, 
  Image as ImageIcon, 
  Film, 
  Music, 
  Tag, 
  Info,
  CheckCircle2,
  Loader2
} from 'lucide-react';

const UploadForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    media_type: '',
    category: 'cultural',
    attribution: '',
    license: 'educational',
    tags: ''
  });
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const mediaTypes = [
    { value: 'image', label: 'Imagen', icon: ImageIcon },
    { value: 'video', label: 'Video', icon: Film },
    { value: 'audio', label: 'Audio', icon: Music },
    { value: 'document', label: 'Documento', icon: FileText }
  ];

  const categories = [
    { value: 'cultural', label: 'Cultural Wayuu' },
    { value: 'educational', label: 'Educativo' },
    { value: 'language', label: 'Enseñanza de Idioma' },
    { value: 'music', label: 'Música Tradicional' },
    { value: 'crafts', label: 'Artesanías' },
    { value: 'stories', label: 'Historias y Leyendas' },
    { value: 'cooking', label: 'Gastronomía' },
    { value: 'other', label: 'Otro' }
  ];

  const licenses = [
    { value: 'educational', label: 'Uso Educativo' },
    { value: 'creative_commons', label: 'Creative Commons' },
    { value: 'all_rights_reserved', label: 'Todos los derechos reservados' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Por favor selecciona un archivo');
      return;
    }

    if (!formData.media_type) {
      toast.error('Por favor selecciona el tipo de medio');
      return;
    }

    try {
      setLoading(true);

      // --- CORRECCIÓN AQUÍ ---
      // Preparamos los tags como array si existen
      let tagsArray = [];
      if (formData.tags) {
         tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }

      // Creamos un OBJETO PLANO, no un FormData.
      // El servicio se encargará de convertirlo a FormData.
      const payload = {
          ...formData,     // title, description, etc.
          file: file,      // El archivo crudo
          thumbnail: thumbnail, // La miniatura cruda (si existe)
          tags: tagsArray  // Enviamos el array, el servicio hará JSON.stringify
      };

      await contentService.createMedia(payload);
      
      toast.success('¡Contenido subido exitosamente!');
      
      // Reset form
      setFormData({
        title: '', description: '', media_type: '', category: 'cultural',
        attribution: '', license: 'educational', tags: ''
      });
      setFile(null);
      setThumbnail(null);
      
      // Reset inputs
      if(document.getElementById('file-input')) document.getElementById('file-input').value = '';
      if(document.getElementById('thumbnail-input')) document.getElementById('thumbnail-input').value = '';

    } catch (error) {
      console.error('Error subiendo contenido:', error);
      // Mejor feedback de error
      const msg = error.response?.data?.detail || 'Error al subir el contenido.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const getAcceptedFileTypes = () => {
    switch (formData.media_type) {
      case 'image': return '.jpg,.jpeg,.png,.gif,.webp';
      case 'video': return '.mp4,.avi,.mov,.wmv,.webm';
      case 'audio': return '.mp3,.wav,.ogg,.m4a';
      case 'document': return '.pdf,.doc,.docx,.txt';
      default: return '*';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 justify-center md:justify-start">
          <UploadCloud className="text-brand-green" />
          Subir Nuevo Contenido
        </h2>
        <p className="text-slate-500 mt-2">Comparte recursos multimedia para enriquecer la biblioteca cultural.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Sección 1: Detalles Principales */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-50 pb-2">
            <Info size={20} className="text-brand-orange" /> Información Básica
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Título *</label>
              <div className="relative">
                <Type className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all outline-none"
                  placeholder="Ej: Danza Yonna Ceremonial"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all outline-none resize-none"
                placeholder="Describe el contexto y significado de este contenido..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Medio *</label>
              <div className="grid grid-cols-2 gap-2">
                {mediaTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      type="button"
                      key={type.value}
                      onClick={() => setFormData(prev => ({ ...prev, media_type: type.value }))}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        formData.media_type === type.value 
                          ? 'border-brand-green bg-brand-light text-brand-dark font-bold ring-1 ring-brand-green' 
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={20} className="mb-1" />
                      <span className="text-xs">{type.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Categoría</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all outline-none bg-white"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sección 2: Carga de Archivos */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-50 pb-2">
            <UploadCloud size={20} className="text-brand-green" /> Archivos
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Archivo Principal *</label>
              <div 
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  dragActive ? 'border-brand-green bg-brand-light/50' : 'border-slate-300 hover:bg-slate-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  accept={getAcceptedFileTypes()}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={!formData.media_type}
                />
                
                {file ? (
                   <div className="flex flex-col items-center text-brand-green">
                      <CheckCircle2 size={40} className="mb-2" />
                      <p className="font-bold">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <p className="text-xs text-brand-orange mt-2 font-semibold">Haz clic o arrastra para cambiar</p>
                   </div>
                ) : (
                   <div className="flex flex-col items-center text-slate-400">
                      <UploadCloud size={40} className="mb-2" />
                      <p className="font-medium text-slate-600">
                        {formData.media_type ? 'Arrastra tu archivo aquí o haz clic' : 'Selecciona un tipo de medio primero'}
                      </p>
                      <p className="text-xs mt-1">
                        {formData.media_type ? `Formatos: ${getAcceptedFileTypes()}` : 'Selecciona arriba Video, Audio, etc.'}
                      </p>
                   </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Miniatura (Opcional)</label>
              <input
                id="thumbnail-input"
                type="file"
                onChange={handleThumbnailChange}
                accept=".jpg,.jpeg,.png,.webp"
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Sección 3: Metadatos Legales */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-50 pb-2">
            <Tag size={20} className="text-blue-500" /> Metadatos y Licencia
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Atribución</label>
              <input
                type="text"
                name="attribution"
                value={formData.attribution}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none"
                placeholder="Autor original o fuente"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Licencia</label>
              <select
                name="license"
                value={formData.license}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none bg-white"
              >
                {licenses.map(license => (
                  <option key={license.value} value={license.value}>{license.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Etiquetas</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none"
                placeholder="wayuu, danza, historia (separar con comas)"
              />
              <p className="text-xs text-slate-400 mt-1">Ayuda a que el contenido sea encontrado más fácilmente.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-8 py-4 w-full md:w-auto shadow-xl shadow-brand-orange/20"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" /> Subiendo...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UploadCloud /> Publicar Contenido
              </span>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default UploadForm;