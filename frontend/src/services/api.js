import axios from 'axios';

// URL base de la API - ajustar según entorno
const API_URL = import.meta.env.VITE_API_URL || 'https://proy-demo.onrender.com/api';

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
      console.log('✅ Token agregado a la petición');
    } else {
      console.warn('⚠️ No hay token disponible');
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
    console.error('❌ Error en API:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    
    if (error.response?.status === 401) {
      console.log('🔒 Error 401 - Token inválido o expirado');
      
      // Token expirado o inválido - limpiar sesión
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Solo redirigir si no estamos ya en la página de inicio
      if (window.location.pathname !== '/') {
        console.log('🔄 Redirigiendo a inicio...');
        window.location.href = '/';
      }
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
   * @param {string} email - Email o username
   * @param {string} password - Contraseña
   * @returns {Promise} Datos del usuario y token
   */
  login: async (email, password) => {
    try {
      console.log('🔑 Intentando login...', { email });
      
      const response = await api.post('/login', { 
        username: email,
        password 
      });
      
      console.log('📦 Respuesta completa del servidor:', response);
      console.log('📦 Datos:', response.data);
      
      // CRÍTICO: Verificar que vengan los datos necesarios
      if (!response.data) {
        throw new Error('No se recibieron datos del servidor');
      }
      
      // ✅ CAMBIO: access_token → token
      if (!response.data.token) {
        console.error('❌ No se recibió token en la respuesta:', response.data);
        throw new Error('No se recibió token de acceso');
      }
      
      if (!response.data.user) {
        console.error('❌ No se recibió información del usuario:', response.data);
        throw new Error('No se recibió información del usuario');
      }
      
      // Guardar token y usuario en localStorage
      // ✅ CAMBIO: access_token → token
      const token = response.data.token;
      const user = response.data.user;
      
      console.log('💾 Guardando token:', token.substring(0, 20) + '...');
      console.log('💾 Guardando usuario:', user);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Verificar que se guardaron correctamente
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      console.log('✅ Token guardado correctamente:', savedToken ? 'SÍ' : 'NO');
      console.log('✅ Usuario guardado correctamente:', savedUser ? 'SÍ' : 'NO');
      
      if (!savedToken || !savedUser) {
        throw new Error('Error al guardar en localStorage');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error en login:', error);
      if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
        throw error.response.data;
      }
      throw { message: error.message || 'Error al iniciar sesión' };
    }
  },

  /**
   * Registro de nuevo usuario
   * @param {object} userData - Datos del usuario
   * @returns {Promise} Usuario creado y token
   */
  register: async (userData) => {
    try {
      console.log('📝 Registrando usuario...', userData);
      const response = await api.post('/register', userData);
      
      // Guardar token y usuario en localStorage
      // ✅ CAMBIO: access_token → token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('✅ Token y usuario guardados después del registro');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error en registro:', error);
      throw error.response?.data || { message: 'Error al registrar usuario' };
    }
  },

  /**
   * Logout - Limpiar sesión
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('👋 Sesión cerrada');
  },

  /**
   * Obtener usuario actual desde localStorage
   * @returns {object|null} Usuario actual o null
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    console.log('👤 Usuario actual:', user);
    return user;
  },

  /**
   * Verificar si hay sesión activa
   * @returns {boolean} True si hay token
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const isAuth = !!token;
    console.log('🔐 ¿Autenticado?:', isAuth);
    return isAuth;
  },

  /**
   * Obtener datos del usuario desde el backend
   * @returns {Promise} Datos del usuario
   */
  getMe: async () => {
    try {
      const response = await api.get('/me');
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener usuario' };
    }
  }
};

// Resto de servicios (userService, communityService, etc.)
export const userService = {
  getAll: async () => {
    try {
      console.log('📋 Obteniendo usuarios...');
      const response = await api.get('/users');
      console.log('✅ Usuarios obtenidos:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo usuarios:', error);
      throw error;
    }
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
  }
};

export const communityService = {
  getAll: async () => {
    try {
      const response = await api.get('/communities');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo comunidades:', error);
      return [];
    }
  },
  
  getById: async (id) => {
    const response = await api.get(`/communities/${id}`);
    return response.data;
  },
  
  create: async (communityData) => {
    const response = await api.post('/communities', communityData);
    return response.data;
  }
};

export const nutritionService = {
  getAll: async () => {
    try {
      const response = await api.get('/nutrition');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo planes de nutrición:', error);
      return [];
    }
  },
  
  getByPatient: async (patientId) => {
    try {
      const response = await api.get(`/nutrition?patient_id=${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo planes de nutrición del paciente:', error);
      return [];
    }
  }
};

export const traceabilityService = {
  getAll: async () => {
    try {
      const response = await api.get('/traceability');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo registros de trazabilidad:', error);
      return [];
    }
  },
  
  getByUser: async (userId) => {
    try {
      const response = await api.get(`/traceability?patient_id=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo registros del usuario:', error);
      return [];
    }
  }
};

export default api;
