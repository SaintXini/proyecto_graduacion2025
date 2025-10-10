import React from 'react';

export const Header = () => {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Sistema de Gestión Médica</h2>
        <p className="text-gray-600">Personal de Salud - Ciudad de Guatemala</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm text-gray-600">Dr. Juan Pérez</p>
          <p className="text-xs text-gray-500">Médico General</p>
        </div>
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          JP
        </div>
      </div>
    </div>
  );
};