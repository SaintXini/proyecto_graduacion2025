const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


// Helper para hacer peticiones con autenticación
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
    throw new Error('Sesión expirada');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en la petición');
  }

  return response.json();
};

// ============= USUARIOS =============
export const adminService = {
  // Obtener todos los usuarios
  getUsers: async () => {
    return fetchWithAuth(`${API_URL}/users`);
  },

  // Crear nuevo usuario
  createUser: async (userData) => {
    return fetchWithAuth(`${API_URL}/users`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Actualizar usuario
  updateUser: async (userId, userData) => {
    return fetchWithAuth(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Eliminar usuario
  deleteUser: async (userId) => {
    return fetchWithAuth(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // Cambiar estado de usuario (activo/inactivo)
  toggleUserStatus: async (userId, active) => {
    return fetchWithAuth(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ active }),
    });
  },

  // ============= COMUNIDADES =============
  // Obtener todas las comunidades
  getCommunities: async () => {
    return fetchWithAuth(`${API_URL}/communities`);
  },

  // Crear nueva comunidad
  createCommunity: async (communityData) => {
    return fetchWithAuth(`${API_URL}/communities`, {
      method: 'POST',
      body: JSON.stringify(communityData),
    });
  },

  // Actualizar comunidad
  updateCommunity: async (communityId, communityData) => {
    return fetchWithAuth(`${API_URL}/communities/${communityId}`, {
      method: 'PUT',
      body: JSON.stringify(communityData),
    });
  },

  // Eliminar comunidad
  deleteCommunity: async (communityId) => {
    return fetchWithAuth(`${API_URL}/communities/${communityId}`, {
      method: 'DELETE',
    });
  },

  // ============= NUTRICIÓN =============
  // Obtener catálogo de nutrición
  getNutritionCatalog: async () => {
    return fetchWithAuth(`${API_URL}/nutrition/catalog`);
  },

  // Crear item de nutrición
  createNutritionItem: async (itemData) => {
    return fetchWithAuth(`${API_URL}/nutrition/catalog`, {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  // Actualizar item de nutrición
  updateNutritionItem: async (itemId, itemData) => {
    return fetchWithAuth(`${API_URL}/nutrition/catalog/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  },

  // Eliminar item de nutrición
  deleteNutritionItem: async (itemId) => {
    return fetchWithAuth(`${API_URL}/nutrition/catalog/${itemId}`, {
      method: 'DELETE',
    });
  },

  // ============= TRAZABILIDAD =============
  // Obtener registros de trazabilidad
  getTraceability: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return fetchWithAuth(`${API_URL}/traceability?${queryParams}`);
  },

  // Obtener detalles de una consulta específica
  getConsultationDetails: async (consultationId) => {
    return fetchWithAuth(`${API_URL}/traceability/${consultationId}`);
  },

  // ============= ESTADÍSTICAS Y DASHBOARD =============
  // Obtener estadísticas generales del dashboard
  getDashboardStats: async () => {
    return fetchWithAuth(`${API_URL}/dashboard/stats`);
  },

  // Obtener actividad mensual
  getMonthlyActivity: async () => {
    return fetchWithAuth(`${API_URL}/dashboard/activity`);
  },

  // Obtener distribución de roles
  getRoleDistribution: async () => {
    return fetchWithAuth(`${API_URL}/dashboard/roles`);
  },

  // Obtener actividad de usuarios por tipo
  getUserActivity: async () => {
    return fetchWithAuth(`${API_URL}/dashboard/user-activity`);
  },

  // Obtener consultas mensuales por médico
  getMonthlyConsultations: async () => {
    return fetchWithAuth(`${API_URL}/traceability/monthly-consultations`);
  },

  // ============= REPORTES Y DESCARGAS =============
  // Descargar reporte de usuario
  downloadUserReport: async (userId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reports/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Error al descargar reporte');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usuario_${userId}_reporte.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Descargar reporte de consulta
  downloadConsultationReport: async (consultationId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reports/consultation/${consultationId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Error al descargar reporte');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consulta_${consultationId}_reporte.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Descargar gráfica como imagen
  downloadChart: async (chartType) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reports/chart/${chartType}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Error al descargar gráfica');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grafica_${chartType}.png`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};

export default adminService;