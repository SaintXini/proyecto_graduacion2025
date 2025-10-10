import React from 'react';
import { Activity, LogOut } from 'lucide-react';

export const Header = () => {
  const handleLogout = () => {
    // Aquí puedes agregar tu lógica de cierre de sesión
    // Por ejemplo: limpiar tokens, redirigir, etc.
    console.log('Sesión cerrada');
  };

  return (
    <header className="bg-white shadow-md border-b-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-10 h-10 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">NUTRIGEST</h1>
              <p className="text-sm text-gray-500">Panel de Administración</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Admin: Carlos Ramírez</span>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              CR
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
