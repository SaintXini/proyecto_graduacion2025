import React, { useContext } from 'react';
import { AppContext } from './context/AppContext';

export const Header = () => {
  const { currentUser } = useContext(AppContext);

  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Sistema de Gestión Médica</h2>
        <p className="text-gray-600">Personal de Salud - Ciudad de Guatemala</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm text-gray-600">
            {currentUser?.first_name} {currentUser?.last_name}
          </p>
          <p className="text-xs text-gray-500">
            {currentUser?.role === 'doctor' ? 'Médico General' : 'Usuario'}
          </p>
        </div>
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          {currentUser?.first_name?.[0]}{currentUser?.last_name?.[0]}
        </div>
      </div>
    </div>
  );
};