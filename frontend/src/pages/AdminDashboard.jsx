import React, { useState } from 'react';
import { Header } from '../components/adminpage/Header';
import { Navigation } from '../components/adminpage/Navigation';
import { Footer } from '../components/adminpage/Footer';
import { DashboardTab } from '../components/adminpage/DashboardTab';
import { UsersTab } from '../components/adminpage/UsersTab';
import { CommunitiesTab } from '../components/adminpage/CommunitiesTab';
import { NutritionTab } from '../components/adminpage/NutritionTab';
import { TraceabilityTab } from '../components/adminpage/TraceabilityTab';
import {
  initialUsers,
  initialCommunities,
  initialNutritionData,
  initialTraceability,
  activityData,
  userActivityData,
  roleDistribution
} from '../components/adminpage/data/initalData';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPassword, setShowPassword] = useState({});
  const [users, setUsers] = useState(initialUsers);
  const [newUser, setNewUser] = useState({
    cui: '', 
    nombre: '', 
    apellidos: '', 
    email: '', 
    telefono: '', 
    password: '', 
    rol: 'medico'
  });
  const [communities] = useState(initialCommunities);
  const [nutritionData] = useState(initialNutritionData);
  const [traceability] = useState(initialTraceability);

  const handleCreateUser = () => {
    if (newUser.cui && newUser.nombre && newUser.apellidos && newUser.email) {
      setUsers([...users, { ...newUser, id: users.length + 1, activo: true }]);
      setNewUser({ 
        cui: '', 
        nombre: '', 
        apellidos: '', 
        email: '', 
        telefono: '', 
        password: '', 
        rol: 'medico' 
      });
      alert('Usuario creado exitosamente');
    } else {
      alert('Por favor complete todos los campos obligatorios (CUI, Nombre, Apellidos, Email)');
    }
  };

  const toggleUserStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, activo: !u.activo } : u));
  };

  const downloadChart = (chartName) => {
    alert(`Descargando gráfica: ${chartName}`);
  };

  const downloadUserActions = (user) => {
    alert(`Descargando acciones del usuario: ${user.nombre} ${user.apellidos}`);
  };

  const togglePasswordVisibility = (userId) => {
    setShowPassword(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <DashboardTab 
            activityData={activityData}
            roleDistribution={roleDistribution}
            downloadChart={downloadChart}
          />
        )}

        {activeTab === 'users' && (
          <UsersTab 
            users={users}
            newUser={newUser}
            setNewUser={setNewUser}
            handleCreateUser={handleCreateUser}
            toggleUserStatus={toggleUserStatus}
            downloadUserActions={downloadUserActions}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            userActivityData={userActivityData}
            downloadChart={downloadChart}
          />
        )}

        {activeTab === 'communities' && (
          <CommunitiesTab communities={communities} />
        )}

        {activeTab === 'nutrition' && (
          <NutritionTab nutritionData={nutritionData} />
        )}

        {activeTab === 'traceability' && (
          <TraceabilityTab 
            traceability={traceability}
            downloadChart={downloadChart}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;