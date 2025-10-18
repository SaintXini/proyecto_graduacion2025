// Frontend/src/services/medicalApiService.js
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
  getPatients: async (filters = {}) => {
    try {
      console.log('🔵 Obteniendo pacientes...');
      
      const params = new URLSearchParams();
      if (filters.is_active !== undefined) {
        params.append('is_active', filters.is_active);
      }
      
      const url = params.toString() ? `/patients?${params.toString()}` : '/patients';
      console.log('🔵 URL de petición:', url);
      
      const response = await api.get(url);
      console.log('✅ Pacientes obtenidos:', response.data.length);
      
      // Log de pacientes con y sin comunidad
      const withCommunity = response.data.filter(p => p.communities && p.communities.length > 0);
      const withoutCommunity = response.data.filter(p => !p.communities || p.communities.length === 0);
      
      console.log(`   📊 Con comunidad: ${withCommunity.length}`);
      console.log(`   📊 Sin comunidad: ${withoutCommunity.length}`);
      
      if (withoutCommunity.length > 0) {
        console.warn('⚠️  Pacientes sin comunidad:');
        withoutCommunity.forEach(p => {
          console.warn(`   - ${p.first_name} ${p.last_name} (ID: ${p.id})`);
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo pacientes:', error);
      console.error('   Status:', error.response?.status);
      console.error('   Mensaje:', error.response?.data?.message);
      return [];
    }
  },

  /**
   * Obtener paciente por ID
   */
  getPatientById: async (patientId) => {
    try {
      console.log('🔵 Obteniendo paciente ID:', patientId);
      const response = await api.get(`/patients/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo paciente:', error);
      throw error;
    }
  },

  /**
   * Crear nuevo paciente
   */
  createPatient: async (patientData) => {
    try {
      console.log('🔵 Creando paciente:', patientData);
      
      // Validar datos críticos
      if (!patientData.community_id) {
        console.warn('⚠️  No se proporcionó community_id - El paciente NO aparecerá en visitas domiciliarias');
      }
      
      const data = {
        username: patientData.cui || patientData.username,
        email: patientData.email,
        password: patientData.password || 'paciente123',
        first_name: patientData.nombre || patientData.first_name,
        last_name: patientData.apellidos || patientData.last_name,
        phone: patientData.telefono || patientData.phone,
        community_id: patientData.community_id ? parseInt(patientData.community_id) : null
      };
      
      console.log('🔵 Datos enviados al backend:', data);
      
      const response = await api.post('/patients', data);
      
      console.log('✅ Paciente creado exitosamente');
      console.log('   ID:', response.data.user?.id || response.data.id);
      console.log('   Comunidades:', response.data.user?.communities || response.data.communities);
      
      return response.data.user || response.data;
    } catch (error) {
      console.error('❌ Error creando paciente:', error);
      console.error('   Status:', error.response?.status);
      console.error('   Mensaje:', error.response?.data?.message);
      throw error;
    }
  },

  /**
   * Actualizar paciente
   */
  updatePatient: async (patientId, patientData) => {
    try {
      console.log('🔵 Actualizando paciente:', patientId);
      const response = await api.put(`/patients/${patientId}`, patientData);
      return response.data.user || response.data;
    } catch (error) {
      console.error('❌ Error actualizando paciente:', error);
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
      console.log('🔵 Obteniendo registros médicos...');
      
      const params = new URLSearchParams();
      if (patientId) params.append('patient_id', patientId);
      if (doctorId) params.append('doctor_id', doctorId);
      
      const response = await api.get(`/traceability?${params.toString()}`);
      console.log('✅ Registros médicos obtenidos:', response.data.length);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo registros médicos:', error);
      return [];
    }
  },

  /**
   * Obtener registro médico por ID
   */
  getMedicalRecordById: async (recordId) => {
    try {
      console.log('🔵 Obteniendo registro médico ID:', recordId);
      const response = await api.get(`/traceability/${recordId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo registro médico:', error);
      throw error;
    }
  },

  /**
   * Crear registro médico
   */
  createMedicalRecord: async (recordData) => {
    try {
      console.log('🔵 Creando registro médico:', recordData);
      const response = await api.post('/traceability', recordData);
      console.log('✅ Registro médico creado');
      return response.data.record || response.data;
    } catch (error) {
      console.error('❌ Error creando registro médico:', error);
      throw error;
    }
  },

  /**
   * Añadir prescripción a registro médico
   */
  addPrescription: async (recordId, prescriptionData) => {
    try {
      console.log('🔵 Añadiendo prescripción al registro:', recordId);
      const response = await api.post(`/traceability/${recordId}/prescriptions`, prescriptionData);
      console.log('✅ Prescripción añadida');
      return response.data.prescription || response.data;
    } catch (error) {
      console.error('❌ Error añadiendo prescripción:', error);
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
      console.log('🔵 Obteniendo planes de nutrición...');
      
      const params = new URLSearchParams();
      if (patientId) params.append('patient_id', patientId);
      
      const response = await api.get(`/nutrition?${params.toString()}`);
      console.log('✅ Planes de nutrición obtenidos:', response.data.length);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo planes de nutrición:', error);
      return [];
    }
  },

  /**
   * Obtener plan de nutrición por ID
   */
  getNutritionPlanById: async (planId) => {
    try {
      console.log('🔵 Obteniendo plan de nutrición ID:', planId);
      const response = await api.get(`/nutrition/${planId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo plan de nutrición:', error);
      throw error;
    }
  },

  /**
   * Crear plan de nutrición
   */
  createNutritionPlan: async (planData) => {
    try {
      console.log('🔵 Creando plan de nutrición:', planData);
      const response = await api.post('/nutrition', planData);
      console.log('✅ Plan de nutrición creado');
      return response.data.plan || response.data;
    } catch (error) {
      console.error('❌ Error creando plan de nutrición:', error);
      throw error;
    }
  },

  /**
   * Añadir comida a plan de nutrición
   */
  addMealToPlan: async (planId, mealData) => {
    try {
      console.log('🔵 Añadiendo comida al plan:', planId);
      const response = await api.post(`/nutrition/${planId}/meals`, mealData);
      console.log('✅ Comida añadida');
      return response.data.meal || response.data;
    } catch (error) {
      console.error('❌ Error añadiendo comida:', error);
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
      console.log('🔵 Obteniendo estadísticas del dashboard...');
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
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
      console.log('🔵 Obteniendo actividad mensual...');
      const response = await api.get('/dashboard/activity');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo actividad mensual:', error);
      return [];
    }
  },

  /**
   * Obtener actividad reciente
   */
  getRecentActivity: async () => {
    try {
      console.log('🔵 Obteniendo actividad reciente...');
      const response = await api.get('/dashboard/recent-activity');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo actividad reciente:', error);
      return [];
    }
  },

  // ============================================
  // COMUNIDADES
  // ============================================
  
  /**
   * Obtener todas las comunidades
   */
  getCommunities: async (filters = {}) => {
    try {
      console.log('🔵 Obteniendo comunidades...');
      
      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      if (filters.health_center_id) params.append('health_center_id', filters.health_center_id);
      
      const response = await api.get(`/communities?${params.toString()}`);
      console.log('✅ Comunidades obtenidas:', response.data.length);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo comunidades:', error);
      return [];
    }
  },

  /**
   * Obtener comunidad por ID
   */
  getCommunityById: async (communityId) => {
    try {
      console.log('🔵 Obteniendo comunidad ID:', communityId);
      const response = await api.get(`/communities/${communityId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo comunidad:', error);
      throw error;
    }
  },
  // Frontend/src/services/medicalApiService.js - AGREGAR ESTAS FUNCIONES

// Agregar al final del archivo medicalApiService.js existente:

// ============================================
// CITAS MÉDICAS
// ============================================

/**
 * Obtener todas las citas médicas
 */
// ============================================
// CITAS MÉDICAS (APPOINTMENTS)
// ============================================

/**
 * Obtener todas las citas
 */
getAppointments: async (filters = {}) => {
  try {
    console.log('🗓️ Obteniendo citas médicas...');
    const params = new URLSearchParams();
    
    if (filters.patient_id) params.append('patient_id', filters.patient_id);
    if (filters.doctor_id) params.append('doctor_id', filters.doctor_id);
    if (filters.status) params.append('status', filters.status);
    if (filters.date) params.append('date', filters.date);
    
    const url = params.toString() ? `/appointments?${params.toString()}` : '/appointments';
    console.log('📡 URL de petición:', url);
    
    const response = await api.get(url);
    console.log('✅ Citas obtenidas:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo citas:', error);
    console.error('   Status:', error.response?.status);
    console.error('   Mensaje:', error.response?.data?.message);
    return [];
  }
},

/**
 * Obtener cita por ID
 */
getAppointmentById: async (appointmentId) => {
  try {
    console.log('🗓️ Obteniendo cita ID:', appointmentId);
    const response = await api.get(`/appointments/${appointmentId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo cita:', error);
    throw error;
  }
},

/**
 * Crear nueva cita
 */
createAppointment: async (appointmentData) => {
  try {
    console.log('📝 Creando cita:', appointmentData);
    const response = await api.post('/appointments', appointmentData);
    console.log('✅ Cita creada exitosamente');
    return response.data;
  } catch (error) {
    console.error('❌ Error creando cita:', error);
    console.error('   Status:', error.response?.status);
    console.error('   Mensaje:', error.response?.data?.message);
    throw error;
  }
},

/**
 * Actualizar cita existente
 */
updateAppointment: async (appointmentId, appointmentData) => {
  try {
    console.log('📝 Actualizando cita:', appointmentId);
    const response = await api.put(`/appointments/${appointmentId}`, appointmentData);
    console.log('✅ Cita actualizada');
    return response.data;
  } catch (error) {
    console.error('❌ Error actualizando cita:', error);
    throw error;
  }
},

/**
 * Cancelar cita
 */
cancelAppointment: async (appointmentId, cancelData = {}) => {
  try {
    console.log('🚫 Cancelando cita:', appointmentId);
    const response = await api.post(`/appointments/${appointmentId}/cancel`, cancelData);
    console.log('✅ Cita cancelada');
    return response.data;
  } catch (error) {
    console.error('❌ Error cancelando cita:', error);
    throw error;
  }
},

/**
 * Obtener disponibilidad del doctor
 */
getDoctorAvailability: async (doctorId, date) => {
  try {
    console.log('📅 Obteniendo disponibilidad del doctor:', doctorId, 'para fecha:', date);
    const response = await api.get(`/appointments/availability/${doctorId}?date=${date}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo disponibilidad:', error);
    return { available_slots: [] };
  }
},
  
};

export default medicalApiService;