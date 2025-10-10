import axios from 'axios';

// URL base de la API - cambiar en producción
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token JWT a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido - limpiar sesión
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ============================================
// SERVICIOS DE AUTENTICACIÓN
// ============================================

export const authService = {
  /**
   * Login de usuario
   * @param {string} username - Nombre de usuario o email
   * @param {string} password - Contraseña
   * @returns {Promise} Datos del usuario y token
   */
  login: async (username, password) => {
    try {
      const response = await api.post('/login', { username, password });
      
      // Guardar token y usuario en localStorage
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al iniciar sesión' };
    }
  },

  /**
   * Registro de nuevo usuario
   * @param {object} userData - Datos del usuario
   * @returns {Promise} Datos del usuario y token
   */
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      
      // Guardar token y usuario en localStorage
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al registrar usuario' };
    }
  },

  /**
   * Cerrar sesión
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  /**
   * Obtener usuario actual
   * @returns {Promise} Datos del usuario actual
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/me');
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener usuario' };
    }
  },

  /**
   * Verificar si hay una sesión activa
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Obtener usuario guardado en localStorage
   * @returns {object|null}
   */
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// ============================================
// SERVICIOS DE USUARIOS
// ============================================

export const userService = {
  getAll: async (filters = {}) => {
    const response = await api.get('/users', { params: filters });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// ============================================
// SERVICIOS DE COMUNIDADES
// ============================================

export const communityService = {
  getAll: async (filters = {}) => {
    const response = await api.get('/communities', { params: filters });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/communities/${id}`);
    return response.data;
  },

  create: async (communityData) => {
    const response = await api.post('/communities', communityData);
    return response.data;
  },

  update: async (id, communityData) => {
    const response = await api.put(`/communities/${id}`, communityData);
    return response.data;
  },

  addMember: async (communityId, userId) => {
    const response = await api.post(`/communities/${communityId}/members`, { user_id: userId });
    return response.data;
  },
};

// ============================================
// SERVICIOS DE NUTRICIÓN
// ============================================

export const nutritionService = {
  getPlans: async (patientId = null) => {
    const params = patientId ? { patient_id: patientId } : {};
    const response = await api.get('/nutrition', { params });
    return response.data;
  },

  getPlanById: async (id) => {
    const response = await api.get(`/nutrition/${id}`);
    return response.data;
  },

  createPlan: async (planData) => {
    const response = await api.post('/nutrition', planData);
    return response.data;
  },

  addMeal: async (planId, mealData) => {
    const response = await api.post(`/nutrition/${planId}/meals`, mealData);
    return response.data;
  },
};

// ============================================
// SERVICIOS DE TRAZABILIDAD
// ============================================

export const traceabilityService = {
  getRecords: async (filters = {}) => {
    const response = await api.get('/traceability', { params: filters });
    return response.data;
  },

  getRecordById: async (id) => {
    const response = await api.get(`/traceability/${id}`);
    return response.data;
  },

  createRecord: async (recordData) => {
    const response = await api.post('/traceability', recordData);
    return response.data;
  },

  addPrescription: async (recordId, prescriptionData) => {
    const response = await api.post(`/traceability/${recordId}/prescriptions`, prescriptionData);
    return response.data;
  },
};

// ============================================
// SERVICIOS DE REPORTES
// ============================================

export const reportService = {
  getAll: async (filters = {}) => {
    const response = await api.get('/reports', { params: filters });
    return response.data;
  },

  create: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },

  getCommunityStats: async (communityId) => {
    const response = await api.get(`/reports/communities/${communityId}/stats`);
    return response.data;
  },
};

export default api;
