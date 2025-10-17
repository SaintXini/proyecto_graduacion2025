import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MapPin, Download, Calendar, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import authorityService from '../../services/authorityService';
import { descargarGrafica } from './utils/reportUtils';

const GestionGeografica = () => {
  const [communities, setCommunities] = useState([]);
  const [criticalZones, setCriticalZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadGeographicData();
  }, []);

  const loadGeographicData = async () => {
    try {
      setLoading(true);
      console.log('🗺️ [GestionGeografica] Iniciando carga de datos geográficos...');
      
      // Primero verificar que el servicio esté disponible
      console.log('📡 [GestionGeografica] authorityService disponible:', !!authorityService);
      console.log('📡 [GestionGeografica] getCommunities disponible:', !!authorityService.getCommunities);
      
      const [communitiesData, zonesData] = await Promise.all([
        authorityService.getCommunities(),
        authorityService.getCriticalZones()
      ]);
      
      console.log('✅ [GestionGeografica] Datos recibidos:');
      console.log('   - communitiesData:', communitiesData);
      console.log('   - zonesData:', zonesData);
      console.log('   - Número de comunidades:', communitiesData?.length || 0);
      
      if (!communitiesData || communitiesData.length === 0) {
        console.warn('⚠️ [GestionGeografica] No se recibieron comunidades');
      }
      
      setCommunities(communitiesData || []);
      setCriticalZones(zonesData || []);
      
      const totalPacientes = (communitiesData || []).reduce((sum, c) => sum + (c.casos || 0), 0);
      const criticas = (zonesData || []).filter(z => z.nivel === 'Alto').length;
      
      console.log('✅ [GestionGeografica] Estado actualizado:');
      console.log('   - Comunidades cargadas:', communitiesData?.length || 0);
      console.log('   - Total pacientes:', totalPacientes);
      console.log('   - Zonas críticas:', criticas);
    } catch (error) {
      console.error('❌ [GestionGeografica] Error cargando datos geográficos:', error);
      console.error('   Stack:', error.stack);
      setCommunities([]);
      setCriticalZones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadGeographicData();
    setRefreshing(false);
  };

  const handleScheduleBrigade = async (community) => {
    try {
      const result = await authorityService.scheduleBrigade(community.nombre || community.name);
      if (result.success) {
        alert(`✅ ${result.message}\n\n📅 Fecha programada: ${new Date(result.scheduled_date).toLocaleDateString('es-GT')}\n\n👥 Recursos asignados:\n- 2 médicos\n- 3 enfermeras\n- Suministros nutricionales\n- Transporte confirmado`);
        
        // Recargar datos después de programar
        await handleRefresh();
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

  const totalPacientes = communities.reduce((sum, c) => sum + (c.casos || 0), 0);
  const comunidadesCriticas = communities.filter(c => c.critico).length;
  const comunidadesConPacientes = communities.filter(c => (c.casos || 0) > 0).length;

  return (
    <div className="space-y-8">
      {/* Header con estadísticas */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-gray-900">Gestión Geográfica (GIS)</h2>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-gray-400 flex items-center space-x-2"
          >
            {refreshing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Actualizando...</span>
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                <span>Actualizar Datos</span>
              </>
            )}
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Mapas de calor con datos reales de pacientes, identificación de zonas críticas y planificación de brigadas médicas.
        </p>
        
        {/* Indicadores rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Pacientes</p>
                <p className="text-3xl font-bold mt-1">{totalPacientes}</p>
                <p className="text-blue-100 text-xs mt-1">Registrados en el sistema</p>
              </div>
              <Users className="h-12 w-12 text-blue-200 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Comunidades</p>
                <p className="text-3xl font-bold mt-1">{communities.length}</p>
                <p className="text-green-100 text-xs mt-1">{comunidadesConPacientes} con pacientes</p>
              </div>
              <MapPin className="h-12 w-12 text-green-200 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Zonas Críticas</p>
                <p className="text-3xl font-bold mt-1">{comunidadesCriticas}</p>
                <p className="text-red-100 text-xs mt-1">{comunidadesCriticas > 0 ? 'Requieren atención' : 'Todo bajo control'}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-red-200 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Promedio/Comunidad</p>
                <p className="text-3xl font-bold mt-1">{communities.length > 0 ? (totalPacientes / communities.length).toFixed(1) : 0}</p>
                <p className="text-purple-100 text-xs mt-1">Pacientes por comunidad</p>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-200 opacity-80" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mapa de comunidades con datos reales */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Mapa de Calor - Comunidades Registradas
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Datos en tiempo real</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {communities.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-700 font-medium mb-2">No hay comunidades para mostrar</p>
              <p className="text-sm text-gray-500 mb-4">
                Verifica la consola del navegador (F12) para más detalles
              </p>
              
              {/* Debug info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4 text-left max-w-md mx-auto">
                <p className="text-xs font-semibold text-yellow-800 mb-2">🔍 Información de Debug:</p>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• Estado loading: {loading ? 'Sí' : 'No'}</li>
                  <li>• Comunidades cargadas: {communities.length}</li>
                  <li>• Presiona F12 y revisa la consola para ver los logs</li>
                </ul>
                <button
                  onClick={() => {
                    console.log('🔍 Estado actual del componente:');
                    console.log('   - communities:', communities);
                    console.log('   - criticalZones:', criticalZones);
                    console.log('   - loading:', loading);
                  }}
                  className="mt-3 w-full px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition-colors"
                >
                  Ver Estado en Consola
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {communities.map((community, index) => (
                <div
                  key={community.id || index}
                  className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                    community.critico
                      ? 'border-red-400 bg-red-50 shadow-md'
                      : community.casos > 30
                      ? 'border-yellow-400 bg-yellow-50'
                      : community.casos > 0
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <MapPin
                        className={`h-5 w-5 ${
                          community.critico
                            ? 'text-red-600'
                            : community.casos > 30
                            ? 'text-yellow-600'
                            : community.casos > 0
                            ? 'text-blue-600'
                            : 'text-gray-400'
                        }`}
                      />
                      <span className="font-semibold text-gray-900">
                        {community.nombre || community.name}
                      </span>
                      {community.critico && (
                        <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full font-bold animate-pulse">
                          ⚠️ CRÍTICO
                        </span>
                      )}
                      {!community.critico && community.casos > 30 && (
                        <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full font-bold">
                          ⚠ ATENCIÓN
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className={`h-4 w-4 ${community.casos > 0 ? 'text-gray-600' : 'text-gray-300'}`} />
                      <span className={`text-2xl font-bold ${
                        community.critico ? 'text-red-600' :
                        community.casos > 30 ? 'text-yellow-600' :
                        community.casos > 0 ? 'text-blue-600' :
                        'text-gray-400'
                      }`}>
                        {community.casos || 0}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3 bg-white/50 p-2 rounded">
                    {community.location && (
                      <div className="flex items-start">
                        <span className="font-medium mr-1">📍</span>
                        <span>{community.location}</span>
                      </div>
                    )}
                    {community.population && (
                      <div className="flex items-start">
                        <span className="font-medium mr-1">👥</span>
                        <span>{community.population.toLocaleString()} hab.</span>
                      </div>
                    )}
                    {(community.lat && community.lon) && (
                      <div className="flex items-start col-span-2">
                        <span className="font-medium mr-1">🗺️</span>
                        <span>{community.lat?.toFixed(4)}, {community.lon?.toFixed(4)}</span>
                      </div>
                    )}
                  </div>

                  {/* Barra de progreso visual */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-600">Nivel de saturación</span>
                      <span className="text-xs font-bold">
                        {community.casos > 50 ? '100%' : `${((community.casos / 50) * 100).toFixed(0)}%`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          community.critico ? 'bg-red-600' :
                          community.casos > 30 ? 'bg-yellow-500' :
                          community.casos > 0 ? 'bg-blue-500' :
                          'bg-gray-300'
                        }`}
                        style={{ width: `${Math.min((community.casos / 50) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      {community.casos === 0 ? '✓ Sin pacientes registrados' : 
                       community.casos === 1 ? '1 paciente registrado' :
                       `${community.casos} pacientes registrados`}
                    </span>
                    <button
                      onClick={() => handleScheduleBrigade(community)}
                      disabled={community.casos === 0}
                      className={`px-3 py-1 text-xs rounded transition-colors flex items-center space-x-1 ${
                        community.casos === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : community.critico
                          ? 'bg-red-600 hover:bg-red-700 text-white shadow-md'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <Calendar className="h-3 w-3" />
                      <span>Planificar Brigada</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Zonas críticas */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
            Zonas Críticas Identificadas
          </h3>
          
          {criticalZones.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-medium text-green-600">✅ Sin zonas críticas</p>
              <p className="text-sm text-gray-500 mt-2">Todas las comunidades están bajo control</p>
              <p className="text-xs text-gray-400 mt-1">Umbral crítico: &gt;50 pacientes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {criticalZones.map((zone, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                    zone.nivel === 'Alto'
                      ? 'border-red-400 bg-red-50'
                      : 'border-yellow-400 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900 flex items-center">
                      <MapPin className={`h-4 w-4 mr-2 ${zone.nivel === 'Alto' ? 'text-red-600' : 'text-yellow-600'}`} />
                      {zone.zona}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        zone.nivel === 'Alto'
                          ? 'bg-red-600 text-white'
                          : 'bg-yellow-500 text-white'
                      }`}
                    >
                      {zone.nivel === 'Alto' ? '🔴' : '🟡'} {zone.nivel}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div className="bg-white/50 p-2 rounded">
                      <span className="text-gray-600 block text-xs">Pacientes:</span>
                      <span className="ml-2 font-bold text-gray-900 text-lg">{zone.casos}</span>
                    </div>
                    <div className="bg-white/50 p-2 rounded">
                      <span className="text-gray-600 block text-xs">Recursos:</span>
                      <span
                        className={`ml-2 font-bold text-sm ${
                          zone.recursos === 'Insuficientes'
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}
                      >
                        {zone.recursos}
                      </span>
                    </div>
                  </div>
                  {zone.nivel === 'Alto' && (
                    <div className="bg-red-100 border border-red-300 rounded p-2 text-xs text-red-800">
                      ⚠️ <strong>Acción requerida:</strong> Se recomienda intervención inmediata
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Gráficas de análisis */}
      {communities.length > 0 && (
        <>
          {/* Gráfica de área comparativa */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                📊 Análisis Comparativo por Comunidad
              </h3>
              <button
                onClick={() => descargarGrafica('Análisis Comparativo')}
                className="text-blue-600 hover:text-blue-700 transition-colors flex items-center space-x-1"
              >
                <Download className="h-5 w-5" />
                <span className="text-sm">Descargar</span>
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
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="casos"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="Pacientes"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfica de barras */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                📈 Distribución de Pacientes por Comunidad
              </h3>
              <button
                onClick={() => descargarGrafica('Distribución de Pacientes')}
                className="text-blue-600 hover:text-blue-700 transition-colors flex items-center space-x-1"
              >
                <Download className="h-5 w-5" />
                <span className="text-sm">Descargar</span>
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={communities}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey={(item) => item.nombre || item.name}
                  stroke="#6b7280"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="casos" fill="#3b82f6" name="Pacientes" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Leyenda de interpretación */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Interpretación de niveles:</span>
            </p>
            <ul className="mt-2 text-sm text-blue-600 space-y-1">
              <li>🟢 <strong>Normal (0-30 pacientes):</strong> Situación bajo control</li>
              <li>🟡 <strong>Atención (31-50 pacientes):</strong> Requiere monitoreo constante</li>
              <li>🔴 <strong>Crítico (&gt;50 pacientes):</strong> Requiere intervención inmediata</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionGeografica;