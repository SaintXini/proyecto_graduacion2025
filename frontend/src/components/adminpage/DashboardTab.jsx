import React from 'react';
import { Users, Activity, AlertCircle, CheckCircle, UserPlus, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const DashboardTab = ({ 
  activityData, 
  roleDistribution, 
  downloadChart,
  totalUsers = 0,
  activeUsers = 0
}) => {
  // Calcular estadísticas
  const inactiveUsers = totalUsers - activeUsers;
  const activePercentage = totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(0) : 0;

  return (
    <div className="space-y-6">
      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Usuarios Totales</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{totalUsers}</p>
            </div>
            <Users className="w-12 h-12 text-blue-600 opacity-80" />
          </div>
          <p className="text-sm text-gray-600 mt-3">Registrados en el sistema</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Usuarios Activos</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{activeUsers}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-600 opacity-80" />
          </div>
          <p className="text-green-600 text-sm mt-3">{activePercentage}% del total</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Usuarios Inactivos</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{inactiveUsers}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-orange-600 opacity-80" />
          </div>
          <p className="text-sm text-gray-600 mt-3">Requieren atención</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Actividad Hoy</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">234</p>
            </div>
            <Activity className="w-12 h-12 text-purple-600 opacity-80" />
          </div>
          <p className="text-green-600 text-sm mt-3">↑ 18% vs ayer</p>
        </div>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfica de línea - Actividad mensual */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Actividad Mensual</h3>
            <button
              onClick={() => downloadChart('Actividad Mensual')}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Descargar</span>
            </button>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="usuarios" stroke="#3b82f6" strokeWidth={2} name="Usuarios" />
              <Line type="monotone" dataKey="consultas" stroke="#8b5cf6" strokeWidth={2} name="Consultas" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica de pastel - Distribución de roles */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Distribución de Roles</h3>
            <button
              onClick={() => downloadChart('Distribución de Roles')}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Descargar</span>
            </button>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roleDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent, value }) => 
                  value > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {roleDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Leyenda personalizada */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {roleDistribution.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actividad reciente del sistema */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Actividad Reciente del Sistema</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">Nuevo usuario registrado en el sistema</span>
            </div>
            <span className="text-sm text-gray-500">Hace 2 horas</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">{activeUsers} usuarios activos en el sistema</span>
            </div>
            <span className="text-sm text-gray-500">Actualizado ahora</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-purple-600" />
              <span className="text-gray-700">Sistema funcionando correctamente</span>
            </div>
            <span className="text-sm text-gray-500">Estado actual</span>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
          <h4 className="font-bold text-gray-800 mb-2">Sistema Actualizado</h4>
          <p className="text-sm text-gray-600">
            Última actualización: {new Date().toLocaleDateString('es-GT')}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
          <h4 className="font-bold text-gray-800 mb-2">Rendimiento</h4>
          <p className="text-sm text-gray-600">
            Todos los servicios operando normalmente
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
          <h4 className="font-bold text-gray-800 mb-2">Soporte</h4>
          <p className="text-sm text-gray-600">
            Contacto: soporte@sistemamedico.gt
          </p>
        </div>
      </div>
    </div>
  );
};