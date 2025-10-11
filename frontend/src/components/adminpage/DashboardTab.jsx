import React from 'react';
import { Users, Activity, AlertCircle, CheckCircle, UserPlus, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const DashboardTab = ({ activityData, roleDistribution, downloadChart }) => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Usuarios Totales</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">78</p>
            </div>
            <Users className="w-12 h-12 text-blue-600 opacity-80" />
          </div>
          <p className="text-green-600 text-sm mt-3">↑ 12% vs mes anterior</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Usuarios Activos</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">65</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-600 opacity-80" />
          </div>
          <p className="text-green-600 text-sm mt-3">↑ 8% vs mes anterior</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Alertas Activas</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">5</p>
            </div>
            <AlertCircle className="w-12 h-12 text-orange-600 opacity-80" />
          </div>
          <p className="text-green-600 text-sm mt-3">↓ 30% vs mes anterior</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Consultas Hoy</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">234</p>
            </div>
            <Activity className="w-12 h-12 text-purple-600 opacity-80" />
          </div>
          <p className="text-green-600 text-sm mt-3">↑ 18% vs mes anterior</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <Line type="monotone" dataKey="usuarios" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="consultas" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

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
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Resumen de Actividad del Sistema</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">Nuevo médico registrado: Dr. Luis González</span>
            </div>
            <span className="text-sm text-gray-500">Hace 2 horas</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">45 consultas completadas hoy</span>
            </div>
            <span className="text-sm text-gray-500">Hace 1 hora</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <span className="text-gray-700">Alerta: Sistema requiere actualización de seguridad</span>
            </div>
            <span className="text-sm text-gray-500">Hace 3 horas</span>
          </div>
        </div>
      </div>
    </div>
  );
};