import React from 'react';
import { FileText, Download } from 'lucide-react';
import { datosComunidades } from './data/dashboardData';
import { descargarPDF, descargarExcel } from './utils/reportUtils';

const ReportesEstadisticas = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Reportes y Estadísticas</h2>
      <p className="text-gray-600">Informes automáticos en PDF/Excel, análisis por comunidad y evaluación del impacto de programas.</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <span className="text-xs text-red-100">Resumen ejecutivo completo</span>
            </div>
            <Download className="h-6 w-6" />
          </button>
          
          <button
            onClick={descargarExcel}
            className="w-full flex items-center justify-between px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-md"
          >
            <div className="text-left">
              <span className="font-medium block">Exportar Datos Excel (CSV)</span>
              <span className="text-xs text-green-100">Todos los datos tabulados</span>
            </div>
            <Download className="h-6 w-6" />
          </button>
          
          <button
            onClick={() => alert('Generando informe consolidado...\n\nIncluye:\n- Análisis por comunidad\n- Evaluación de programas\n- Recomendaciones estratégicas\n- Proyecciones')}
            className="w-full flex items-center justify-between px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
          >
            <div className="text-left">
              <span className="font-medium block">Informe Ejecutivo Completo</span>
              <span className="text-xs text-blue-100">Análisis integral y proyecciones</span>
            </div>
            <FileText className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Estadísticas Clave del Período</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Total de Casos Registrados</span>
              <span className="text-2xl font-bold text-blue-600">1,703</span>
            </div>
          </div>
          
          <div className="border-l-4 border-green-600 bg-green-50 p-4 rounded">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Tasa de Recuperación</span>
              <span className="text-2xl font-bold text-green-600">52.3%</span>
            </div>
          </div>
          
          <div className="border-l-4 border-orange-600 bg-orange-50 p-4 rounded">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Promedio Casos/Mes</span>
              <span className="text-2xl font-bold text-orange-600">189</span>
            </div>
          </div>
          
          <div className="border-l-4 border-purple-600 bg-purple-50 p-4 rounded">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Comunidades Monitoreadas</span>
              <span className="text-2xl font-bold text-purple-600">6</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Análisis Detallado por Comunidad</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comunidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Casos Totales</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coordenadas</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {datosComunidades.map((comunidad, index) => (
              <tr key={index} className={comunidad.critico ? 'bg-red-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {comunidad.lat}, {comunidad.lon}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Evaluación del Impacto de Programas</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-200">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">-23%</div>
            <div className="text-sm text-gray-700 font-medium">Reducción de casos vs año anterior</div>
            <div className="mt-3 text-xs text-gray-600">Programa de Nutrición Infantil</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-2 border-green-200">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">+15%</div>
            <div className="text-sm text-gray-700 font-medium">Mejora en recuperación temprana</div>
            <div className="mt-3 text-xs text-gray-600">Brigadas Médicas Móviles</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border-2 border-purple-200">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">89%</div>
            <div className="text-sm text-gray-700 font-medium">Cobertura de seguimiento</div>
            <div className="mt-3 text-xs text-gray-600">Monitoreo Comunitario</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ReportesEstadisticas;