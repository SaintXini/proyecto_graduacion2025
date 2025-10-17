import { createContext, useState, useEffect } from 'react';
import medicalApiService from '../../../services/medicalApiService';
export const AppContext = createContext();
export const AppProvider = ({ children }) => {
const [currentView, setCurrentView] = useState('dashboard');
const [patients, setPatients] = useState([]);
const [visits, setVisits] = useState([]);
const [alerts, setAlerts] = useState([]);
const [medicalRecords, setMedicalRecords] = useState([]);
const [nutritionPlans, setNutritionPlans] = useState([]);
const [communities, setCommunities] = useState([]);
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
console.log(' Cargando datos iniciales del sistema médico...');
// Obtener usuario actual
const user = JSON.parse(localStorage.getItem('user') || '{}');
setCurrentUser(user);
console.log(' Usuario actual:', user);
// Cargar datos en paralelo
const [
patientsData,
recordsData,
plansData,
statsData,
communitiesData
] = await Promise.all([
medicalApiService.getPatients().catch(err => {
console.error('Error cargando pacientes:', err);
return [];
}),
medicalApiService.getMedicalRecords(null, user.id).catch(err => {
console.error('Error cargando registros:', err);
return [];
}),
medicalApiService.getNutritionPlans().catch(err => {
console.error('Error cargando planes:', err);
return [];
}),
medicalApiService.getDashboardStats().catch(err => {
console.error('Error cargando stats:', err);
return {};
}),
medicalApiService.getCommunities().catch(err => {
console.error('Error cargando comunidades:', err);
return [];
})
]);
console.log(' Datos cargados:', {
pacientes: patientsData.length,
registros: recordsData.length,
planes: plansData.length,
comunidades: communitiesData.length
});
setPatients(patientsData);
setMedicalRecords(recordsData);
setNutritionPlans(plansData);
setStats(statsData);
setCommunities(communitiesData);
// Calcular alertas basadas en registros
const highRiskPatients = recordsData.filter(r =>
r.diagnosis?.toLowerCase().includes('crítico') ||
r.diagnosis?.toLowerCase().includes('urgente') ||
r.diagnosis?.toLowerCase().includes('alto riesgo') ||
r.diagnosis?.toLowerCase().includes('desnutrición severa') ||
r.diagnosis?.toLowerCase().includes('desnutrición aguda')
);
setAlerts(highRiskPatients.map(r => ({
id: r.id,
patient_id: r.patient_id,
message: r.diagnosis,
type: 'urgent',
date: r.visit_date
})));
console.log(' Datos cargados exitosamente');
} catch (err) {
setError(err.message);
console.error(' Error loading data:', err);
} finally {
setLoading(false);
}
};
const refreshData = () => {
console.log(' Recargando datos...');
loadInitialData();
};
// Función para crear paciente
const createPatient = async(patientData) => {
try {
console.log(' Creando paciente...', patientData);
const newPatient = await medicalApiService.createPatient(patientData);
// IMPORTANTE: Agregar el nuevo paciente a la lista inmediatamente
setPatients(prevPatients => [...prevPatients, newPatient]);
console.log(' Paciente creado y agregado a la lista:', newPatient);
// Opcional: Recargar todos los datos para asegurar sincronización
setTimeout(() => {
refreshData();
}, 500);
return newPatient;
} catch (error) {
console.error(' Error creando paciente:', error);
throw error;
}
};
// Función para crear registro médico
const createMedicalRecord = async (recordData) => {
try {
console.log(' Creando registro médico...', recordData);
const newRecord = await medicalApiService.createMedicalRecord(recordData);
// Agregar el nuevo registro a la lista
setMedicalRecords(prevRecords => [...prevRecords, newRecord]);
console.log(' Registro médico creado y agregado a la lista');
// Recargar datos después de un momento
setTimeout(() => {
refreshData();
}, 500);
return newRecord;
} catch (error) {
console.error(' Error creando registro médico:', error);
throw error;
}
};
// Función para crear plan de nutrición
const createNutritionPlan = async (planData) => {
try {
console.log(' Creando plan de nutrición...', planData);
const newPlan = await medicalApiService.createNutritionPlan(planData);
// Agregar el nuevo plan a la lista
setNutritionPlans(prevPlans => [...prevPlans, newPlan]);
console.log(' Plan de nutrición creado y agregado a la lista');
// Recargar datos después de un momento
setTimeout(() => {
refreshData();
}, 500);
return newPlan;
} catch (error) {
console.error(' Error creando plan de nutrición:', error);
throw error;
}
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
communities,
setCommunities,
stats,
currentUser,
loading,
error,
refreshData,
createPatient,
createMedicalRecord,
createNutritionPlan
};
return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};