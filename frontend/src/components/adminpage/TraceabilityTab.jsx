import React from 'react';
import { FileText, Calendar, Eye, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const TraceabilityTab = ({ traceability, downloadChart }) => {
  const handleViewDetails = (record) => {
    alert(`Detalles de consulta:\nMédico: ${record.medico}\nPaciente: ${record.paciente}\nDiagnóstico: ${record.diagnostico}\nTratamiento: ${record.tratamiento}`);
  };

  const handleDownloadReport = (record) => {
    alert(`Descargando reporte de: ${record.paciente} (${record.fecha})`);
  };

  const monthlyConsultations = [
    { medico: 'Dr. Pérez', consultas: 45 },
    { medico: 'Dra. López', consultas: 38 },
    { medico: 'Dr. García', consultas: 52 },
    { medico: 'Dra. Martínez', consultas: 41 },
    { medico: 'Dr. Rodríguez', consultas: 48 }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <span>Trazabilidad Médico-Paciente</span>
        </h3>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por médico..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Buscar por paciente..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Traceability Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Médico</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Paciente</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Diagnóstico</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tratamiento</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {traceability.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{record.fecha}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">{record.medico}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{record.paciente}</td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {record.diagnostico}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{record.tratamiento}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewDetails(record)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition" 
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDownloadReport(record)}
                        className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition" 
                        title="Descargar reporte"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Traceability Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Total Consultas</h4>
          <p className="text-3xl font-bold text-gray-800">234</p>
          <p className="text-sm text-green-600 mt-2">Este mes</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Médicos Activos</h4>
          <p className="text-3xl font-bold text-gray-800">45</p>
          <p className="text-sm text-green-600 mt-2">En servicio</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Pacientes Atendidos</h4>
          <p className="text-3xl font-bold text-gray-800">189</p>
          <p className="text-sm text-green-600 mt-2">Este mes</p>
        </div>
      </div>

      {/* Monthly Traceability Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Consultas Mensuales por Médico</h3>
          <button
            onClick={() => downloadChart('Consultas Mensuales')}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Descargar</span>
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyConsultations}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="medico" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="consultas" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
