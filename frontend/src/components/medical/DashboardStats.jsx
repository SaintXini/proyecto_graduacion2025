import React, { useContext } from 'react';
import { Users, AlertTriangle, Calendar, Bell } from 'lucide-react';
import { AppContext } from './context/AppContext';

export const DashboardStats = () => {
  const { patients, visits, alerts } = useContext(AppContext);

  const stats = [
    { 
      label: 'Total Pacientes', 
      value: patients.length, 
      icon: Users, 
      color: 'bg-blue-500',
      change: '+3 este mes'
    },
    { 
      label: 'Casos Críticos', 
      value: patients.filter(p => p.riesgo === 'alto').length, 
      icon: AlertTriangle, 
      color: 'bg-red-500',
      change: 'Requiere atención'
    },
    { 
      label: 'Visitas Pendientes', 
      value: visits.filter(v => v.estado === 'programada').length, 
      icon: Calendar, 
      color: 'bg-green-500',
      change: 'Esta semana'
    },
    { 
      label: 'Alertas Activas', 
      value: alerts.length, 
      icon: Bell, 
      color: 'bg-yellow-500',
      change: 'Revisar ahora'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
          <div className="text-gray-600 text-sm mb-2">{stat.label}</div>
          <div className="text-xs text-gray-500">{stat.change}</div>
        </div>
      ))}
    </div>
  );
};