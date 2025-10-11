import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LogoutButton = ({ className = '' }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
      navigate('/', { replace: true });
    }
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="text-right">
        <div className="text-sm font-semibold text-gray-800">
          {user?.first_name} {user?.last_name}
        </div>
        <div className="text-xs text-gray-500 capitalize">
          {user?.role === 'admin' ? 'Administrador' :
           user?.role === 'authority' ? 'Autoridad Municipal' :
           user?.role === 'doctor' ? 'Médico' :
           user?.role === 'patient' ? 'Paciente' : user?.role}
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        title="Cerrar sesión"
      >
        <LogOut className="h-5 w-5" />
        <span className="hidden sm:inline">Salir</span>
      </button>
    </div>
  );
};