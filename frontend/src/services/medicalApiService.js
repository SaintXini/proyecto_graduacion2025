import api from './api';
/**
* Servicio completo para operaciones médicas
*/
const medicalApiService = {
// ============================================
// PACIENTES
// ============================================
/**
* Obtener todos los pacientes (solo usuarios con rol 'patient')
*/
/**
* Obtener todos los pacientes (solo usuarios con rol 'patient')
*/
getPatients: async (filters = {}) => {
try {
console.log(' Obteniendo pacientes...');
// CAMBIO: Usar el nuevo endpoint /api/patients en lugar de /api/users
const params = new URLSearchParams();
if (filters.is_active !== undefined) {
params.append('is_active', filters.is_active);
}
const url = params.toString() ? `/patients?${params.toString()}` : '/patients';
console.log(' URL de petición:', url);
const response = await api.get(url);
console.log(' Pacientes obtenidos:', response.data.length);
return response.data;
} catch (error) {
console.error(' Error obteniendo pacientes:', error);
console.error(' Status:', error.response?.status);
console.error(' Mensaje:', error.response?.data?.message);
return [];
}
},
/**
* Obtener paciente por ID
*/
getPatientById: async (patientId) => {
try {
console.log(' Obteniendo paciente ID:', patientId);
const response = await api.get(`/patients/${patientId}`);
return response.data;
} catch (error) {
console.error(' Error obteniendo paciente:', error);
throw error;
}
},
/**
* Crear nuevo paciente (médicos pueden crear)
*/
createPatient: async (patientData) => {
try {
console.log(' Creando paciente:', patientData);
const data = {
username: patientData.cui || patientData.username,
email: patientData.email,
password: patientData.password || 'paciente123',
first_name: patientData.nombre || patientData.first_name,
last_name: patientData.apellidos || patientData.last_name,
phone: patientData.telefono || patientData.phone,
community_id: patientData.community_id || null // ← AGREGAR
};
// Usar el endpoint /api/patients
const response = await api.post('/patients', data);
console.log(' Paciente creado exitosamente');
return response.data.user || response.data;
} catch (error) {
console.error(' Error creando paciente:', error);
console.error(' Status:', error.response?.status);
console.error(' Mensaje:', error.response?.data?.message);
throw error;
}
},
/**
* Actualizar paciente
*/
updatePatient: async (patientId, patientData) => {
try {
console.log(' Actualizando paciente:', patientId);
const response = await api.put(`/patients/${patientId}`, patientData);
return response.data.user || response.data;
} catch (error) {
console.error(' Error actualizando paciente:', error);
throw error;
}
},
// ============================================
// REGISTROS MÉDICOS
// ============================================
/**
* Obtener registros médicos
*/
getMedicalRecords: async (patientId = null, doctorId = null) => {
try {
console.log(' Obteniendo registros médicos...');
const params = new URLSearchParams();
if (patientId) params.append('patient_id', patientId);
if (doctorId) params.append('doctor_id', doctorId);
const response = await api.get(`/traceability?${params.toString()}`);
console.log(' Registros médicos obtenidos:', response.data.length);
return response.data;
} catch (error) {
console.error(' Error obteniendo registros médicos:', error);
return [];
}
},
/**
* Obtener registro médico por ID
*/
getMedicalRecordById: async (recordId) => {
try {
console.log(' Obteniendo registro médico ID:', recordId);
const response = await api.get(`/traceability/${recordId}`);
return response.data;
} catch (error) {
console.error(' Error obteniendo registro médico:', error);
throw error;
}
},
/**
* Crear registro médico
*/
createMedicalRecord: async (recordData) => {
try {
console.log(' Creando registro médico:', recordData);
const response = await api.post('/traceability', recordData);
console.log(' Registro médico creado');
return response.data.record || response.data;
} catch (error) {
console.error(' Error creando registro médico:', error);
throw error;
}
},
/**
* Añadir prescripción a registro médico
*/
addPrescription: async (recordId, prescriptionData) => {
try {
console.log(' Añadiendo prescripción al registro:', recordId);
const response = await api.post(`/traceability/${recordId}/prescriptions`, prescriptionData);
console.log(' Prescripción añadida');
return response.data.prescription || response.data;
} catch (error) {
console.error(' Error añadiendo prescripción:', error);
throw error;
}
},
// ============================================
// PLANES DE NUTRICIÓN
// ============================================
/**
* Obtener planes de nutrición
*/
getNutritionPlans: async (patientId = null) => {
try {
console.log(' Obteniendo planes de nutrición...');
const params = new URLSearchParams();
if (patientId) params.append('patient_id', patientId);
const response = await api.get(`/nutrition?${params.toString()}`);
console.log(' Planes de nutrición obtenidos:', response.data.length);
return response.data;
} catch (error) {
console.error(' Error obteniendo planes de nutrición:', error);
return [];
}
},
/**
* Obtener plan de nutrición por ID
*/
getNutritionPlanById: async (planId) => {
try {
console.log(' Obteniendo plan de nutrición ID:', planId);
const response = await api.get(`/nutrition/${planId}`);
return response.data;
} catch (error) {
console.error(' Error obteniendo plan de nutrición:', error);
throw error;
}
},
/**
* Crear plan de nutrición
*/
createNutritionPlan: async (planData) => {
try {
console.log(' Creando plan de nutrición:', planData);
const response = await api.post('/nutrition', planData);
console.log(' Plan de nutrición creado');
return response.data.plan || response.data;
} catch (error) {
console.error(' Error creando plan de nutrición:', error);
throw error;
}
},
/**
* Añadir comida a plan de nutrición
*/
addMealToPlan: async (planId, mealData) => {
try {
console.log(' Añadiendo comida al plan:', planId);
const response = await api.post(`/nutrition/${planId}/meals`, mealData);
console.log(' Comida añadida');
return response.data.meal || response.data;
} catch (error) {
console.error(' Error añadiendo comida:', error);
throw error;
}
},
// ============================================
// DASHBOARD Y ESTADÍSTICAS
// ============================================
/**
* Obtener estadísticas del dashboard
*/
getDashboardStats: async () => {
try {
console.log(' Obteniendo estadísticas del dashboard...');
const response = await api.get('/dashboard/stats');
return response.data;
} catch (error) {
console.error(' Error obteniendo estadísticas:', error);
return {
total_users: 0,
active_users: 0,
consultations_today: 0,
active_alerts: 0
};
}
},
/**
* Obtener actividad mensual
*/
getMonthlyActivity: async () => {
try {
console.log(' Obteniendo actividad mensual...');
const response = await api.get('/dashboard/activity');
return response.data;
} catch (error) {
console.error(' Error obteniendo actividad mensual:', error);
return [];
}
},
/**
* Obtener actividad reciente
*/
getRecentActivity: async () => {
try {
console.log(' Obteniendo actividad reciente...');
const response = await api.get('/dashboard/recent-activity');
return response.data;
} catch (error) {
console.error(' Error obteniendo actividad reciente:', error);
return [];
}
},
// ============================================
// COMUNIDADES (para ubicaciones)
// ============================================
/**
* Obtener todas las comunidades
*/
getCommunities: async (filters = {}) => {
try {
console.log(' Obteniendo comunidades...');
const params = new URLSearchParams();
if (filters.location) params.append('location', filters.location);
if (filters.health_center_id) params.append('health_center_id', filters.health_center_id);
const response = await api.get(`/communities?${params.toString()}`);
console.log(' Comunidades obtenidas:', response.data.length);
return response.data;
} catch (error) {
console.error(' Error obteniendo comunidades:', error);
return [];
}
},
/**
* Obtener comunidad por ID
*/
getCommunityById: async (communityId) => {
try {
console.log(' Obteniendo comunidad ID:', communityId);
const response = await api.get(`/communities/${communityId}`);
return response.data;
} catch (error) {
console.error(' Error obteniendo comunidad:', error);
throw error;
}
}
};
export default medicalApiService;