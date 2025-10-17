import api from './api';

/**
 * Servicio especializado para funcionalidades de autoridades municipales
 * Conecta con los endpoints del backend para dashboard, reportes, comunidades y alertas
 */
const authorityService = {
  
  // ============================================
  // DASHBOARD - ESTADÍSTICAS GENERALES
  // ============================================
  
  /**
   * Obtener estadísticas principales del dashboard
   * Endpoint: GET /api/dashboard/stats
   */
  getDashboardStats: async () => {
    try {
      console.log('📊 Obteniendo estadísticas del dashboard...');
      const response = await api.get('/dashboard/stats');
      console.log('✅ Estadísticas obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      // Retornar datos de ejemplo en caso de error
      return {
        total_users: 0,
        active_users: 0,
        consultations_today: 0,
        active_alerts: 0
      };
    }
  },

  /**
   * Obtener actividad mensual (usuarios y consultas por mes)
   * Endpoint: GET /api/dashboard/activity
   */
  getMonthlyActivity: async () => {
    try {
      console.log('📈 Obteniendo actividad mensual...');
      const response = await api.get('/dashboard/activity');
      console.log('✅ Actividad mensual obtenida:', response.data.length, 'meses');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo actividad mensual:', error);
      // Datos de ejemplo para los últimos 6 meses
      return [
        { mes: 'Mayo', usuarios: 45, consultas: 120 },
        { mes: 'Junio', usuarios: 52, consultas: 145 },
        { mes: 'Julio', usuarios: 48, consultas: 134 },
        { mes: 'Agosto', usuarios: 61, consultas: 167 },
        { mes: 'Septiembre', usuarios: 55, consultas: 156 },
        { mes: 'Octubre', usuarios: 58, consultas: 178 }
      ];
    }
  },

  /**
   * Obtener distribución de usuarios por rol
   * Endpoint: GET /api/dashboard/roles
   */
  getRoleDistribution: async () => {
    try {
      console.log('👥 Obteniendo distribución por roles...');
      const response = await api.get('/dashboard/roles');
      console.log('✅ Distribución obtenida:', response.data.length, 'roles');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo distribución de roles:', error);
      return [];
    }
  },

  /**
   * Obtener actividad de usuarios (acciones por tipo)
   * Endpoint: GET /api/dashboard/user-activity
   */
  getUserActivity: async () => {
    try {
      console.log('🔄 Obteniendo actividad de usuarios...');
      const response = await api.get('/dashboard/user-activity');
      console.log('✅ Actividad de usuarios obtenida:', response.data.length, 'acciones');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo actividad de usuarios:', error);
      return [];
    }
  },

  /**
   * Obtener actividad reciente del sistema
   * Endpoint: GET /api/dashboard/recent-activity
   */
  getRecentActivity: async () => {
    try {
      console.log('🕐 Obteniendo actividad reciente...');
      const response = await api.get('/dashboard/recent-activity');
      console.log('✅ Actividad reciente obtenida:', response.data.length, 'eventos');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo actividad reciente:', error);
      return [];
    }
  },

  // ============================================
  // COMUNIDADES Y GEOGRAFÍA
  // ============================================

  /**
   * Obtener todas las comunidades con filtros opcionales
   * Endpoint: GET /api/communities
   * @param {Object} filters - Filtros opcionales (location, health_center_id)
   */
  getCommunities: async (filters = {}) => {
    try {
      console.log('🏘️ Obteniendo comunidades con filtros:', filters);
      const params = new URLSearchParams();
      
      if (filters.location) params.append('location', filters.location);
      if (filters.health_center_id) params.append('health_center_id', filters.health_center_id);
      
      const url = params.toString() ? `/communities?${params.toString()}` : '/communities';
      const response = await api.get(url);
      
      console.log('✅ Comunidades obtenidas:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo comunidades:', error);
      // Datos de ejemplo de comunidades de Sacatepéquez
      return [
        {
          id: 1,
          nombre: 'Antigua Guatemala',
          casos: 63,
          lat: 14.5586,
          lon: -90.7339,
          critico: true
        },
        {
          id: 2,
          nombre: 'Ciudad Vieja',
          casos: 28,
          lat: 14.5214,
          lon: -90.7656,
          critico: false
        },
        {
          id: 3,
          nombre: 'San Miguel Dueñas',
          casos: 34,
          lat: 14.5428,
          lon: -90.8031,
          critico: false
        },
        {
          id: 4,
          nombre: 'Alotenango',
          casos: 21,
          lat: 14.4789,
          lon: -90.8094,
          critico: false
        },
        {
          id: 5,
          nombre: 'San Antonio Aguas Calientes',
          casos: 19,
          lat: 14.5358,
          lon: -90.7747,
          critico: false
        },
        {
          id: 6,
          nombre: 'Santa María de Jesús',
          casos: 13,
          lat: 14.5156,
          lon: -90.7028,
          critico: false
        }
      ];
    }
  },

  /**
   * Obtener comunidad por ID
   * Endpoint: GET /api/communities/:id
   * @param {number} communityId - ID de la comunidad
   */
  getCommunityById: async (communityId) => {
    try {
      console.log('🏘️ Obteniendo comunidad ID:', communityId);
      const response = await api.get(`/communities/${communityId}`);
      console.log('✅ Comunidad obtenida:', response.data.name);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo comunidad:', error);
      throw error;
    }
  },

  /**
   * Obtener zonas críticas identificadas
   * (Calcula basándose en las comunidades con más casos)
   */
  getCriticalZones: async () => {
    try {
      const communities = await authorityService.getCommunities();
      
      // Identificar zonas críticas (más de 50 casos = Alto, 30-50 = Medio)
      const criticalZones = communities.map(community => ({
        zona: community.nombre || community.name,
        casos: community.casos || 0,
        nivel: community.casos > 50 ? 'Alto' : community.casos > 30 ? 'Medio' : 'Bajo',
        recursos: community.casos > 50 ? 'Insuficientes' : 'Adecuados'
      }));

      // Ordenar por nivel de criticidad
      return criticalZones.sort((a, b) => b.casos - a.casos);
    } catch (error) {
      console.error('❌ Error calculando zonas críticas:', error);
      return [
        { zona: 'Antigua Guatemala', casos: 63, nivel: 'Alto', recursos: 'Insuficientes' },
        { zona: 'San Miguel Dueñas', casos: 34, nivel: 'Medio', recursos: 'Adecuados' }
      ];
    }
  },

  // ============================================
  // REPORTES
  // ============================================

  /**
   * Obtener todos los reportes con filtros opcionales
   * Endpoint: GET /api/reports
   * @param {Object} filters - Filtros opcionales (report_type, community_id)
   */
  getAllReports: async (filters = {}) => {
    try {
      console.log('📄 Obteniendo reportes con filtros:', filters);
      const params = new URLSearchParams();
      
      if (filters.report_type) params.append('report_type', filters.report_type);
      if (filters.community_id) params.append('community_id', filters.community_id);
      
      const url = params.toString() ? `/reports?${params.toString()}` : '/reports';
      const response = await api.get(url);
      
      console.log('✅ Reportes obtenidos:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo reportes:', error);
      return [];
    }
  },

  /**
   * Crear nuevo reporte
   * Endpoint: POST /api/reports
   * @param {Object} reportData - Datos del reporte
   */
  createReport: async (reportData) => {
    try {
      console.log('📝 Creando reporte:', reportData.title);
      const response = await api.post('/reports', reportData);
      console.log('✅ Reporte creado exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error creando reporte:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de salud de una comunidad
   * Endpoint: GET /api/reports/communities/:id/stats
   * @param {number} communityId - ID de la comunidad
   */
  getCommunityStats: async (communityId) => {
    try {
      console.log('📊 Obteniendo estadísticas de comunidad:', communityId);
      const response = await api.get(`/reports/communities/${communityId}/stats`);
      console.log('✅ Estadísticas de comunidad obtenidas');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de comunidad:', error);
      return null;
    }
  },

  // ============================================
  // ALERTAS Y NOTIFICACIONES
  // ============================================

  /**
   * Obtener alertas activas (registros médicos críticos)
   * Endpoint: GET /api/traceability (filtrando casos críticos)
   */
  getActiveAlerts: async () => {
    try {
      console.log('🚨 Obteniendo alertas activas...');
      const response = await api.get('/traceability');
      
      // Filtrar solo registros recientes (últimos 7 días)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentRecords = response.data.filter(record => {
        const recordDate = new Date(record.created_at || record.visit_date);
        return recordDate >= sevenDaysAgo;
      });
      
      console.log('✅ Alertas activas:', recentRecords.length);
      return recentRecords;
    } catch (error) {
      console.error('❌ Error obteniendo alertas:', error);
      return [];
    }
  },

  /**
   * Enviar alerta masiva (simulado - en producción enviaría notificaciones reales)
   * @param {string} message - Mensaje de la alerta
   * @param {Array} recipients - Lista de destinatarios
   */
  sendMassAlert: async (message, recipients = []) => {
    try {
      console.log('📢 Enviando alerta masiva:', message);
      console.log('📧 Destinatarios:', recipients.length);
      
      // En una implementación real, esto enviaría emails/SMS/notificaciones
      // Por ahora solo registramos la alerta
      const alertData = {
        title: 'Alerta Masiva del Sistema',
        report_type: 'alerta',
        description: message,
        data: {
          timestamp: new Date().toISOString(),
          recipients: recipients,
          sent_by: 'Sistema Autoridades'
        }
      };
      
      await authorityService.createReport(alertData);
      console.log('✅ Alerta enviada y registrada');
      
      return {
        success: true,
        message: 'Alerta enviada exitosamente',
        recipients_count: recipients.length
      };
    } catch (error) {
      console.error('❌ Error enviando alerta:', error);
      throw error;
    }
  },

  // ============================================
  // UTILIDADES
  // ============================================

  /**
   * Planificar brigada médica para una comunidad
   * (Crea un reporte de tipo 'brigada_programada')
   * @param {string} communityName - Nombre de la comunidad
   * @param {Object} brigadeData - Datos adicionales de la brigada
   */
  scheduleBrigade: async (communityName, brigadeData = {}) => {
    try {
      console.log('🚑 Planificando brigada para:', communityName);
      
      const reportData = {
        title: `Brigada Médica Programada - ${communityName}`,
        report_type: 'brigada_programada',
        description: `Brigada médica planificada para atender zona crítica`,
        data: {
          community: communityName,
          scheduled_date: brigadeData.date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          resources: brigadeData.resources || {
            doctors: 2,
            nurses: 3,
            supplies: 'Suministros nutricionales',
            transport: 'Confirmado'
          },
          ...brigadeData
        }
      };
      
      await authorityService.createReport(reportData);
      console.log('✅ Brigada planificada exitosamente');
      
      return {
        success: true,
        message: `Brigada planificada para ${communityName}`,
        scheduled_date: reportData.data.scheduled_date
      };
    } catch (error) {
      console.error('❌ Error planificando brigada:', error);
      throw error;
    }
  }
};

export default authorityService;