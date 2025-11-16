import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Award, TrendingUp, BookOpen, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';

import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import useAuth from '../../hooks/useAuth';

const ProfilePage = () => {
  const { user, updateProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      telefono: user?.telefono || '',
      localidad: user?.localidad || '',
      gustos: user?.gustos || '',
    }
  });

  const onSubmit = async (data) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const calculateLevel = (xp) => {
    return Math.floor(xp / 1000) + 1;
  };

  const calculateProgress = (xp) => {
    const currentLevelXp = xp % 1000;
    return (currentLevelXp / 1000) * 100;
  };

  const stats = [
    {
      label: 'Nivel Actual',
      value: calculateLevel(user?.xp || 0),
      icon: <Award className="w-6 h-6" />,
      color: 'text-orange-500'
    },
    {
      label: 'XP Total',
      value: user?.xp || 0,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-green-500'
    },
    {
      label: 'Cursos Completados',
      value: '3',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'text-blue-500'
    },
    {
      label: 'Días de Racha',
      value: '7',
      icon: <Clock className="w-6 h-6" />,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.first_name} {user?.last_name}
                </h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Editar Perfil</span>
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Nivel {calculateLevel(user?.xp || 0)}
              </span>
              <span className="text-sm text-gray-500">
                {user?.xp || 0} XP
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${calculateProgress(user?.xp || 0)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className={`${stat.color} mb-3`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm p-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Actividad Reciente
          </h2>
          <div className="space-y-4">
            {[
              { action: 'Completaste el quiz "Saludos Básicos"', xp: '+50 XP', time: 'Hace 2 horas' },
              { action: 'Desbloqueaste el curso "Números"', xp: '+25 XP', time: 'Hace 1 día' },
              { action: 'Subiste al Nivel 3', xp: '+100 XP', time: 'Hace 2 días' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="text-gray-900 font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                <span className="text-green-500 font-semibold">{activity.xp}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Editar Perfil"
        size="medium"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Teléfono"
            type="tel"
            placeholder="Tu número de teléfono"
            {...register('telefono')}
            error={errors.telefono?.message}
          />
          
          <Input
            label="Localidad"
            type="text"
            placeholder="Tu ciudad o región"
            {...register('localidad')}
            error={errors.localidad?.message}
          />
          
          <Input
            label="Intereses y Gustos"
            type="text"
            placeholder="Tus intereses relacionados con la cultura Wayuu"
            {...register('gustos')}
            error={errors.gustos?.message}
          />

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="flex-1"
            >
              Guardar Cambios
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;