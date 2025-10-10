// components/Sidebar.jsx
import React from 'react';
import { Home, User, FileText, Calendar, Bell, MapPin, BookOpen } from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection, notifications }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Inicio', color: 'blue' },
    { id: 'profile', icon: User, label: 'Mi Perfil', color: 'purple' },
    { id: 'history', icon: FileText, label: 'Historial', color: 'green' },
    { id: 'appointments', icon: Calendar, label: 'Citas', color: 'red' },
    { id: 'notifications', icon: Bell, label: 'Notificaciones', color: 'yellow' },
    { id: 'location', icon: MapPin, label: 'Ubicación', color: 'orange' },
    { id: 'education', icon: BookOpen, label: 'Educación', color: 'pink' }
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <nav className="bg-white rounded-lg shadow p-4 space-y-2">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive 
                  ? `bg-${item.color}-500 text-white` 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.id === 'notifications' && notifications.filter(n => !n.read).length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
