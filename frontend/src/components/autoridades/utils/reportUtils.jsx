import { datosComunidades, datosEdad, datosMensuales, zonasCriticas } from '../data/dashboardData';

export const descargarPDF = () => {
  const contenido = `
    REPORTE DE DESNUTRICIÓN - SACATEPÉQUEZ
    Fecha: ${new Date().toLocaleDateString('es-GT')}
    
    RESUMEN EJECUTIVO
    - Casos Activos: 178
    - Casos Recuperados: 167
    - Nuevos Casos (mes): 63
    - Comunidades Críticas: 2
    
    DISTRIBUCIÓN POR COMUNIDAD:
    ${datosComunidades.map(c => `- ${c.nombre}: ${c.casos} casos ${c.critico ? '(CRÍTICO)' : ''}`).join('\n    ')}
    
    DISTRIBUCIÓN POR EDAD:
    ${datosEdad.map(e => `- ${e.rango}: ${e.casos} casos`).join('\n    ')}
    
    ZONAS CRÍTICAS IDENTIFICADAS:
    ${zonasCriticas.filter(z => z.nivel === 'Alto').map(z => `- ${z.zona}: ${z.casos} casos - Recursos: ${z.recursos}`).join('\n    ')}
  `;
  
  const blob = new Blob([contenido], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Reporte_Desnutricion_Sacatepequez_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const descargarExcel = () => {
  const csvContent = [
    ['REPORTE DESNUTRICIÓN - SACATEPÉQUEZ'],
    ['Fecha', new Date().toLocaleDateString('es-GT')],
    [''],
    ['COMUNIDAD', 'CASOS', 'ESTADO'],
    ...datosComunidades.map(c => [c.nombre, c.casos, c.critico ? 'CRÍTICO' : 'NORMAL']),
    [''],
    ['RANGO EDAD', 'CASOS'],
    ...datosEdad.map(e => [e.rango, e.casos]),
    [''],
    ['MES', 'ACTIVOS', 'RECUPERADOS', 'NUEVOS'],
    ...datosMensuales.map(m => [m.mes, m.activos, m.recuperados, m.nuevos])
  ].map(row => row.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Datos_Desnutricion_Sacatepequez_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const descargarGrafica = (nombreGrafica) => {
  alert(`Preparando descarga de gráfica: ${nombreGrafica}\n\nEn una implementación completa, esto generaría una imagen PNG de la gráfica seleccionada.`);
};

export const planificarBrigada = (comunidad) => {
  alert(`Planificando brigada médica para: ${comunidad}\n\nRecursos asignados:\n- 2 médicos\n- 3 enfermeras\n- Suministros nutricionales\n- Transporte confirmado\n\nFecha sugerida: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-GT')}`);
};

export const enviarAlerta = () => {
  alert('Alerta enviada a:\n\n✓ Centros de Salud de Sacatepéquez\n✓ Hospital Regional\n✓ ONGs colaboradoras\n✓ Ministerio de Salud\n\nMensaje: Actualización sobre situación crítica en zonas identificadas.');
};