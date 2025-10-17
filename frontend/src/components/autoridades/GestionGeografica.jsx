import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, Download, Calendar } from 'lucide-react';
import authorityService from '../../services/authorityService'; // ← CAMBIO
import { descargarGrafica } from './utils/reportUtils';

const GestionGeografica = () => {
  const [communities, setCommunities] = useState([]);
  const [criticalZones, setCriticalZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGeographicData();
  }, []);

  const loadGeographicData = async () => {
    try {
      setLoading(true);
      
      const [communitiesData, zonesData] = await Promise.all([
        authorityService.getCommunities(),
        authorityService.getCriticalZones()
      ]);

      setCommunities(communitiesData);
      setCriticalZones(zonesData);
      
      console.log('✅ Datos geográficos cargados');
    } catch (error) {
      console.error('❌ Error cargando datos geográficos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleBrigade = async (communityName) => {
    try {
      const result = await authorityService.scheduleBrigade(communityName);
      
      if (result.success) {
        alert(`✅ ${result.message}\n\nFecha programada: ${new Date(result.scheduled_date).toLocaleDateString('es-GT')}`);
      }
    } catch (error) {
      console.error('Error programando brigada:', error);
      alert('❌ Error al programar la brigada. Por favor intente nuevamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando datos geográficos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Gestión Geográfica (GIS)</h2>
        <p className="text-gray-600">Mapas de calor, identificación de zonas críticas y planificación de brigadas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mapa de comunidades */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Mapa de Calor - Comunidades</h3>
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>
          
          <div className="space-y-3">
            {communities.map((community, index) => (
              <div 
                key={index} 
                className={`border rounded-lg p-4 ${
                  community.critico || community.casos > 50
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MapPin 
                      className={`h-5 w-5 ${
                        community.critico || community.casos > 50
                          ? 'text-red-600' 
                          : 'text-blue-600'
                      }`} 
                    />
                    <span className="font-semibold text-gray-900">
                      {community.nombre || community.name}
                    </span>
                    {(community.critico || community.casos > 50) && (
                      <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full font-bold">
                        CRÍTICO
                      </span>
                    )}
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {community.casos || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    Lat: {community.lat}, Lon: {community.lon}
                  </span>
                  <button
                    onClick={() => handleScheduleBrigade(community.nombre || community.name)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors flex items-center space-x-1"
                  >
                    <Calendar className="h-3 w-3" />
                    <span>Planificar Brigada</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zonas críticas */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Zonas Críticas Identificadas</h3>
          
          <div className="space-y-4">
            {criticalZones.map((zone, index) => (
              <div 
                key={index} 
                className={`border rounded-lg p-4 ${
                  zone.nivel === 'Alto' 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-yellow-300 bg-yellow-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{zone.zona}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    zone.nivel === 'Alto' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {zone.nivel}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Casos:</span>
                    <span className="ml-2 font-bold text-gray-900">{zone.casos}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Recursos:</span>
                    <span className={`ml-2 font-bold ${
                      zone.recursos === 'Insuficientes' 
                        ? 'text-red-600' 
                        : 'text-green-600'
                    }`}>
                      {zone.recursos}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfica comparativa */}
      {communities.length > 0 && (
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
            <AreaChart data={communities}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey={(item) => item.nombre || item.name} 
                stroke="#6b7280" 
                angle={-45} 
                textAnchor="end" 
                height={100} 
              />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px' 
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="casos" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.6} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default GestionGeografica;