import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, Mail, Award, Shield, BookOpen } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    level: 'beginner',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        bio: user.bio || '',
        level: user.level || 'beginner',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateProfile(formData);
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 pt-20 pl-64">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#ff914d] to-[#ff7a2e] px-8 py-12">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white">
                <User size={48} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {user.first_name} {user.last_name}
                </h1>
                <div className="flex items-center gap-2 text-white/90">
                  <Mail size={18} />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-[#ff914d]/10 to-[#ff914d]/5 rounded-xl p-4 border-2 border-[#ff914d]/20">
                <div className="flex items-center gap-3 mb-2">
                  <Award size={24} className="text-[#ff914d]" />
                  <span className="text-sm font-semibold text-gray-600">Nivel</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 capitalize">
                  {user.level || 'beginner'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#00b894]/10 to-[#00b894]/5 rounded-xl p-4 border-2 border-[#00b894]/20">
                <div className="flex items-center gap-3 mb-2">
                  <Shield size={24} className="text-[#00b894]" />
                  <span className="text-sm font-semibold text-gray-600">Rol</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 capitalize">
                  {user.role || 'student'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl p-4 border-2 border-purple-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen size={24} className="text-purple-500" />
                  <span className="text-sm font-semibold text-gray-600">Cursos</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">0</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Editar Perfil
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nombre"
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  required
                />

                <Input
                  label="Apellido"
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Tu apellido"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nivel
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-[#ff914d] focus:ring-[#ff914d]/20 transition-all"
                >
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Biografía
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Cuéntanos un poco sobre ti..."
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-[#ff914d] focus:ring-[#ff914d]/20 transition-all resize-none"
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;