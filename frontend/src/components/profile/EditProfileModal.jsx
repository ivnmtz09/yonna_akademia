import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../common/Modal'; 
import Input from '../common/Input'; 
import Button from '../common/Button'; 
import { useAuth } from '../../context/AuthContext'; // Ruta corregida
import { 
  User, 
  Pencil, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Globe, 
  Tag, 
  Loader2 
} from 'lucide-react';
import { format, parseISO } from 'date-fns'; // REQUIERE 'npm install date-fns'
import toast from 'react-hot-toast';

const EditProfileModal = ({ isOpen, onClose, user, profile, onUpdateSuccess }) => {
  const { updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Función de ayuda para formatear la fecha
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
        // Usamos parseISO porque Django envía la fecha en formato ISO
        return format(parseISO(dateString), 'yyyy-MM-dd');
    } catch (e) {
        console.warn("Error parsing date:", e);
        return '';
    }
  };

  // Combina los campos de User y Profile para inicializar el formulario
  const initialData = {
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    bio: user?.bio || '',
    telefono: profile?.telefono || '',
    localidad: profile?.localidad || '',
    // Formatear la fecha de nacimiento para el input type="date"
    fecha_nacimiento: formatDateForInput(profile?.fecha_nacimiento),
    // Convertir la lista de gustos a un string separado por comas
    gustos: Array.isArray(profile?.gustos) ? profile.gustos.join(', ') : '',
  };

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: initialData,
  });

  // Resetear el formulario cuando se abre el modal o cambian los datos del usuario
  useEffect(() => {
    if (isOpen) {
      reset(initialData);
    }
  }, [isOpen, user, profile]); // Dependencias actualizadas

  const onSubmit = async (data) => {
    setLoading(true);
    
    // 1. Crear el payload combinado que el backend espera
    // El backend (ProfileView) maneja la separación de campos de User y Profile
    const payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        bio: data.bio, 
        
        telefono: data.telefono,
        localidad: data.localidad,
        fecha_nacimiento: data.fecha_nacimiento, 
        
        // Convertir el string de gustos a un array de strings (JSONField en Django)
        gustos: data.gustos.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
    };

    try {
        // updateProfile llama a PATCH /api/auth/profile/ con el payload combinado
        await updateProfile(payload);
        
        toast.success('Perfil actualizado correctamente');
        onUpdateSuccess();

    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      const msg = error.response?.data?.detail || 'Ocurrió un error al guardar los cambios.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Editar Mi Perfil"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <User size={18} className="text-brand-green" /> Información General
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
                label="Nombre"
                icon={User}
                {...register("first_name", { required: "El nombre es requerido" })}
                error={errors.first_name?.message}
            />
            <Input
                label="Apellido"
                icon={User}
                {...register("last_name", { required: "El apellido es requerido" })}
                error={errors.last_name?.message}
            />
        </div>

        <Input
            label="Biografía Corta"
            icon={MessageSquare}
            type="textarea"
            rows={3}
            {...register("bio")}
            placeholder="Escribe algo sobre ti..."
        />
        
        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 pt-4 flex items-center gap-2">
            <Pencil size={18} className="text-brand-orange" /> Datos de Contacto
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
                label="Localidad"
                icon={MapPin}
                {...register("localidad")}
                placeholder="Ej: Riohacha"
            />
            <Input
                label="Teléfono"
                icon={Phone}
                {...register("telefono")}
                placeholder="Ej: +57 300 123 4567"
            />
            <Input
                label="Fecha de Nacimiento"
                icon={Globe}
                type="date"
                {...register("fecha_nacimiento")}
            />
        </div>

        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 pt-4 flex items-center gap-2">
            <Tag size={18} className="text-purple-500" /> Intereses
        </h3>

        <Input
            label="Gustos (Separados por coma)"
            icon={Tag}
            {...register("gustos")}
            placeholder="Ej: Lectura, Música Wayuu, Artesanía"
        />

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;