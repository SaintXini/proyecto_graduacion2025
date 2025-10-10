// components/Location.jsx
import React from 'react';
import { MapPin, Navigation, CheckCircle } from 'lucide-react';

const Location = ({ patientData }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Ubicación y Disponibilidad</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
        <div className="flex items-start space-x-4">
          <MapPin className="w-8 h-8 text-blue-600 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 mb-2">Dirección Registrada</h3>
            <p className="text-gray-700">{patientData.address}</p>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold flex items-center">
              <Navigation className="w-4 h-4 mr-2" />
              Actualizar Ubicación
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
        <h3 className="font-bold text-gray-800 mb-4">Disponibilidad para Visitas</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-800">Disponible para visitas</span>
            </div>
            <button className="px-4 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm">Cambiar</button>
          </div>
          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Horarios preferidos:</p>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center space-x-2 p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <span className="text-sm text-gray-700">Mañanas (8-12)</span>
              </label>
              <label className="flex items-center space-x-2 p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <span className="text-sm text-gray-700">Tardes (2-6)</span>
              </label>
            </div>
          </div>
          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Instrucciones especiales:</p>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg text-sm"
              rows="3"
              placeholder="Ej: Casa con portón verde, segundo piso..."
              defaultValue="Casa con portón verde, llamar al timbre dos veces"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Location;
