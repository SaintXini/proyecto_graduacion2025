import React from 'react';
import { MapPin } from 'lucide-react';

export const CommunitiesTab = ({ communities }) => {
  const handleViewDetails = (community) => {
    alert(`Ver detalles de: ${community.nombre}\nDepartamento: ${community.departamento}\nPoblación: ${community.poblacion}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          <span>Catálogo de Comunidades</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <div key={community.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
              <h4 className="font-bold text-gray-800 text-lg mb-2">{community.nombre}</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Departamento:</span> {community.departamento}</p>
                <p><span className="font-medium">Población:</span> {community.poblacion.toLocaleString()} habitantes</p>
                <p><span className="font-medium">Médicos asignados:</span> {community.medicos}</p>
              </div>
              <button 
                onClick={() => handleViewDetails(community)}
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Ver Detalles
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};