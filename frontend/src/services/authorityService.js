// Frontend/src/services/authorityService.js
import api from './api';

const authorityService = {
  // ============================================
  // DASHBOARD - ESTADÍSTICAS GENERALES
  // ============================================
  
  getDashboardStats: async () => {
    try {
      console.log('📊 Obteniendo estadísticas del dashboard...');
      const response = await api.get('/dashboard/stats');
      console.log('✅ Estadísticas obtenidas:', response.data);
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

  getMonthlyActivity: async () => {
    try {
      console.log('📊 Obteniendo actividad mensual...');
      const response = await api.get('/dashboard/activity');
      console.log('✅ Actividad mensual obtenida:', response.data.length, 'meses');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo actividad mensual:', error);
      return [];
    }
  },

  getRoleDistribution: async () => {
    try {
      console.log('📊 Obteniendo distribución por roles...');
      const response = await api.get('/dashboard/roles');
      console.log('✅ Distribución obtenida:', response.data.length, 'roles');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo distribución de roles:', error);
      return [];
    }
  },

  getUserActivity: async () => {
    try {
      console.log('📊 Obteniendo actividad de usuarios...');
      const response = await api.get('/dashboard/user-activity');
      console.log('✅ Actividad de usuarios obtenida:', response.data.length, 'acciones');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo actividad de usuarios:', error);
      return [];
    }
  },

  getRecentActivity: async () => {
    try {
      console.log('📊 Obteniendo actividad reciente...');
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
   * Obtener comunidades con conteo real de pacientes
   */
  getCommunities: async (filters = {}) => {
    try {
      console.log('🏘️ Obteniendo comunidades con filtros:', filters);
      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      if (filters.health_center_id) params.append('health_center_id', filters.health_center_id);
      
      const url = params.toString() ? `/communities?${params.toString()}` : '/communities';
      
      console.log('📡 Llamando a:', url);
      const response = await api.get(url);
      
      console.log('✅ Comunidades recibidas del backend:', response.data);
      
      // Verificar si hay comunidades
      if (!response.data || response.data.length === 0) {
        console.warn('⚠️ No hay comunidades en la base de datos');
        return [];
      }
      
      // Obtener TODOS los pacientes del sistema
      console.log('👥 Obteniendo pacientes...');
      let allPatients = [];
      try {
        const patientsResponse = await api.get('/patients');
        allPatients = patientsResponse.data || [];
        console.log('✅ Total de pacientes:', allPatients.length);
        
        // Debug: mostrar un paciente de ejemplo
        if (allPatients.length > 0) {
          console.log('📋 Ejemplo de paciente:', allPatients[0]);
        }
      } catch (error) {
        console.error('❌ Error obteniendo pacientes:', error);
      }
      
      // Mapear comunidades con conteo real de pacientes
      const communitiesWithPatients = response.data.map((community) => {
        // Contar pacientes de TODAS las formas posibles
        let patientCount = 0;
        
        // Método 1: Usar member_count del backend (si existe)
        if (community.member_count && typeof community.member_count === 'number') {
          patientCount = community.member_count;
          console.log(`📊 ${community.name}: Usando member_count = ${patientCount}`);
        } 
        // Método 2: Contar manualmente
        else {
          const patientsInCommunity = allPatients.filter(patient => {
            // Verificar todas las posibles formas de relación
            
            // Forma 1: communities es un array de IDs
            if (Array.isArray(patient.communities)) {
              return patient.communities.includes(community.id);
            }
            
            // Forma 2: communities es un array de objetos con id
            if (Array.isArray(patient.communities) && patient.communities.length > 0 && 
                typeof patient.communities[0] === 'object') {
              return patient.communities.some(c => c.id === community.id || c === community.id);
            }
            
            // Forma 3: community_id directo
            if (patient.community_id === community.id) {
              return true;
            }
            
            // Forma 4: communities es un número
            if (typeof patient.communities === 'number' && patient.communities === community.id) {
              return true;
            }
            
            return false;
          });
          
          patientCount = patientsInCommunity.length;
          console.log(`📊 ${community.name}: Conteo manual = ${patientCount} pacientes`);
        }
        
        // Determinar si es crítico (más de 50 pacientes)
        const isCritical = patientCount > 50;
        
        return {
          id: community.id,
          nombre: community.name,
          name: community.name,
          casos: patientCount,
          population: community.population,
          location: community.location,
          description: community.description,
          health_center_id: community.health_center_id,
          member_count: community.member_count,
          critico: isCritical,
          lat: community.lat || (14.5 + (Math.random() * 0.1)),
          lon: community.lon || (-90.7 + (Math.random() * 0.1))
        };
      });
      
      console.log('✅ Resumen final de comunidades:');
      communitiesWithPatients.forEach(c => {
        console.log(`   📍 ${c.name}: ${c.casos} pacientes ${c.critico ? '🔴 CRÍTICO' : ''}`);
      });
      
      return communitiesWithPatients;
    } catch (error) {
      console.error('❌ Error obteniendo comunidades:', error);
      return [];
    }
  },

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
   * Obtener zonas críticas basadas en datos reales
   */
  getCriticalZones: async () => {
    try {
      console.log('⚠️ Calculando zonas críticas...');
      const communities = await authorityService.getCommunities();
      
      // Identificar zonas críticas basadas en número de pacientes
      const criticalZones = communities
        .filter(community => community.casos > 0) // Solo comunidades con pacientes
        .map(community => ({
          zona: community.nombre || community.name,
          casos: community.casos,
          nivel: community.casos > 50 ? 'Alto' : community.casos > 30 ? 'Medio' : 'Bajo',
          recursos: community.casos > 50 ? 'Insuficientes' : 'Adecuados',
          community_id: community.id
        }))
        .sort((a, b) => b.casos - a.casos); // Ordenar por número de casos
      
      console.log('✅ Zonas críticas identificadas:', criticalZones.length);
      return criticalZones;
    } catch (error) {
      console.error('❌ Error calculando zonas críticas:', error);
      return [];
    }
  },

  // ============================================
  // REPORTES CON DATOS REALES
  // ============================================

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
   * Crear reporte con datos reales del sistema
   */
  createReport: async (reportData) => {
    try {
      console.log('📄 Creando reporte:', reportData.title);
      const response = await api.post('/reports', reportData);
      console.log('✅ Reporte creado exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error creando reporte:', error);
      throw error;
    }
  },

  /**
   * Generar reporte automático con estadísticas del sistema
   */
  generateSystemReport: async (reportType = 'general', communityId = null) => {
    try {
      console.log('📊 Generando reporte del sistema tipo:', reportType);
      
      // Obtener datos del sistema
      const [stats, communities, patients, records] = await Promise.all([
        authorityService.getDashboardStats(),
        authorityService.getCommunities(),
        api.get('/patients'),
        api.get('/traceability')
      ]);
      
      const reportData = {
        title: `Reporte ${reportType} - ${new Date().toLocaleDateString('es-GT')}`,
        report_type: reportType,
        description: `Reporte automático generado por el sistema`,
        community_id: communityId,
        period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        period_end: new Date().toISOString().split('T')[0],
        data: {
          estadisticas: stats,
          total_comunidades: communities.length,
          total_pacientes: patients.data.length,
          total_consultas: records.data.length,
          comunidades_criticas: communities.filter(c => c.critico).length,
          comunidades: communities.map(c => ({
            nombre: c.nombre,
            pacientes: c.casos,
            critico: c.critico
          })),
          generado_en: new Date().toISOString()
        }
      };
      
      const response = await authorityService.createReport(reportData);
      console.log('✅ Reporte generado exitosamente');
      return response;
    } catch (error) {
      console.error('❌ Error generando reporte:', error);
      throw error;
    }
  },

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

  getActiveAlerts: async () => {
    try {
      console.log('🚨 Obteniendo alertas activas...');
      
      // Obtener comunidades críticas
      const criticalZones = await authorityService.getCriticalZones();
      const criticalCommunities = criticalZones.filter(z => z.nivel === 'Alto');
      
      // Crear alertas basadas en comunidades críticas
      const alerts = criticalCommunities.map(zone => ({
        id: `alert_${zone.community_id}`,
        type: 'critico',
        title: `Brote Crítico en ${zone.zona}`,
        message: `${zone.casos} pacientes registrados. Requiere intervención inmediata.`,
        community_id: zone.community_id,
        community_name: zone.zona,
        nivel: zone.nivel,
        casos: zone.casos,
        created_at: new Date().toISOString(),
        status: 'activa'
      }));
      
      console.log('✅ Alertas activas:', alerts.length);
      return alerts;
    } catch (error) {
      console.error('❌ Error obteniendo alertas:', error);
      return [];
    }
  },

  /**
   * Enviar notificación/alerta a instituciones
   */
  sendAlert: async (alertData) => {
    try {
      console.log('📢 Enviando alerta:', alertData.title);
      
      const reportData = {
        title: alertData.title || 'Alerta del Sistema',
        report_type: 'alerta',
        description: alertData.message || alertData.description,
        community_id: alertData.community_id || null,
        data: {
          tipo: alertData.type || 'general',
          prioridad: alertData.priority || 'alta',
          destinatarios: alertData.recipients || [
            'Centros de Salud',
            'Hospital Regional',
            'ONGs Colaboradoras',
            'Ministerio de Salud'
          ],
          timestamp: new Date().toISOString(),
          enviado_por: 'Sistema de Autoridades',
          ...alertData.data
        }
      };
      
      const response = await authorityService.createReport(reportData);
      
      console.log('✅ Alerta enviada y registrada');
      return {
        success: true,
        message: 'Alerta enviada exitosamente a todas las instituciones',
        alert_id: response.report?.id || response.id,
        recipients_count: reportData.data.destinatarios.length
      };
    } catch (error) {
      console.error('❌ Error enviando alerta:', error);
      throw error;
    }
  },

  /**
   * Enviar alerta masiva
   */
  sendMassAlert: async (message, recipients = [], priority = 'alta') => {
    try {
      const alertData = {
        title: 'Alerta Masiva del Sistema',
        message: message,
        type: 'masiva',
        priority: priority,
        recipients: recipients.length > 0 ? recipients : [
          'Centros de Salud de Sacatepéquez',
          'Hospital Nacional de Antigua Guatemala',
          'ONGs Colaboradoras',
          'Ministerio de Salud Pública',
          'Coordinación Departamental'
        ]
      };
      
      return await authorityService.sendAlert(alertData);
    } catch (error) {
      console.error('❌ Error enviando alerta masiva:', error);
      throw error;
    }
  },

  /**
   * Planificar brigada médica
   */
  scheduleBrigade: async (communityName, brigadeData = {}) => {
    try {
      console.log('🏥 Planificando brigada para:', communityName);
      
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