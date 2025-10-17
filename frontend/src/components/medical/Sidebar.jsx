// Frontend/src/components/medical/Sidebar.jsx - ACTUALIZADO
import React, { useContext } from 'react';
import { Home, Users, MapPin, Calendar, Bell, FileText, Activity, LogOut, Clock } from 'lucide-react';
import { AppContext } from './context/AppContext';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
  const { currentView, setCurrentView, alerts } = useContext(AppContext);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'patients', icon: Users, label: 'Pacientes' },
    { id: 'appointments', icon: Clock, label: 'Citas Médicas' }, // ← NUEVO
    { id: 'visits', icon: MapPin, label: 'Visitas Domiciliarias' },
    { id: 'nutrition', icon: Calendar, label: 'Planes de Nutrición' },
    { id: 'records', icon: FileText, label: 'Registros Médicos' },
    { id: 'alerts', icon: Bell, label: 'Alertas', badge: alerts.length }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-blue-900 text-white shadow-lg">
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center space-x-3">
          <Activity className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">NUTRIGESTION</h1>
            <p className="text-xs text-blue-300">Sistema de Gestión Medica</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mb-2 transition ${
              currentView === item.id
                ? 'bg-blue-700 text-white'
                : 'text-blue-100 hover:bg-blue-800'
            }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
            {item.badge > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-blue-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};