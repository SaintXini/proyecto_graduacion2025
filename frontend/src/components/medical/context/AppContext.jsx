import { createContext, useState, useEffect } from 'react';
import medicalApi from '../../../services/medicalApi';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [patients, setPatients] = useState([]);
  const [visits, setVisits] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    consultations_today: 0,
    active_alerts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener usuario actual
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setCurrentUser(user);

      // Cargar datos en paralelo
      const [patientsData, recordsData, plansData, statsData] = await Promise.all([
        medicalApi.getPatients().catch(() => []),
        medicalApi.getMedicalRecords(null, user.id).catch(() => []),
        medicalApi.getNutritionPlans().catch(() => []),
        medicalApi.getDashboardStats().catch(() => ({}))
      ]);

      setPatients(patientsData);
      setMedicalRecords(recordsData);
      setNutritionPlans(plansData);
      setStats(statsData);
      
      // Calcular alertas basadas en registros
      const highRiskPatients = recordsData.filter(r => 
        r.diagnosis?.toLowerCase().includes('crítico') || 
        r.diagnosis?.toLowerCase().includes('urgente')
      );
      setAlerts(highRiskPatients.map(r => ({
        id: r.id,
        patient_id: r.patient_id,
        message: r.diagnosis,
        type: 'urgent'
      })));

    } catch (err) {
      setError(err.message);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadInitialData();
  };

  const value = {
    currentView,
    setCurrentView,
    patients,
    setPatients,
    visits,
    setVisits,
    alerts,
    setAlerts,
    medicalRecords,
    setMedicalRecords,
    nutritionPlans,
    setNutritionPlans,
    stats,
    currentUser,
    loading,
    error,
    refreshData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};