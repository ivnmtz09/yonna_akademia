import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield, BookOpen, Award, Calendar } from "lucide-react";

export default function Profile() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="animate-pulse">
            <div className="h-20 w-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="h-20 w-20 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error al cargar el perfil
          </h2>
          <p className="text-gray-600">
            No se pudo obtener la información del usuario
          </p>
        </div>
      </div>
    );
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'teacher':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'student':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'intermediate':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'teacher':
        return 'Sabedor/Docente';
      case 'student':
        return 'Estudiante';
      default:
        return 'Usuario';
    }
  };

  const getLevelText = (level) => {
    switch (level) {
      case 'beginner':
        return 'Principiante';
      case 'intermediate':
        return 'Intermedio';
      case 'advanced':
        return 'Avanzado';
      default:
        return 'Sin nivel';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Mi Perfil
          </h1>
          <p className="mt-2 text-gray-600">
            Información de tu cuenta y progreso de aprendizaje
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Cover */}
              <div className="h-32 bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500"></div>
              
              {/* Profile Info */}
              <div className="relative px-6 pb-8">
                {/* Avatar */}
                <div className="flex justify-center -mt-16 mb-6">
                  <div className="h-32 w-32 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-white">
                    <User className="h-16 w-16 text-orange-500" />
                  </div>
                </div>

                {/* User Info */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name}` 
                      : user.username}
                  </h2>
                  <p className="text-gray-600">@{user.username}</p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(user.role)}`}>
                    {getRoleText(user.role)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(user.level)}`}>
                    {getLevelText(user.level)}
                  </span>
                </div>

                {/* Bio */}
                {user.bio && (
                  <div className="text-center text-gray-600 italic mb-6">
                    "{user.bio}"
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
                    <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">
                        {user.email || 'No registrado'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rol</p>
                      <p className="font-medium text-gray-900">
                        {getRoleText(user.role)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nivel</p>
                      <p className="font-medium text-gray-900">
                        {getLevelText(user.level)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
                    <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Miembro desde</p>
                      <p className="font-medium text-gray-900">
                        {user.date_joined 
                          ? new Date(user.date_joined).toLocaleDateString('es-ES')
                          : 'No disponible'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mi Progreso
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Cursos completados</span>
                    <span className="text-sm font-medium">0/0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Lecciones vistas</span>
                    <span className="text-sm font-medium">0/0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Quiz realizados</span>
                    <span className="text-sm font-medium">0/0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Logros
              </h3>
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  ¡Comienza a aprender para desbloquear logros!
                </p>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">
                ¡Bienvenido a Wayuu Platform!
              </h3>
              <p className="text-white/90 text-sm">
                Explora nuestros cursos y sumérgete en la rica cultura Wayuu. 
                Cada paso te acerca más a dominar el Wayuunaiki.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}