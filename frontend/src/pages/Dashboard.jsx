import React, { useState } from 'react';
import { AppContext } from '../components/medical/context/AppContext';
import { initialPatients, initialVisits, initialAlerts } from '../components/medical/data/initialData';
import { Sidebar } from '../components/medical/Sidebar';
import { Header } from '../components/medical/Header';
import { DashboardView } from '../components/medical/DashboardView';
import { PatientsView } from '../components/medical/PatientsView';

const DoctorDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [patients, setPatients] = useState(initialPatients);
  const [visits, setVisits] = useState(initialVisits);
  const [alerts, setAlerts] = useState(initialAlerts);

  const renderView = () => {
    switch(currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'patients':
        return <PatientsView />;
      case 'visits':
        return <div><h2 className="text-2xl font-bold">Visitas Domiciliarias</h2></div>;
      case 'calendar':
        return <div><h2 className="text-2xl font-bold">Agenda</h2></div>;
      case 'alerts':
        return <div><h2 className="text-2xl font-bold">Alertas</h2></div>;
      case 'reports':
        return <div><h2 className="text-2xl font-bold">Reportes</h2></div>;
      default:
        return <DashboardView />;
    }
  };

  return (
    <AppContext.Provider value={{ 
      currentView, 
      setCurrentView, 
      patients, 
      setPatients,
      visits,
      setVisits,
      alerts,
      setAlerts
    }}>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-64 p-8">
          <Header />
          {renderView()}
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default DoctorDashboard;