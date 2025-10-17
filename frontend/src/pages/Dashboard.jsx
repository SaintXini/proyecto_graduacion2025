import React, { useContext } from 'react';
import { AppProvider, AppContext } from '../components/medical/context/AppContext';
import { Sidebar } from '../components/medical/Sidebar';
import { Header } from '../components/medical/Header';
import { DashboardView } from '../components/medical/DashboardView';
import { PatientsView } from '../components/medical/PatientsView';
import { RecordsView } from '../components/medical/RecordsView';
import { NutritionView } from '../components/medical/NutritionView';
import { AlertsView } from '../components/medical/AlertsView';
import { VisitsView } from '../components/medical/VisitsView'; // ← AGREGAR
const DashboardContent = () => {
const { currentView, loading, error, refreshData } = useContext(AppContext);
const renderView = () => {
if (error) {
return (
<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow">
<div className="flex items-center mb-2">
<svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
clipRule="evenodd" />
</svg>
<p className="text-red-700 font-medium">Error al cargar datos</p>
</div>
<p className="text-red-600 text-sm mb-3">{error}</p>
<button
onClick={refreshData}
className="text-sm text-red-600 hover:text-red-800 underline font-medium"
>
 Reintentar
</button>
</div>
);
}
if (loading && currentView === 'dashboard') {
return (
<div className="flex items-center justify-center py-12">
<div className="text-center">
<div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
<p className="mt-4 text-gray-600 font-medium">Cargando sistema médico...</p>
<p className="text-sm text-gray-500 mt-2">Por favor espere</p>
</div>
</div>
);
}
switch(currentView) {
case 'dashboard':
return <DashboardView />;
case 'patients':
return <PatientsView />;
case 'visits':
return <VisitsView />; // ← CAMBIAR AQUÍ
case 'nutrition':
return <NutritionView />;
case 'records':
return <RecordsView />;
case 'alerts':
return <AlertsView />;
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
export default DoctorDashboard