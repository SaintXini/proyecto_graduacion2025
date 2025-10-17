import React, { useState, useEffect } from 'react';
import { Bell, Activity } from 'lucide-react';
import MenuNavegacion from '../components/autoridades/MenuNavegacion';
import DashboardEstrategico from '../components/autoridades/DashboardEstrategico';
import GestionGeografica from '../components/autoridades/GestionGeografica';
import ReportesEstadisticas from '../components/autoridades/ReportesEstadisticas';
import AlertasCoordinacion from '../components/autoridades/AlertasCoordinacion';
import { LogoutButton } from '../components/LogoutButton';
import authorityService from '../services/authorityService'; // ← CAMBIO: usar nuevo servicio

const Muni = () => {
  const [seccionActiva, setSeccionActiva] = useState('dashboard');
  const [alertasActivas, setAlertasActivas] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Cargar número de alertas activas
      const alerts = await authorityService.getActiveAlerts();
      setAlertasActivas(alerts.length);
      
      console.log('✅ Datos iniciales cargados');
    } catch (error) {
      console.error('❌ Error cargando datos iniciales:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Activity className="h-10 w-10 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">NUTRIGESTION</h1>
                <p className="text-sm text-gray-600">Santiago Sacatepéquez, Guatemala</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Botón de alertas */}
              <button 
                onClick={() => setSeccionActiva('alertas')}
                className="relative inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5 mr-2" />
                Alertas ({alertasActivas})
                {alertasActivas > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-red-900 animate-pulse">
                    {alertasActivas}
                  </span>
                )}
              </button>
              
              {/* Info de usuario */}
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Autoridad Municipal</div>
                <div className="text-xs text-gray-500">
                  {new Date().toLocaleDateString('es-GT', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Navegación */}
      <MenuNavegacion 
        seccionActiva={seccionActiva} 
        setSeccionActiva={setSeccionActiva} 
      />

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {seccionActiva === 'dashboard' && <DashboardEstrategico />}
        {seccionActiva === 'gis' && <GestionGeografica />}
        {seccionActiva === 'reportes' && <ReportesEstadisticas />}
        {seccionActiva === 'alertas' && (
          <AlertasCoordinacion 
            alertasActivas={alertasActivas}
            onAlertSent={loadInitialData} // Recargar al enviar alerta
          />
        )}
      </div>
    </div>
  );
};

export default Muni;