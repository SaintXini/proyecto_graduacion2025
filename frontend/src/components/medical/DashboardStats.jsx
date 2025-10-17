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
      change: `${patients.filter(p => p.is_active).length} activos`,
      bgGradient: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Registros Médicos',
      value: medicalRecords.length,
      icon: FileText,
      color: 'bg-green-500',
      change: 'Total de consultas',
      bgGradient: 'from-green-500 to-green-600'
    },
    {
      label: 'Planes Nutrición',
      value: nutritionPlans.filter(p => p.status === 'active').length,
      icon: Calendar,
      color: 'bg-purple-500',
      change: 'Planes activos',
      bgGradient: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Alertas Activas',
      value: alerts.length,
      icon: Bell,
      color: 'bg-red-500',
      change: 'Requieren atención',
      bgGradient: 'from-red-500 to-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {dashboardStats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`bg-gradient-to-br ${stat.bgGradient} p-3 rounded-lg shadow-md`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
            <div className="text-gray-600 text-sm mb-2">{stat.label}</div>
            <div className="text-xs text-gray-500 flex items-center">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              {stat.change}
            </div>
          </div>
          <div className={`h-1 bg-gradient-to-r ${stat.bgGradient}`}></div>
        </div>
      ))}
    </div>
  );
};
