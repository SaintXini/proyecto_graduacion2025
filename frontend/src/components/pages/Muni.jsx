import React, { useState } from 'react';
import { Bell, Activity } from 'lucide-react';
import MenuNavegacion from '../autoridades/MenuNavegacion';
import DashboardEstrategico from '../autoridades/DashboardEstrategico';
import GestionGeografica from '../autoridades/GestionGeografica';
import ReportesEstadisticas from '../autoridades/ReportesEstadisticas';
import AlertasCoordinacion from '../autoridades/AlertasCoordinacion';

const AuthorityDashboard = () => {
  const [seccionActiva, setSeccionActiva] = useState('dashboard');
  const [alertasActivas, setAlertasActivas] = useState(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-md border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Activity className="h-10 w-10 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Autoridades Municipales</h1>
                <p className="text-sm text-gray-600">Monitoreo de Desnutrición - Sacatepéquez, Guatemala</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setSeccionActiva('alertas')}
                className="relative inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5 mr-2" />
                Alertas ({alertasActivas})
                {alertasActivas > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-red-900">
                    {alertasActivas}
                  </span>
                )}
              </button>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Autoridad Municipal</div>
                <div className="text-xs text-gray-500">
                  {new Date().toLocaleDateString('es-GT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MenuNavegacion seccionActiva={seccionActiva} setSeccionActiva={setSeccionActiva} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {seccionActiva === 'dashboard' && <DashboardEstrategico />}
        {seccionActiva === 'gis' && <GestionGeografica />}
        {seccionActiva === 'reportes' && <ReportesEstadisticas />}
        {seccionActiva === 'alertas' && <AlertasCoordinacion alertasActivas={alertasActivas} />}
      </div>
    </div>
  );
};

export default AuthorityDashboard;