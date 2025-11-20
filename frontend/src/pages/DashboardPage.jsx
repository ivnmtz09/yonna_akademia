import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ContentTable from '../components/admin/ContentTable';
import UploadForm from '../components/admin/UploadForm';
import UserTable from '../components/admin/UserTable';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Users, 
  ShieldAlert,
  FileText
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('content');

  // Verificar permisos
  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-red-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
            <ShieldAlert size={40} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Acceso Restringido</h1>
          <p className="text-slate-500 mb-6">
            No tienes los permisos necesarios (Admin/Moderator) para acceder a este panel.
          </p>
          <a href="/" className="btn-primary w-full justify-center">
            Volver al Inicio
          </a>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'content':
        return <ContentTable />;
      case 'upload':
        return <UploadForm />;
      case 'users':
        return user.role === 'admin' ? <UserTable /> : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <ShieldAlert size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-600">Acceso Limitado</h3>
            <p className="text-slate-500">Solo los administradores pueden gestionar usuarios.</p>
          </div>
        );
      default:
        return <ContentTable />;
    }
  };

  const tabs = [
    { id: 'content', label: 'Gestión de Contenido', icon: FileText },
    { id: 'upload', label: 'Subir Nuevo', icon: UploadCloud },
    ...(user.role === 'admin' ? [{ id: 'users', label: 'Usuarios', icon: Users }] : [])
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Dashboard */}
          <div className="bg-brand-dark rounded-3xl p-8 mb-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <LayoutDashboard size={32} className="text-brand-orange" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Panel de Control</h1>
                <p className="text-brand-light/80 mt-1">
                  Bienvenido(a), <span className="font-semibold text-white">{user.first_name}</span>. 
                  Tienes privilegios de <span className="uppercase text-xs font-bold bg-brand-orange px-2 py-0.5 rounded ml-1">{user.role}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2 mb-6 flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-light text-brand-dark shadow-sm ring-1 ring-brand-green/20'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-brand-green' : ''} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden min-h-[500px] p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;