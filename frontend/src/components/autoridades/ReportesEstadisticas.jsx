import React, { useState, useEffect } from 'react';
import { FileText, Download, TrendingUp, TrendingDown } from 'lucide-react';
import authorityService from '../../services/authorityService';

const ReportesEstadisticas = () => {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    consultations_today: 0,
    active_alerts: 0
  });
  const [communities, setCommunities] = useState([]);
  const [monthlyActivity, setMonthlyActivity] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      setLoading(true);
      console.log('📊 Cargando datos para reportes...');
      
      const [statsData, communitiesData, activityData, reportsData] = await Promise.all([
        authorityService.getDashboardStats(),
        authorityService.getCommunities(),
        authorityService.getMonthlyActivity(),
        authorityService.getAllReports()
      ]);
      
      setStats(statsData);
      setCommunities(communitiesData);
      setMonthlyActivity(activityData);
      setReports(reportsData);
      
      console.log('✅ Datos cargados para reportes');
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const descargarPDF = () => {
    const totalPacientes = communities.reduce((sum, c) => sum + (c.casos || 0), 0);
    const comunidadesCriticas = communities.filter(c => c.critico).length;
    
    const contenido = `
REPORTE DE SALUD COMUNITARIA - SACATEPÉQUEZ
Fecha de generación: ${new Date().toLocaleDateString('es-GT')} ${new Date().toLocaleTimeString('es-GT')}

═══════════════════════════════════════════════════════════
RESUMEN EJECUTIVO
═══════════════════════════════════════════════════════════

• Total de Usuarios: ${stats.total_users}
• Usuarios Activos: ${stats.active_users}
• Consultas Registradas Hoy: ${stats.consultations_today}
• Alertas Activas: ${stats.active_alerts}

═══════════════════════════════════════════════════════════
ANÁLISIS POR COMUNIDADES
═══════════════════════════════════════════════════════════

Total de Comunidades Monitoreadas: ${communities.length}
Total de Pacientes Registrados: ${totalPacientes}
Comunidades en Estado Crítico: ${comunidadesCriticas}

Detalle por Comunidad:
${communities.map(c => `
  • ${c.nombre || c.name}
    - Pacientes: ${c.casos || 0}
    - Estado: ${c.critico ? '⚠️ CRÍTICO' : c.casos > 30 ? '⚠ Atención' : '✓ Normal'}
    - Ubicación: ${c.location || 'N/A'}
    - Población: ${c.population ? c.population.toLocaleString() : 'N/A'}
`).join('\n')}

═══════════════════════════════════════════════════════════
ACTIVIDAD MENSUAL
═══════════════════════════════════════════════════════════

${monthlyActivity.map(m => `
  ${m.mes}:
    - Usuarios: ${m.usuarios}
    - Consultas: ${m.consultas}
`).join('\n')}

═══════════════════════════════════════════════════════════
REPORTES GENERADOS
═══════════════════════════════════════════════════════════

Total de reportes en el sistema: ${reports.length}

Últimos 10 reportes:
${reports.slice(0, 10).map((r, i) => `
  ${i + 1}. ${r.title}
     Tipo: ${r.report_type}
     Fecha: ${new Date(r.created_at).toLocaleDateString('es-GT')}
`).join('\n')}

═══════════════════════════════════════════════════════════
CONCLUSIONES
═══════════════════════════════════════════════════════════

${comunidadesCriticas > 0 ? `
⚠️ ATENCIÓN: ${comunidadesCriticas} comunidad(es) en estado crítico requieren intervención inmediata.
` : '✓ Todas las comunidades están bajo control.'}

Tasa de cobertura: ${((stats.active_users / stats.total_users) * 100).toFixed(1)}%
Promedio de consultas por comunidad: ${(totalPacientes / communities.length || 0).toFixed(1)}

═══════════════════════════════════════════════════════════
Documento generado automáticamente por el Sistema de Salud Comunitaria
${new Date().toLocaleString('es-GT')}
═══════════════════════════════════════════════════════════
`;

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte_Sacatepequez_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('✅ Reporte descargado exitosamente');
  };

  const descargarExcel = () => {
    const csvContent = [
      ['REPORTE SALUD COMUNITARIA - SACATEPÉQUEZ'],
      ['Fecha', new Date().toLocaleDateString('es-GT')],
      [''],
      ['ESTADÍSTICAS GENERALES'],
      ['Métrica', 'Valor'],
      ['Total Usuarios', stats.total_users],
      ['Usuarios Activos', stats.active_users],
      ['Consultas Hoy', stats.consultations_today],
      ['Alertas Activas', stats.active_alerts],
      [''],
      ['ANÁLISIS POR COMUNIDADES'],
      ['Comunidad', 'Pacientes', 'Estado', 'Ubicación', 'Población'],
      ...communities.map(c => [
        c.nombre || c.name,
        c.casos || 0,
        c.critico ? 'CRÍTICO' : c.casos > 30 ? 'ATENCIÓN' : 'NORMAL',
        c.location || 'N/A',
        c.population || 'N/A'
      ]),
      [''],
      ['ACTIVIDAD MENSUAL'],
      ['Mes', 'Usuarios', 'Consultas'],
      ...monthlyActivity.map(m => [m.mes, m.usuarios, m.consultas])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Datos_Sacatepequez_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('✅ Datos exportados a Excel (CSV) exitosamente');
  };

  const generarInformeCompleto = async () => {
    try {
      setGenerating(true);
      console.log('📊 Generando informe completo del sistema...');
      
      const report = await authorityService.generateSystemReport('completo');
      
      alert(`✅ Informe completo generado exitosamente\n\n📄 ID del reporte: ${report.report?.id || report.id}\n\nEl informe ha sido guardado en el sistema y puede ser consultado en cualquier momento.`);
      
      // Recargar lista de reportes
      const reportsData = await authorityService.getAllReports();
      setReports(reportsData);
      
    } catch (error) {
      console.error('❌ Error generando informe:', error);
      alert('❌ Error al generar el informe completo');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando datos de reportes...</p>
        </div>
      </div>
    );
  }

  const totalPacientes = communities.reduce((sum, c) => sum + (c.casos || 0), 0);
  const comunidadesCriticas = communities.filter(c => c.critico).length;
  const promedioConsultas = totalPacientes / (communities.length || 1);
  const tasaRecuperacion = stats.active_users > 0 ? ((stats.active_users / stats.total_users) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Reportes y Estadísticas</h2>
        <p className="text-gray-600">
          Informes automáticos con datos reales del sistema, análisis por comunidad y evaluación de programas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generación de reportes */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Generar Reportes
          </h3>
          <div className="space-y-4">
            <button
              onClick={descargarPDF}
              className="w-full flex items-center justify-between px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-md"
            >
              <div className="text-left">
                <span className="font-medium block">Descargar Reporte PDF</span>
                <span className="text-xs text-red-100">Resumen ejecutivo con datos actuales</span>
              </div>
              <Download className="h-6 w-6" />
            </button>

            <button
              onClick={descargarExcel}
              className="w-full flex items-center justify-between px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-md"
            >
              <div className="text-left">
                <span className="font-medium block">Exportar Datos Excel (CSV)</span>
                <span className="text-xs text-green-100">Todos los datos tabulados del sistema</span>
              </div>
              <Download className="h-6 w-6" />
            </button>

            <button
              onClick={generarInformeCompleto}
              disabled={generating}
              className="w-full flex items-center justify-between px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <div className="text-left">
                <span className="font-medium block">
                  {generating ? 'Generando Informe...' : 'Informe Ejecutivo Completo'}
                </span>
                <span className="text-xs text-blue-100">
                  Análisis integral y proyecciones guardadas en el sistema
                </span>
              </div>
              <FileText className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Estadísticas clave del período */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Estadísticas Clave del Sistema</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Total de Usuarios</span>
                <span className="text-2xl font-bold text-blue-600">{stats.total_users}</span>
              </div>
            </div>

            <div className="border-l-4 border-green-600 bg-green-50 p-4 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-700 font-medium">Tasa de Cobertura</span>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-xs text-gray-600">
                      {stats.active_users} de {stats.total_users} activos
                    </span>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">{tasaRecuperacion.toFixed(1)}%</span>
              </div>
            </div>

            <div className="border-l-4 border-orange-600 bg-orange-50 p-4 rounded">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Promedio Pacientes/Comunidad</span>
                <span className="text-2xl font-bold text-orange-600">{promedioConsultas.toFixed(1)}</span>
              </div>
            </div>

            <div className="border-l-4 border-purple-600 bg-purple-50 p-4 rounded">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Comunidades Monitoreadas</span>
                <span className="text-2xl font-bold text-purple-600">{communities.length}</span>
              </div>
            </div>

            {comunidadesCriticas > 0 && (
              <div className="border-l-4 border-red-600 bg-red-50 p-4 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-700 font-medium">Comunidades Críticas</span>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-red-600 font-medium">⚠️ Requieren atención</span>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-red-600">{comunidadesCriticas}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Análisis detallado por comunidad */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Análisis Detallado por Comunidad (Datos Reales)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comunidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pacientes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Población
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {communities.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No hay comunidades registradas
                  </td>
                </tr>
              ) : (
                communities.map((comunidad, index) => (
                  <tr key={comunidad.id || index} className={comunidad.critico ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{comunidad.nombre || comunidad.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-2xl font-bold text-gray-900">{comunidad.casos || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {comunidad.critico ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-red-600 text-white">
                          ⚠️ CRÍTICO
                        </span>
                      ) : comunidad.casos > 30 ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          ⚠ Atención
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          ✓ Normal
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {comunidad.population ? comunidad.population.toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {comunidad.location || 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historial de reportes generados */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Historial de Reportes Generados</h3>
        {reports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No hay reportes generados aún</p>
            <p className="text-sm mt-1">Genera tu primer informe usando los botones de arriba</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.slice(0, 10).map((report, index) => (
              <div key={report.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{report.title}</p>
                    <p className="text-xs text-gray-500">
                      Tipo: {report.report_type} • {new Date(report.created_at).toLocaleString('es-GT')}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">ID: {report.id}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportesEstadisticas;