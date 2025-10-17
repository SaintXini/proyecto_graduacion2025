// Frontend/src/services/medicalApi.js
import api from './api';

/**
 * Servicio para operaciones médicas
 */
const medicalApi = {
  // ============================================
  // PACIENTES
  // ============================================
  
  /**
   * Obtener todos los pacientes
   */
  getPatients: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.role) params.append('role', 'patient');
      if (filters.is_active !== undefined) params.append('is_active', filters.is_active);
      
      const response = await api.get(`/users?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo pacientes:', error);
      throw error;
    }
  },

  /**
   * Obtener paciente por ID
   */
  getPatientById: async (patientId) => {
    try {
      const response = await api.get(`/users/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo paciente:', error);
      throw error;
    }
  },

  /**
   * Crear nuevo paciente
   */
  createPatient: async (patientData) => {
    try {
      const data = {
        username: patientData.cui || patientData.username,
        email: patientData.email,
        password: patientData.password || 'default123',
        role: 'patient',
        first_name: patientData.nombre || patientData.first_name,
        last_name: patientData.apellidos || patientData.last_name,
        phone: patientData.telefono || patientData.phone
      };
      
      const response = await api.post('/users', data);
      return response.data;
    } catch (error) {
      console.error('Error creando paciente:', error);
      throw error;
    }
  },

  /**
   * Actualizar paciente
   */
  updatePatient: async (patientId, patientData) => {
    try {
      const response = await api.put(`/users/${patientId}`, patientData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando paciente:', error);
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
      const params = new URLSearchParams();
      if (patientId) params.append('patient_id', patientId);
      if (doctorId) params.append('doctor_id', doctorId);
      
      const response = await api.get(`/traceability?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo registros médicos:', error);
      throw error;
    }
  },

  /**
   * Obtener registro médico por ID
   */
  getMedicalRecordById: async (recordId) => {
    try {
      const response = await api.get(`/traceability/${recordId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo registro médico:', error);
      throw error;
    }
  },

  /**
   * Crear registro médico
   */
  createMedicalRecord: async (recordData) => {
    try {
      const response = await api.post('/traceability', recordData);
      return response.data;
    } catch (error) {
      console.error('Error creando registro médico:', error);
      throw error;
    }
  },

  /**
   * Añadir prescripción a un registro médico
   */
  addPrescription: async (recordId, prescriptionData) => {
    try {
      const response = await api.post(`/traceability/${recordId}/prescriptions`, prescriptionData);
      return response.data;
    } catch (error) {
      console.error('Error añadiendo prescripción:', error);
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
      const params = new URLSearchParams();
      if (patientId) params.append('patient_id', patientId);
      
      const response = await api.get(`/nutrition?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo planes de nutrición:', error);
      throw error;
    }
  },

  /**
   * Obtener plan de nutrición por ID
   */
  getNutritionPlanById: async (planId) => {
    try {
      const response = await api.get(`/nutrition/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo plan de nutrición:', error);
      throw error;
    }
  },

  /**
   * Crear plan de nutrición
   */
  createNutritionPlan: async (planData) => {
    try {
      const response = await api.post('/nutrition', planData);
      return response.data;
    } catch (error) {
      console.error('Error creando plan de nutrición:', error);
      throw error;
    }
  },

  /**
   * Añadir comida a un plan de nutrición
   */
  addMealToPlan: async (planId, mealData) => {
    try {
      const response = await api.post(`/nutrition/${planId}/meals`, mealData);
      return response.data;
    } catch (error) {
      console.error('Error añadiendo comida:', error);
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
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
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
      const response = await api.get('/dashboard/activity');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo actividad mensual:', error);
      return [];
    }
  },

  /**
   * Obtener distribución de roles
   */
  getRoleDistribution: async () => {
    try {
      const response = await api.get('/dashboard/roles');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo distribución de roles:', error);
      return [];
    }
  },

  /**
   * Obtener actividad de usuarios
   */
  getUserActivity: async () => {
    try {
      const response = await api.get('/dashboard/user-activity');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo actividad de usuarios:', error);
      return [];
    }
  },

  /**
   * Obtener actividad reciente
   */
  getRecentActivity: async () => {
    try {
      const response = await api.get('/dashboard/recent-activity');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo actividad reciente:', error);
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
      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      if (filters.health_center_id) params.append('health_center_id', filters.health_center_id);
      
      const response = await api.get(`/communities?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo comunidades:', error);
      return [];
    }
  },

  /**
   * Obtener comunidad por ID
   */
  getCommunityById: async (communityId) => {
    try {
      const response = await api.get(`/communities/${communityId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo comunidad:', error);
      throw error;
    }
  }
};

export default medicalApi;