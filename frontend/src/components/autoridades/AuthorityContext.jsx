import React, { createContext, useContext, useState, useEffect } from 'react';
import { authorityService } from '../../services/authorityService';

const AuthorityContext = createContext(null);

export const AuthorityProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para datos del dashboard
  const [dashboardStats, setDashboardStats] = useState({
    total_users: 0,
    active_users: 0,
    consultations_today: 0,
    active_alerts: 0
  });

  const [monthlyActivity, setMonthlyActivity] = useState([]);
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // Estados para comunidades
  const [communities, setCommunities] = useState([]);
  const [zonasCriticas, setZonasCriticas] = useState([]);

  // Estados para reportes y alertas
  const [reports, setReports] = useState([]);
  const [alertasActivas, setAlertasActivas] = useState(0);

  /**
   * Cargar todos los datos del dashboard
   */
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Cargando datos del dashboard de autoridades...');

      // Cargar todos los datos en paralelo
      const [
        stats,
        activity,
        roles,
        userAct,
        recentAct,
        comms,
        zonas
      ] = await Promise.all([
        authorityService.getDashboardStats(),
        authorityService.getMonthlyActivity(),
        authorityService.getRoleDistribution(),
        authorityService.getUserActivity(),
        authorityService.getRecentActivity(),
        authorityService.getCommunities(),
        authorityService.getZonasCriticas()
      ]);

      setDashboardStats(stats);
      setMonthlyActivity(activity);
      setRoleDistribution(roles);
      setUserActivity(userAct);
      setRecentActivity(recentAct);
      setCommunities(comms);
      setZonasCriticas(zonas);

      console.log('✅ Datos del dashboard cargados exitosamente');
    } catch (err) {
      console.error('❌ Error cargando datos del dashboard:', err);
      setError('Error al cargar los datos del sistema');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cargar reportes
   */
  const loadReports = async (filters = {}) => {
    try {
      console.log('📄 Cargando reportes...', filters);
      const data = await authorityService.getAllReports(filters);
      setReports(data);
      return data;
    } catch (err) {
      console.error('❌ Error cargando reportes:', err);
      throw err;
    }
  };

  /**
   * Cargar count de alertas activas
   */
  const loadAlertCount = async () => {
    try {
      const alertReports = await authorityService.getAllReports({ report_type: 'alerta' });
      setAlertasActivas(alertReports.length);
    } catch (err) {
      console.error('❌ Error cargando alertas:', err);
    }
  };

  /**
   * Crear nuevo reporte
   */
  const createReport = async (reportData) => {
    try {
      console.log('➕ Creando reporte...', reportData);
      const newReport = await authorityService.createReport(reportData);
      setReports([...reports, newReport]);
      return newReport;
    } catch (err) {
      console.error('❌ Error creando reporte:', err);
      throw err;
    }
  };

  /**
   * Obtener estadísticas de comunidad específica
   */
  const getCommunityStats = async (communityId) => {
    try {
      return await authorityService.getCommunityStats(communityId);
    } catch (err) {
      console.error('❌ Error obteniendo estadísticas de comunidad:', err);
      throw err;
    }
  };

  /**
   * Planificar brigada médica
   */
  const planificarBrigada = (comunidad) => {
    alert(`📋 Planificando brigada médica para: ${comunidad}\n\n` +
          `Recursos asignados:\n` +
          `- 2 médicos\n` +
          `- 3 enfermeras\n` +
          `- Suministros nutricionales\n` +
          `- Transporte confirmado\n\n` +
          `Fecha sugerida: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-GT')}`);
  };

  /**
   * Enviar alerta a instituciones
   */
  const enviarAlerta = () => {
    alert('🔔 Alerta enviada a:\n\n' +
          '✓ Centros de Salud de Sacatepéquez\n' +
          '✓ Hospital Regional\n' +
          '✓ ONGs colaboradoras\n' +
          '✓ Ministerio de Salud\n\n' +
          'Mensaje: Actualización sobre situación crítica en zonas identificadas.');
  };

  /**
   * Descargar datos
   */
  const descargarPDF = () => {
    const contenido = `
REPORTE DE DESNUTRICIÓN - SACATEPÉQUEZ
Fecha: ${new Date().toLocaleDateString('es-GT')}

RESUMEN EJECUTIVO
- Usuarios Totales: ${dashboardStats.total_users}
- Usuarios Activos: ${dashboardStats.active_users}
- Consultas Hoy: ${dashboardStats.consultations_today}
- Alertas Activas: ${dashboardStats.active_alerts}

COMUNIDADES MONITOREADAS: ${communities.length}
${communities.map(c => `- ${c.name}`).join('\n')}
    `;

    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte_Sacatepequez_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const descargarExcel = () => {
    const csvContent = [
      ['REPORTE DESNUTRICIÓN - SACATEPÉQUEZ'],
      ['Fecha', new Date().toLocaleDateString('es-GT')],
      [''],
      ['ESTADÍSTICA', 'VALOR'],
      ['Usuarios Totales', dashboardStats.total_users],
      ['Usuarios Activos', dashboardStats.active_users],
      ['Consultas Hoy', dashboardStats.consultations_today],
      ['Alertas Activas', dashboardStats.active_alerts],
      [''],
      ['COMUNIDAD', 'POBLACIÓN'],
      ...communities.map(c => [c.name, c.population || 'N/A'])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Datos_Sacatepequez_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const descargarGrafica = (nombreGrafica) => {
    alert(`📊 Preparando descarga de gráfica: ${nombreGrafica}\n\n` +
          `En una implementación completa, esto generaría una imagen PNG de la gráfica seleccionada.`);
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadDashboardData();
    loadAlertCount();
  }, []);

  const value = {
    // Estados
    loading,
    error,
    dashboardStats,
    monthlyActivity,
    roleDistribution,
    userActivity,
    recentActivity,
    communities,
    zonasCriticas,
    reports,
    alertasActivas,

    // Funciones
    loadDashboardData,
    loadReports,
    loadAlertCount,
    createReport,
    getCommunityStats,
    planificarBrigada,
    enviarAlerta,
    descargarPDF,
    descargarExcel,
    descargarGrafica
  };

  return (
    <AuthorityContext.Provider value={value}>
      {children}
    </AuthorityContext.Provider>
  );
};

/**
 * Hook para usar el contexto de autoridades
 */
export const useAuthority = () => {
  const context = useContext(AuthorityContext);
  if (!context) {
    throw new Error('useAuthority debe ser usado dentro de AuthorityProvider');
  }
  return context;
};