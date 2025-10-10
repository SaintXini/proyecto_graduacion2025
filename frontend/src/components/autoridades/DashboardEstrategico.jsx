import React from 'react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, AlertCircle, MapPin, Download } from 'lucide-react';
import { datosMensuales, datosGenero, datosEdad } from './data/dashboardData';
import { descargarGrafica } from './utils/reportUtils';

const DashboardEstrategico = () => {
  const COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];
  
return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Estratégico</h2>
        <p className="text-gray-600">Casos activos, recuperados y nuevos. Evolución temporal e indicadores clave.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Casos Activos</p>
              <p className="text-4xl font-bold mt-2">178</p>
              <p className="text-blue-100 text-xs mt-2">+12% vs mes anterior</p>
            </div>
            <Users className="h-16 w-16 text-blue-300 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Recuperados</p>
              <p className="text-4xl font-bold mt-2">167</p>
              <p className="text-green-100 text-xs mt-2">+8% vs mes anterior</p>
            </div>
            <TrendingUp className="h-16 w-16 text-green-300 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Nuevos Casos</p>
              <p className="text-4xl font-bold mt-2">63</p>
              <p className="text-orange-100 text-xs mt-2">Este mes</p>
            </div>
            <AlertCircle className="h-16 w-16 text-orange-300 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Zonas Críticas</p>
              <p className="text-4xl font-bold mt-2">2</p>
              <p className="text-red-100 text-xs mt-2">Requieren atención inmediata</p>
            </div>
            <MapPin className="h-16 w-16 text-red-300 opacity-80" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Evolución Mensual de Casos</h3>
            <button 
              onClick={() => descargarGrafica('Evolución Mensual')}
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosMensuales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="activos" stroke="#3b82f6" strokeWidth={3} name="Activos" />
              <Line type="monotone" dataKey="recuperados" stroke="#10b981" strokeWidth={3} name="Recuperados" />
              <Line type="monotone" dataKey="nuevos" stroke="#f59e0b" strokeWidth={3} name="Nuevos" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Distribución por Género</h3>
            <button 
              onClick={() => descargarGrafica('Distribución por Género')}
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datosGenero}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nombre, porcentaje }) => `${nombre}: ${porcentaje}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="valor"
              >
                {datosGenero.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#ec4899'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm text-gray-700">Masculino: 812</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-pink-500 rounded mr-2"></div>
              <span className="text-sm text-gray-700">Femenino: 891</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Casos por Rango de Edad</h3>
          <button 
            onClick={() => descargarGrafica('Casos por Edad')}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosEdad}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="rango" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Bar dataKey="casos" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardEstrategico;