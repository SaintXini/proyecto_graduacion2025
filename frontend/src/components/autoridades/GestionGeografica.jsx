import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, Download } from 'lucide-react';
import { datosComunidades, zonasCriticas } from './data/dashboardData';
import { planificarBrigada, descargarGrafica } from './utils/reportUtils';

const GestionGeografica = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Gestión Geográfica (GIS)</h2>
      <p className="text-gray-600">Mapas de calor, identificación de zonas críticas y planificación de brigadas.</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Mapa de Calor - Comunidades</h3>
          <MapPin className="h-5 w-5 text-blue-600" />
        </div>
        <div className="space-y-3">
          {datosComunidades.map((comunidad, index) => (
            <div key={index} className={`border rounded-lg p-4 ${comunidad.critico ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <MapPin className={`h-5 w-5 ${comunidad.critico ? 'text-red-600' : 'text-blue-600'}`} />
                  <span className="font-semibold text-gray-900">{comunidad.nombre}</span>
                  {comunidad.critico && (
                    <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full font-bold">CRÍTICO</span>
                  )}
                </div>
                <span className="text-2xl font-bold text-gray-900">{comunidad.casos}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Lat: {comunidad.lat}, Lon: {comunidad.lon}</span>
                <button
                  onClick={() => planificarBrigada(comunidad.nombre)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                >
                  Planificar Brigada
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Zonas Críticas Identificadas</h3>
        <div className="space-y-4">
          {zonasCriticas.map((zona, index) => (
            <div key={index} className={`border rounded-lg p-4 ${zona.nivel === 'Alto' ? 'border-red-300 bg-red-50' : 'border-yellow-300 bg-yellow-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{zona.zona}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${zona.nivel === 'Alto' ? 'bg-red-600 text-white' : 'bg-yellow-500 text-white'}`}>
                  {zona.nivel}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Casos:</span>
                  <span className="ml-2 font-bold text-gray-900">{zona.casos}</span>
                </div>
                <div>
                  <span className="text-gray-600">Recursos:</span>
                  <span className={`ml-2 font-bold ${zona.recursos === 'Insuficientes' ? 'text-red-600' : 'text-green-600'}`}>
                    {zona.recursos}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Análisis Comparativo por Comunidad</h3>
        <button 
          onClick={() => descargarGrafica('Análisis Comparativo')}
          className="text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Download className="h-5 w-5" />
        </button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={datosComunidades}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="nombre" stroke="#6b7280" angle={-45} textAnchor="end" height={100} />
          <YAxis stroke="#6b7280" />
          <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
          <Area type="monotone" dataKey="casos" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default GestionGeografica;