import React, { useState, useContext } from 'react';
import { AppProvider, AppContext } from '../components/medical/context/AppContext';
import { Sidebar } from '../components/medical/Sidebar';
import { Header } from '../components/medical/Header';
import { DashboardView } from '../components/medical/DashboardView';
import { PatientsView } from '../components/medical/PatientsView';

const DashboardContent = () => {
  const { currentView, loading, error, refreshData } = useContext(AppContext);

  const renderView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando datos...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 font-medium">Error: {error}</p>
          <button 
            onClick={refreshData}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Reintentar
          </button>
        </div>
      );
    }

    switch(currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'patients':
        return <PatientsView />;
      case 'visits':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800">Visitas Domiciliarias</h2>
            <p className="text-gray-600 mt-2">Funcionalidad en desarrollo</p>
          </div>
        );
      case 'nutrition':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800">Planes de Nutrición</h2>
            <p className="text-gray-600 mt-2">Funcionalidad en desarrollo</p>
          </div>
        );
      case 'records':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800">Registros Médicos</h2>
            <p className="text-gray-600 mt-2">Funcionalidad en desarrollo</p>
          </div>
        );
      case 'alerts':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800">Alertas</h2>
            <p className="text-gray-600 mt-2">Funcionalidad en desarrollo</p>
          </div>
        );
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <Header />
        {renderView()}
      </div>
    </div>
  );
};

const DoctorDashboard = () => {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
};

export default DoctorDashboard;