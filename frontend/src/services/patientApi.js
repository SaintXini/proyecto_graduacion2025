// Frontend/src/services/patientApi.js
import api from './api';

/**
 * Servicio API para funcionalidades del paciente
 */
const patientApiService = {
  // ============================================
  // PERFIL DEL PACIENTE
  // ============================================
  
  /**
   * Obtener perfil del paciente actual
   */
  getProfile: async () => {
    try {
      console.log('📋 Obteniendo perfil del paciente...');
      const response = await api.get('/me');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo perfil:', error);
      throw error;
    }
  },

  /**
   * Actualizar perfil del paciente
   */
  updateProfile: async (profileData) => {
    try {
      console.log('📝 Actualizando perfil...');
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await api.put(`/users/${user.id}`, profileData);
      
      // Actualizar localStorage con los nuevos datos
      const updatedUser = response.data.user || response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      throw error;
    }
  },

  // ============================================
  // HISTORIAL MÉDICO
  // ============================================
  
  /**
   * Obtener historial médico del paciente
   */
  getMedicalHistory: async () => {
    try {
      console.log('📚 Obteniendo historial médico...');
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await api.get(`/traceability?patient_id=${user.id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo historial:', error);
      return [];
    }
  },

  /**
   * Obtener detalles de un registro médico específico
   */
  getMedicalRecordDetails: async (recordId) => {
    try {
      console.log('🔍 Obteniendo detalles del registro:', recordId);
      const response = await api.get(`/traceability/${recordId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo detalles del registro:', error);
      throw error;
    }
  },

  // ============================================
  // CITAS MÉDICAS
  // ============================================
  
  /**
   * Obtener citas del paciente
   * Nota: Por ahora simula las citas usando los registros médicos
   */
  getAppointments: async () => {
    try {
      console.log('📅 Obteniendo citas...');
      const user = JSON.parse(localStorage.getItem('user'));
      
      // Obtener registros médicos del paciente
      const records = await api.get(`/traceability?patient_id=${user.id}`);
      
      // Transformar registros en formato de citas
      const appointments = records.data.map(record => ({
        id: record.id,
        type: record.diagnosis || 'Consulta General',
        doctor: record.doctor_name || 'Doctor Asignado',
        date: new Date(record.visit_date).toLocaleDateString('es-GT'),
        time: new Date(record.visit_date).toLocaleTimeString('es-GT', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        status: 'completada',
        notes: record.notes
      }));

      return appointments;
    } catch (error) {
      console.error('❌ Error obteniendo citas:', error);
      return [];
    }
  },

  // ============================================
  // PLANES DE NUTRICIÓN
  // ============================================
  
  /**
   * Obtener planes de nutrición del paciente
   */
  getNutritionPlans: async () => {
    try {
      console.log('🍎 Obteniendo planes de nutrición...');
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await api.get(`/nutrition?patient_id=${user.id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo planes de nutrición:', error);
      return [];
    }
  },

  /**
   * Obtener detalles de un plan de nutrición
   */
  getNutritionPlanDetails: async (planId) => {
    try {
      console.log('🔍 Obteniendo detalles del plan:', planId);
      const response = await api.get(`/nutrition/${planId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo detalles del plan:', error);
      throw error;
    }
  },

  // ============================================
  // COMUNIDAD Y UBICACIÓN
  // ============================================
  
  /**
   * Obtener información de la comunidad del paciente
   */
  getCommunityInfo: async () => {
    try {
      console.log('🏘️ Obteniendo información de comunidad...');
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (user.communities && user.communities.length > 0) {
        const communityId = user.communities[0];
        const response = await api.get(`/communities/${communityId}`);
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error obteniendo comunidad:', error);
      return null;
    }
  },

  /**
   * Obtener todas las comunidades disponibles
   */
  getAllCommunities: async () => {
    try {
      console.log('🗺️ Obteniendo todas las comunidades...');
      const response = await api.get('/communities');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo comunidades:', error);
      return [];
    }
  },

  // ============================================
  // NOTIFICACIONES
  // ============================================
  
  /**
   * Obtener notificaciones del paciente
   * Nota: Simula notificaciones basadas en registros y citas
   */
  getNotifications: async () => {
    try {
      console.log('🔔 Obteniendo notificaciones...');
      const user = JSON.parse(localStorage.getItem('user'));
      
      // Obtener registros médicos recientes
      const records = await api.get(`/traceability?patient_id=${user.id}`);
      
      // Crear notificaciones basadas en registros recientes
      const notifications = records.data
        .slice(0, 5)
        .map((record, index) => ({
          id: record.id,
          type: 'seguimiento',
          title: 'Seguimiento Médico',
          message: `Tienes un nuevo registro médico: ${record.diagnosis}`,
          date: new Date(record.created_at).toLocaleDateString('es-GT'),
          read: false,
          priority: 'medium'
        }));

      return notifications;
    } catch (error) {
      console.error('❌ Error obteniendo notificaciones:', error);
      return [];
    }
  },

  /**
   * Marcar notificación como leída
   */
  markNotificationAsRead: async (notificationId) => {
    try {
      console.log('✅ Marcando notificación como leída:', notificationId);
      // Por ahora solo simula la acción
      return { success: true };
    } catch (error) {
      console.error('❌ Error marcando notificación:', error);
      throw error;
    }
  },

  // ============================================
  // ESTADÍSTICAS Y DASHBOARD
  // ============================================
  
  /**
   * Obtener estadísticas del paciente para el dashboard
   */
  getDashboardStats: async () => {
    try {
      console.log('📊 Obteniendo estadísticas del dashboard...');
      const user = JSON.parse(localStorage.getItem('user'));
      
      // Obtener datos de diferentes endpoints
      const [records, nutritionPlans, notifications] = await Promise.all([
        api.get(`/traceability?patient_id=${user.id}`),
        api.get(`/nutrition?patient_id=${user.id}`),
        patientApiService.getNotifications()
      ]);

      return {
        totalConsultations: records.data.length,
        activeNutritionPlans: nutritionPlans.data.filter(p => p.status === 'active').length,
        unreadNotifications: notifications.filter(n => !n.read).length,
        lastVisit: records.data.length > 0 
          ? new Date(records.data[0].visit_date).toLocaleDateString('es-GT')
          : 'Sin visitas registradas'
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      return {
        totalConsultations: 0,
        activeNutritionPlans: 0,
        unreadNotifications: 0,
        lastVisit: 'Sin visitas registradas'
      };
    }
  },

  // ============================================
  // RECURSOS EDUCATIVOS
  // ============================================
  
  /**
   * Obtener materiales educativos
   * Ahora incluye enlaces a recursos educativos reales
   */
  getEducationalMaterials: async () => {
    try {
      console.log('📚 Obteniendo materiales educativos...');
      
      // Materiales educativos con enlaces externos reales
      return [
        {
          id: 1,
          title: 'Nutrición Infantil Básica',
          description: 'Aprende los fundamentos de una alimentación saludable para niños con videos explicativos y guías visuales',
          category: 'Nutrición',
          duration: '10 min',
          icon: '🍎',
          type: 'video',
          url: 'https://www.youtube.com/watch?v=3qYhE0K6_hE',
          source: 'Nutrición Fácil'
        },
        {
          id: 2,
          title: 'Prevención de Desnutrición Infantil',
          description: 'Señales de alerta temprana y cómo actuar - Información clara y práctica para padres',
          category: 'Salud',
          duration: '15 min',
          icon: '🏥',
          type: 'articulo',
          url: 'https://www.healthychildren.org/spanish/health-issues/conditions/emotional-problems/paginas/how-to-prevent-malnutrition.aspx',
          source: 'HealthyChildren'
        },
        {
          id: 3,
          title: 'Recetas Nutritivas y Económicas',
          description: 'Recetas fáciles, rápidas y económicas para toda la familia con ingredientes locales',
          category: 'Cocina',
          duration: '20 min',
          icon: '👨‍🍳',
          type: 'receta',
          url: 'https://www.fao.org/nutrition/educacion-nutricional/food-dietary-guidelines/regions/guatemala/es/',
          source: 'FAO Guatemala'
        },
        {
          id: 4,
          title: 'Higiene y Salud en Casa',
          description: 'Prácticas sencillas de higiene para prevenir enfermedades en los niños',
          category: 'Prevención',
          duration: '8 min',
          icon: '🧼',
          type: 'guia',
          url: 'https://www.unicef.org/es/higiene',
          source: 'UNICEF'
        },
        {
          id: 5,
          title: 'Lactancia Materna - Guía Completa',
          description: 'Todo lo que necesitas saber sobre lactancia materna explicado de forma simple',
          category: 'Salud',
          duration: '12 min',
          icon: '🍼',
          type: 'guia',
          url: 'https://www.who.int/es/health-topics/breastfeeding',
          source: 'OMS'
        },
        {
          id: 6,
          title: 'Crecimiento y Desarrollo del Niño',
          description: 'Etapas del crecimiento infantil explicadas mes a mes con ilustraciones',
          category: 'Salud',
          duration: '15 min',
          icon: '📈',
          type: 'articulo',
          url: 'https://www.cdc.gov/ncbddd/spanish/childdevelopment/positiveparenting/index.html',
          source: 'CDC'
        },
        {
          id: 7,
          title: 'Alimentación Complementaria',
          description: 'Cuándo y cómo introducir nuevos alimentos - Guía paso a paso',
          category: 'Nutrición',
          duration: '10 min',
          icon: '🥄',
          type: 'guia',
          url: 'https://www.healthychildren.org/spanish/ages-stages/baby/feeding-nutrition/paginas/switching-to-solid-foods.aspx',
          source: 'AAP'
        },
        {
          id: 8,
          title: 'Preparación Segura de Alimentos',
          description: 'Cómo preparar alimentos de forma segura para evitar enfermedades',
          category: 'Prevención',
          duration: '8 min',
          icon: '🍳',
          type: 'guia',
          url: 'https://www.who.int/es/news-room/fact-sheets/detail/food-safety',
          source: 'OMS'
        },
        {
          id: 9,
          title: 'Alimentación en Niños de 1-3 años',
          description: 'Qué alimentos dar, porciones recomendadas y horarios ideales',
          category: 'Nutrición',
          duration: '12 min',
          icon: '👶',
          type: 'articulo',
          url: 'https://www.healthychildren.org/spanish/ages-stages/toddler/nutrition/paginas/feeding-and-nutrition-your-one-year-old.aspx',
          source: 'AAP'
        },
        {
          id: 10,
          title: 'Vitaminas y Minerales Esenciales',
          description: 'Qué vitaminas necesitan los niños y en qué alimentos encontrarlas',
          category: 'Nutrición',
          duration: '10 min',
          icon: '💊',
          type: 'articulo',
          url: 'https://kidshealth.org/es/parents/vitamin.html',
          source: 'KidsHealth'
        },
        {
          id: 11,
          title: 'Hidratación Infantil',
          description: 'Cuánta agua necesitan los niños según su edad y actividad',
          category: 'Salud',
          duration: '6 min',
          icon: '💧',
          type: 'articulo',
          url: 'https://www.healthychildren.org/spanish/healthy-living/nutrition/paginas/water-juice.aspx',
          source: 'AAP'
        },
        {
          id: 12,
          title: 'Señales de Deshidratación',
          description: 'Cómo identificar y actuar ante la deshidratación infantil',
          category: 'Prevención',
          duration: '8 min',
          icon: '⚠️',
          type: 'guia',
          url: 'https://www.healthychildren.org/spanish/health-issues/conditions/abdominal/paginas/treating-dehydration-with-electrolyte-solution.aspx',
          source: 'AAP'
        },
        {
          id: 13,
          title: 'Alimentos para Fortalecer el Sistema Inmune',
          description: 'Alimentos que ayudan a fortalecer las defensas naturales de los niños',
          category: 'Nutrición',
          duration: '10 min',
          icon: '🛡️',
          type: 'articulo',
          url: 'https://kidshealth.org/es/parents/immune.html',
          source: 'KidsHealth'
        },
        {
          id: 14,
          title: 'Manejo de Alergias Alimentarias',
          description: 'Cómo identificar y manejar alergias alimentarias en niños',
          category: 'Salud',
          duration: '12 min',
          icon: '🚫',
          type: 'guia',
          url: 'https://www.healthychildren.org/spanish/healthy-living/nutrition/paginas/food-allergies-in-children.aspx',
          source: 'AAP'
        },
        {
          id: 15,
          title: 'Control de Peso Saludable',
          description: 'Cómo mantener un peso saludable en los niños sin dietas restrictivas',
          category: 'Salud',
          duration: '15 min',
          icon: '⚖️',
          type: 'articulo',
          url: 'https://www.cdc.gov/healthyweight/spanish/children/index.html',
          source: 'CDC'
        },
        {
          id: 16,
          title: 'Videos: Preparación de Papillas',
          description: 'Videos paso a paso de cómo preparar papillas nutritivas',
          category: 'Cocina',
          duration: '25 min',
          icon: '🎥',
          type: 'video',
          url: 'https://www.youtube.com/results?search_query=como+preparar+papillas+nutritivas+para+bebes',
          source: 'YouTube'
        },
        {
          id: 17,
          title: 'La Importancia del Hierro',
          description: 'Por qué el hierro es vital y qué alimentos lo contienen',
          category: 'Nutrición',
          duration: '8 min',
          icon: '🥩',
          type: 'articulo',
          url: 'https://kidshealth.org/es/parents/iron.html',
          source: 'KidsHealth'
        },
        {
          id: 18,
          title: 'Snacks Saludables para Niños',
          description: 'Ideas de refrigerios nutritivos y fáciles de preparar',
          category: 'Cocina',
          duration: '10 min',
          icon: '🍇',
          type: 'receta',
          url: 'https://www.healthychildren.org/spanish/healthy-living/nutrition/paginas/healthy-snacks-for-kids.aspx',
          source: 'AAP'
        },
        {
          id: 19,
          title: 'Hábitos Alimenticios Saludables',
          description: 'Cómo crear rutinas de alimentación saludable desde pequeños',
          category: 'Prevención',
          duration: '12 min',
          icon: '🕐',
          type: 'guia',
          url: 'https://www.healthychildren.org/spanish/healthy-living/nutrition/paginas/healthy-eating-habits-for-your-child.aspx',
          source: 'AAP'
        },
        {
          id: 20,
          title: 'Primeros Auxilios en Atragantamientos',
          description: 'Qué hacer si un niño se atraganta - Maniobra de Heimlich explicada',
          category: 'Prevención',
          duration: '10 min',
          icon: '🆘',
          type: 'guia',
          url: 'https://kidshealth.org/es/parents/choking.html',
          source: 'KidsHealth'
        }
      ];
    } catch (error) {
      console.error('❌ Error obteniendo materiales educativos:', error);
      return [];
    }
  }
};

export default patientApiService;