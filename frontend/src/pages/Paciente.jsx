// Frontend/src/pages/Paciente.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/paciente/Header';
import Sidebar from '../components/paciente/Sidebar';
import Dashboard from '../components/paciente/Dashboard';
import Profile from '../components/paciente/Profile';
import History from '../components/paciente/History';
import Appointments from '../components/paciente/Appointments';
import Notifications from '../components/paciente/Notifications';
import Location from '../components/paciente/Location';
import Education from '../components/paciente/Education';
import patientApiService from '../services/patientApi';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Estados de navegación
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedNotification, setSelectedNotification] = useState(null);
  
  // Estados de datos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [nutritionHistory, setNutritionHistory] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [educationalMaterials, setEducationalMaterials] = useState([]);
  const [communityInfo, setCommunityInfo] = useState(null);

  // Verificar autenticación
  useEffect(() => {
    if (!user || user.role !== 'patient') {
      navigate('/', { replace: true });
      return;
    }
    
    loadAllData();
  }, [user, navigate]);

  /**
   * Cargar todos los datos del paciente
   */
  const loadAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Cargando datos del paciente...');

      // Cargar datos en paralelo
      const [
        profile,
        notifs,
        apts,
        medicalHistory,
        nutritionPlans,
        materials,
        community
      ] = await Promise.allSettled([
        patientApiService.getProfile(),
        patientApiService.getNotifications(),
        patientApiService.getAppointments(),
        patientApiService.getMedicalHistory(),
        patientApiService.getNutritionPlans(),
        patientApiService.getEducationalMaterials(),
        patientApiService.getCommunityInfo()
      ]);

      // Procesar perfil
      if (profile.status === 'fulfilled') {
        setPatientData(profile.value);
      }

      // Procesar notificaciones
      if (notifs.status === 'fulfilled') {
        setNotifications(notifs.value);
      }

      // Procesar citas
      if (apts.status === 'fulfilled') {
        setAppointments(apts.value);
      }

      // Procesar historial médico
      if (medicalHistory.status === 'fulfilled') {
        const history = medicalHistory.value.map(record => ({
          date: new Date(record.visit_date).toLocaleDateString('es-GT'),
          diagnosis: record.diagnosis,
          symptoms: record.symptoms,
          treatment: record.treatment,
          notes: record.notes,
          doctor: record.doctor_name || 'Doctor Asignado',
          estado: 'Registrado'
        }));
        setNutritionHistory(history);
      }

      // Procesar planes de nutrición como tratamientos
      if (nutritionPlans.status === 'fulfilled') {
        const activePlans = nutritionPlans.value
          .filter(plan => plan.status === 'active')
          .map(plan => {
            const startDate = new Date(plan.start_date);
            const endDate = new Date(plan.end_date);
            const now = new Date();
            const total = endDate - startDate;
            const elapsed = now - startDate;
            const progress = Math.min(Math.max((elapsed / total) * 100, 0), 100);

            return {
              name: plan.title,
              dosage: plan.description || 'Plan nutricional personalizado',
              status: 'Activo',
              progress: Math.round(progress),
              start: startDate.toLocaleDateString('es-GT'),
              end: endDate.toLocaleDateString('es-GT')
            };
          });
        setTreatments(activePlans);
      }

      // Procesar materiales educativos
      if (materials.status === 'fulfilled') {
        setEducationalMaterials(materials.value);
      }

      // Procesar comunidad
      if (community.status === 'fulfilled' && community.value) {
        setCommunityInfo(community.value);
      }

      console.log('✅ Datos cargados exitosamente');
    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      setError('Error al cargar los datos del paciente');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refrescar datos específicos
   */
  const refreshData = async (section) => {
    try {
      switch(section) {
        case 'notifications':
          const notifs = await patientApiService.getNotifications();
          setNotifications(notifs);
          break;
        case 'appointments':
          const apts = await patientApiService.getAppointments();
          setAppointments(apts);
          break;
        case 'history':
          const history = await patientApiService.getMedicalHistory();
          setNutritionHistory(history.map(record => ({
            date: new Date(record.visit_date).toLocaleDateString('es-GT'),
            diagnosis: record.diagnosis,
            symptoms: record.symptoms,
            treatment: record.treatment,
            notes: record.notes,
            doctor: record.doctor_name || 'Doctor Asignado',
            estado: 'Registrado'
          })));
          break;
        default:
          await loadAllData();
      }
    } catch (err) {
      console.error('Error refrescando datos:', err);
    }
  };

  // Mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando información del paciente...</p>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar datos</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={loadAllData}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Reintentar
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay datos del paciente
  if (!patientData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <p className="text-gray-600">No se pudo cargar la información del paciente</p>
          <button
            onClick={loadAllData}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header patientData={patientData} />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Sidebar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection}
            notifications={notifications}
          />
          
          <main className="flex-1">
            {activeSection === 'dashboard' && (
              <Dashboard 
                patientData={patientData}
                notifications={notifications}
                appointments={appointments}
                treatments={treatments}
                onRefresh={() => refreshData('dashboard')}
              />
            )}
            
            {activeSection === 'profile' && (
              <Profile 
                patientData={patientData}
                communityInfo={communityInfo}
                onUpdate={loadAllData}
              />
            )}
            
            {activeSection === 'history' && (
              <History 
                nutritionHistory={nutritionHistory}
                onRefresh={() => refreshData('history')}
              />
            )}
            
            {activeSection === 'appointments' && (
              <Appointments 
                appointments={appointments}
                onRefresh={() => refreshData('appointments')}
              />
            )}
            
            {activeSection === 'notifications' && (
              <Notifications 
                notifications={notifications}
                setSelectedNotification={setSelectedNotification}
                onRefresh={() => refreshData('notifications')}
              />
            )}
            
            {activeSection === 'location' && (
              <Location 
                patientData={patientData}
                communityInfo={communityInfo}
                onUpdate={loadAllData}
              />
            )}
            
            {activeSection === 'education' && (
              <Education 
                educationalMaterials={educationalMaterials}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;