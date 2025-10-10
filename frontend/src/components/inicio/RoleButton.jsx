import React from 'react';

export default function RoleButton({ role, isSelected, onClick }) {
  const Icon = role.icon;
  
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-2xl border-4 transition-all duration-300 ${
        isSelected
          ? `${role.color} text-white border-gray-800 scale-105 shadow-2xl`
          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400 hover:scale-102'
      }`}
    >
      <Icon className={`w-12 h-12 mx-auto mb-3 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
      <h3 className="font-bold text-lg mb-1">{role.name}</h3>
      <p className={`text-sm ${isSelected ? 'text-white' : 'text-gray-500'}`}>
        {role.description}
      </p>
    </button>
  );
}