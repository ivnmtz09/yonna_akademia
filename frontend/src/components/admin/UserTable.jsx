import React, { useState, useEffect } from 'react';
import { statsService } from '../../services/statsService';
import { 
  User, 
  Shield, 
  ShieldCheck, 
  AlertTriangle,
  Search,
  MoreHorizontal,
  Users
} from 'lucide-react';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await statsService.getUsers();
      setUsers(response.data);
    } catch (err) {
      setError('No se pudo conectar con el servidor de usuarios.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    if (!window.confirm(`¿Estás seguro de cambiar el rol de este usuario a ${newRole}?`)) return;
    
    try {
      await statsService.updateUserRole(userId, newRole);
      // Optimistic update o recarga
      fetchUsers(); 
    } catch (err) {
      console.error('Error updating user role:', err);
      alert('Error al actualizar el rol. Verifica tu conexión.');
    }
  };

  const getRoleBadge = (role) => {
    const configs = {
      admin: { color: 'bg-red-50 text-red-700 ring-red-600/20', icon: ShieldCheck, label: 'Admin' },
      moderator: { color: 'bg-blue-50 text-blue-700 ring-blue-600/20', icon: Shield, label: 'Mod' },
      user: { color: 'bg-green-50 text-green-700 ring-green-600/20', icon: User, label: 'User' },
    };
    const config = configs[role] || configs.user;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${config.color}`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  const filteredUsers = users.filter(u => 
    u.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-slate-400">
         <div className="loading-spinner mb-4"></div>
         <p>Sincronizando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Usuarios', value: users.length, color: 'bg-brand-dark text-white', icon: Users },
          { label: 'Administradores', value: users.filter(u => u.role === 'admin').length, color: 'bg-red-50 text-red-600 border-red-100', icon: ShieldCheck },
          { label: 'Moderadores', value: users.filter(u => u.role === 'moderator').length, color: 'bg-blue-50 text-blue-600 border-blue-100', icon: Shield },
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between ${stat.color === 'bg-brand-dark text-white' ? 'border-transparent' : ''} ${stat.color}`}>
             <div>
                <p className={`text-sm font-medium mb-1 opacity-80`}>{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
             </div>
             <stat.icon size={32} className="opacity-20" />
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Header & Toolbar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
             <Users size={20} className="text-slate-400" />
             Directorio
           </h2>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar usuario..." 
                className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green w-full sm:w-64 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 rounded-r">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Usuario</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Progreso</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Rol Actual</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-brand-green to-brand-dark rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                        {user.first_name?.[0]?.toUpperCase() || <User size={16} />}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-slate-900">{user.first_name} {user.last_name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-slate-700">Nivel {user.level || 1}</span>
                       <span className="text-xs text-slate-400 font-medium">{user.xp || 0} XP</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="relative inline-block text-left group">
                       <select
                          value={user.role}
                          onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                          className="appearance-none bg-white border border-slate-200 text-slate-700 py-1.5 pl-3 pr-8 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-green/50 cursor-pointer hover:border-brand-green"
                          disabled={user.role === 'admin' && user.id === user.id} // Lógica básica de protección
                       >
                          <option value="user">Usuario</option>
                          <option value="moderator">Moderador</option>
                          <option value="admin">Admin</option>
                       </select>
                       <MoreHorizontal size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                         <Search size={32} className="mb-2 opacity-50" />
                         <p>No se encontraron usuarios</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex gap-3">
        <AlertTriangle className="text-yellow-600 flex-shrink-0" size={20} />
        <div className="text-sm text-yellow-800">
          <p className="font-bold mb-1">Zona de Precaución</p>
          <p>Otorgar permisos de Administrador da acceso completo al sistema, incluyendo la capacidad de borrar contenido y gestionar otros usuarios.</p>
        </div>
      </div>
    </div>
  );
};

export default UserTable;