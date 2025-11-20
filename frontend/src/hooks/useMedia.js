import { useState, useEffect } from 'react';
import { contentService } from '../services/contentService';
import toast from 'react-hot-toast';

export const useMedia = (initialFilters = {}) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchMedia = async (currentFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await contentService.getAllMedia(currentFilters);
      setMedia(data.results || data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar contenido');
      toast.error('Error al cargar contenido multimedia');
    } finally {
      setLoading(false);
    }
  };

  const createMedia = async (mediaData) => {
    try {
      const newMedia = await contentService.createMedia(mediaData);
      setMedia(prev => [newMedia, ...prev]);
      toast.success('Contenido creado exitosamente');
      return newMedia;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al crear contenido');
      throw err;
    }
  };

  const updateMedia = async (id, mediaData) => {
    try {
      const updatedMedia = await contentService.updateMedia(id, mediaData);
      setMedia(prev => prev.map(item => 
        item.id === id ? updatedMedia : item
      ));
      toast.success('Contenido actualizado exitosamente');
      return updatedMedia;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al actualizar contenido');
      throw err;
    }
  };

  const deleteMedia = async (id) => {
    try {
      await contentService.deleteMedia(id);
      setMedia(prev => prev.filter(item => item.id !== id));
      toast.success('Contenido eliminado exitosamente');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al eliminar contenido');
      throw err;
    }
  };

  const recordView = async (mediaId, duration = 0) => {
    try {
      await contentService.recordView(mediaId, duration);
    } catch (err) {
      console.warn('Error registrando visualización:', err);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [filters]);

  return {
    media,
    loading,
    error,
    filters,
    setFilters,
    fetchMedia,
    createMedia,
    updateMedia,
    deleteMedia,
    recordView
  };
};