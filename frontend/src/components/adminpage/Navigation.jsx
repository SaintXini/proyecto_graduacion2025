import React from 'react';
import { Users, BarChart3, MapPin, Apple, FileText } from 'lucide-react';

export const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'blue' },
    { id: 'users', label: 'Gestión Usuarios', icon: Users, color: 'green' },
    { id: 'communities', label: 'Comunidades', icon: MapPin, color: 'purple' },
    { id: 'nutrition', label: 'Nutrición', icon: Apple, color: 'orange' },
    { id: 'traceability', label: 'Trazabilidad', icon: FileText, color: 'red' }
  ];

  const getColorClasses = (color, isActive) => {
    const colors = {
      blue: isActive 
        ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50' 
        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50',
      green: isActive 
        ? 'text-green-600 border-b-4 border-green-600 bg-green-50' 
        : 'text-gray-600 hover:text-green-600 hover:bg-green-50',
      purple: isActive 
        ? 'text-purple-600 border-b-4 border-purple-600 bg-purple-50' 
        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50',
      orange: isActive 
        ? 'text-orange-600 border-b-4 border-orange-600 bg-orange-50' 
        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50',
      red: isActive 
        ? 'text-red-600 border-b-4 border-red-600 bg-red-50' 
        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
    };
    return colors[color] || colors.blue;
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                getColorClasses(tab.color, activeTab === tab.id)
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};