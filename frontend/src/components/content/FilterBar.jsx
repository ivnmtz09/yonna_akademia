import React from 'react';
import { Filter, Search, Sparkles } from 'lucide-react';

const FilterBar = ({ filters, onFilterChange }) => {
  const mediaTypes = [
    { value: '', label: 'Todos los tipos' },
    { value: 'video', label: 'Videos' },
    { value: 'image', label: 'Imágenes' },
    { value: 'audio', label: 'Audio' },
    { value: 'document', label: 'Documentos' },
  ];

  const categories = [
    { value: '', label: 'Todas las categorías' },
    { value: 'cultural', label: 'Cultura Wayuu' },
    { value: 'educational', label: 'Educativo' },
    { value: 'language', label: 'Idioma (Wayuunaiki)' },
    { value: 'music', label: 'Música y Danza' },
    { value: 'crafts', label: 'Artesanías' },
    { value: 'stories', label: 'Mitos y Leyendas' },
    { value: 'cooking', label: 'Gastronomía' },
    { value: 'other', label: 'Otro' },
  ];

  const inputClasses = "w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-50">
        <div className="p-2 bg-brand-light rounded-lg text-brand-dark">
           <Filter size={20} />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Filtrar Contenido</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Buscador - Ocupa más espacio */}
        <div className="md:col-span-6 lg:col-span-5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">
            Búsqueda
          </label>
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input
               type="text"
               placeholder="Buscar títulos, temas..."
               value={filters.search || ''}
               onChange={(e) => onFilterChange('search', e.target.value)}
               className={`${inputClasses} pl-10`}
             />
          </div>
        </div>

        {/* Filtro Tipo */}
        <div className="md:col-span-3 lg:col-span-3">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">
            Formato
          </label>
          <select
            value={filters.media_type || ''}
            onChange={(e) => onFilterChange('media_type', e.target.value)}
            className={inputClasses}
          >
            {mediaTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Filtro Categoría */}
        <div className="md:col-span-3 lg:col-span-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">
            Temática
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className={inputClasses}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtros Checkbox */}
      <div className="mt-6 flex items-center pt-2">
        <label className="inline-flex items-center gap-2 cursor-pointer group select-none">
          <div className="relative flex items-center">
             <input
               type="checkbox"
               checked={filters.featured || false}
               onChange={(e) => onFilterChange('featured', e.target.checked)}
               className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white transition-all checked:border-brand-orange checked:bg-brand-orange hover:border-brand-orange"
             />
             <Sparkles size={12} className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
          </div>
          <span className="text-sm font-medium text-slate-600 group-hover:text-brand-orange transition-colors">
            Solo contenido destacado
          </span>
        </label>
      </div>
    </div>
  );
};

export default FilterBar;