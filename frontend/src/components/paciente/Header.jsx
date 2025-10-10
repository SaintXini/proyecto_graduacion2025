// components/Header.jsx
import React from 'react';
import { Bell } from 'lucide-react';

const Header = ({ patientData }) => (
  <header className="bg-white shadow-sm sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">N+</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Portal de Pacientes</h1>
            <p className="text-xs text-gray-600">Sistema de Nutrición Infantil</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-full">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {patientData.name.charAt(0)}
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
