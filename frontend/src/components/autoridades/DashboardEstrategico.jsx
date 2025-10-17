import React, { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, AlertCircle, MapPin, Download } from 'lucide-react';
import authorityService from '../../services/authorityService'; // ← CAMBIO
import { descargarGrafica } from './utils/reportUtils';

const DashboardEstrategico = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    consultations_today: 0,
    active_alerts: 0
  });
  const [activityData, setActivityData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar todas las estadísticas en paralelo
      const [statsData, monthlyActivity, rolesDistribution] = await Promise.all([
        authorityService.getDashboardStats(),
        authorityService.getMonthlyActivity(),
        authorityService.getRoleDistribution()
      ]);

      setStats(statsData);
      setActivityData(monthlyActivity);
      setRoleData(rolesDistribution);
      
      console.log('✅ Dashboard cargado correctamente');
    } catch (error) {
      console.error('❌ Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Estratégico</h2>
        <p className="text-gray-600">Casos activos, recuperados y nuevos. Evolución temporal e indicadores clave.</p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Casos Activos</p>
              <p className="text-4xl font-bold mt-2">{stats.total_users}</p>
              <p className="text-blue-100 text-xs mt-2">Sistema completo</p>
            </div>
            <Users className="h-16 w-16 text-blue-300 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Usuarios Activos</p>
              <p className="text-4xl font-bold mt-2">{stats.active_users}</p>
              <p className="text-green-100 text-xs mt-2">En seguimiento</p>
            </div>
            <TrendingUp className="h-16 w-16 text-green-300 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Consultas Hoy</p>
              <p className="text-4xl font-bold mt-2">{stats.consultations_today}</p>
              <p className="text-orange-100 text-xs mt-2">Registradas</p>
            </div>
            <AlertCircle className="h-16 w-16 text-orange-300 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Alertas Activas</p>
              <p className="text-4xl font-bold mt-2">{stats.active_alerts}</p>
              <p className="text-red-100 text-xs mt-2">Requieren atención</p>
            </div>
            <MapPin className="h-16 w-16 text-red-300 opacity-80" />
          </div>
        </div>
      </div>

      {/* Gráfica de evolución mensual */}
      {activityData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Evolución Mensual de Actividad</h3>
            <button
              onClick={() => descargarGrafica('Evolución Mensual')}
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px' 
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="usuarios" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                name="Usuarios"
              />
              <Line 
                type="monotone" 
                dataKey="consultas" 
                stroke="#10b981" 
                strokeWidth={3} 
                name="Consultas"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Distribución por roles */}
      {roleData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Distribución de Usuarios por Rol</h3>
            <button
              onClick={() => descargarGrafica('Distribución por Roles')}
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {roleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="flex justify-center flex-wrap gap-4 mt-4">
            {roleData.map((role, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-4 h-4 rounded mr-2" 
                  style={{ backgroundColor: role.color || '#3b82f6' }}
                ></div>
                <span className="text-sm text-gray-700">{role.name}: {role.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardEstrategico;