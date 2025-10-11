// pages/Paciente.jsx
import React, { useState } from 'react';
import Header from '../components/paciente/Header';
import Sidebar from '../components/paciente/Sidebar';
import Dashboard from '../components/paciente/Dashboard';
import Profile from '../components/paciente/Profile';
import History from '../components/paciente/History';
import Appointments from '../components/paciente/Appointments';
import Notifications from '../components/paciente/Notifications';
import Location from '../components/paciente/Location';
import Education from '../components/paciente/Education';
import { mockData } from '../components/paciente/data/mockData';

const PatientDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedNotification, setSelectedNotification] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header patientData={mockData.patient} />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Sidebar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection}
            notifications={mockData.notifications}
          />
          
          <main className="flex-1">
            {activeSection === 'dashboard' && (
              <Dashboard 
                patientData={mockData.patient}
                notifications={mockData.notifications}
                appointments={mockData.appointments}
                treatments={mockData.treatments}
              />
            )}
            {activeSection === 'profile' && (
              <Profile patientData={mockData.patient} />
            )}
            {activeSection === 'history' && (
              <History nutritionHistory={mockData.nutritionHistory} />
            )}
            {activeSection === 'appointments' && (
              <Appointments appointments={mockData.appointments} />
            )}
            {activeSection === 'notifications' && (
              <Notifications 
                notifications={mockData.notifications}
                setSelectedNotification={setSelectedNotification}
              />
            )}
            {activeSection === 'location' && (
              <Location patientData={mockData.patient} />
            )}
            {activeSection === 'education' && (
              <Education educationalMaterials={mockData.educationalMaterials} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
