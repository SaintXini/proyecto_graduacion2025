import React from 'react';
import { BarChart3, Map, FileText, Bell } from 'lucide-react';

const MenuNavegacion = ({ seccionActiva, setSeccionActiva }) => {
  const menuItems = [
    { id: 'dashboard', nombre: 'Dashboard Estratégico', icono: BarChart3 },
    { id: 'gis', nombre: 'Gestión Geográfica (GIS)', icono: Map },
    { id: 'reportes', nombre: 'Reportes y Estadísticas', icono: FileText },
    { id: 'alertas', nombre: 'Alertas y Coordinación', icono: Bell }
  ];

  return (
    <nav className="bg-white shadow-md border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1">
          {menuItems.map((item) => {
            const Icon = item.icono;
            return (
              <button
                key={item.id}
                onClick={() => setSeccionActiva(item.id)}
                className={`flex items-center px-6 py-4 font-medium transition-all ${
                  seccionActiva === item.id
                    ? 'border-b-4 border-blue-600 text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {item.nombre}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MenuNavegacion;