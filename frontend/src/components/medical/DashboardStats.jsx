import React, { useContext } from 'react';
import { Users, FileText, Calendar, Bell } from 'lucide-react';
import { AppContext } from './context/AppContext';

export const DashboardStats = () => {
  const { patients, medicalRecords, nutritionPlans, alerts, stats } = useContext(AppContext);

  const dashboardStats = [
    {
      label: 'Total Pacientes',
      value: patients.length,
      icon: Users,
      color: 'bg-blue-500',
      change: `${patients.filter(p => p.is_active).length} activos`
    },
    {
      label: 'Registros Médicos',
      value: medicalRecords.length,
      icon: FileText,
      color: 'bg-green-500',
      change: 'Total registros'
    },
    {
      label: 'Planes Nutrición',
      value: nutritionPlans.filter(p => p.status === 'active').length,
      icon: Calendar,
      color: 'bg-purple-500',
      change: 'Activos'
    },
    {
      label: 'Alertas Activas',
      value: alerts.length,
      icon: Bell,
      color: 'bg-red-500',
      change: 'Requieren atención'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {dashboardStats.map((stat, index) => (
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