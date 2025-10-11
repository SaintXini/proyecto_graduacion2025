import React from 'react';
import { Users, BarChart3, MapPin, Apple, FileText } from 'lucide-react';

export const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Gestión Usuarios', icon: Users },
    { id: 'communities', label: 'Comunidades', icon: MapPin },
    { id: 'nutrition', label: 'Nutrición', icon: Apple },
    { id: 'traceability', label: 'Trazabilidad', icon: FileText }
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex space-x-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
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