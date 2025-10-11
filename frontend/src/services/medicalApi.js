const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const medicalApi = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
        throw new Error('Sesión expirada');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Pacientes
  getPatients: () => medicalApi.request('/users?role=patient'),
  
  getPatientById: (id) => medicalApi.request(`/users/${id}`),
  
  // Registros médicos
  getMedicalRecords: (patientId, doctorId) => {
    let query = '/traceability?';
    if (patientId) query += `patient_id=${patientId}&`;
    if (doctorId) query += `doctor_id=${doctorId}&`;
    return medicalApi.request(query.slice(0, -1));
  },
  
  getMedicalRecordById: (id) => medicalApi.request(`/traceability/${id}`),
  
  createMedicalRecord: (data) => 
    medicalApi.request('/traceability', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  addPrescription: (recordId, data) =>
    medicalApi.request(`/traceability/${recordId}/prescriptions`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Planes de nutrición
  getNutritionPlans: (patientId) => 
    medicalApi.request(`/nutrition${patientId ? `?patient_id=${patientId}` : ''}`),
  
  getNutritionPlanById: (id) => medicalApi.request(`/nutrition/${id}`),
  
  createNutritionPlan: (data) => 
    medicalApi.request('/nutrition', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  addMealToPlan: (planId, data) =>
    medicalApi.request(`/nutrition/${planId}/meals`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Dashboard stats
  getDashboardStats: () => medicalApi.request('/dashboard/stats'),
  
  getRecentActivity: () => medicalApi.request('/dashboard/recent-activity')
};

export default medicalApi;