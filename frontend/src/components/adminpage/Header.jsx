import React from 'react';
import { Activity, Bell } from 'lucide-react';
import { LogoutButton } from '../LogoutButton';
import { useAuth } from '../../context/AuthContext';

export const Header = ({ userName }) => {
  const { user } = useAuth();

  // Obtener iniciales del nombre
  const getInitials = (name) => {
    if (!name) return 'AD';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const displayName = userName || user?.nombre || user?.first_name || 'Administrador';
  const fullName = user 
    ? `${user.nombre || user.first_name || ''} ${user.apellidos || user.last_name || ''}`.trim() 
    : displayName;

  return (
    <header className="bg-white shadow-md border-b-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center space-x-3">
            <Activity className="w-10 h-10 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Sistema Médico Guatemala</h1>
              <p className="text-sm text-gray-500">Panel de Administración</p>
            </div>
          </div>

          {/* Información del usuario y acciones */}
          <div className="flex items-center space-x-4">
            {/* Notificaciones */}
            <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Info del usuario */}
            <div className="text-right">
              <span className="text-sm text-gray-600 font-medium block">{fullName}</span>
              {user?.email && (
                <span className="text-xs text-gray-400">{user.email}</span>
              )}
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {getInitials(displayName)}
            </div>

            {/* Botón de logout */}
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
};