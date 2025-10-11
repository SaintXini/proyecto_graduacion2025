import React from 'react';
import { Activity } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white shadow-md border-b-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-10 h-10 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Sistema Médico Guatemala</h1>
              <p className="text-sm text-gray-500">Panel de Administración</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Admin: Carlos Ramírez</span>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              CR
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};