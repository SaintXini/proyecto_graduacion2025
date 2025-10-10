import React, { useContext, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { AppContext } from './context/AppContext';

export const PatientsView = () => {
  const { patients } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.diagnostico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiesgoColor = (riesgo) => {
    switch(riesgo) {
      case 'alto': return 'bg-red-100 text-red-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'bajo': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Pacientes</h2>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-blue-700 transition">
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Paciente
        </button>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre o diagnóstico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Edad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnóstico</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IMC</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Riesgo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Próxima Visita</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPatients.map(patient => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{patient.nombre}</div>
                  <div className="text-sm text-gray-500">{patient.telefono}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{patient.edad} años</td>
                <td className="px-6 py-4 text-sm text-gray-900">{patient.diagnostico}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{patient.imc}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiesgoColor(patient.riesgo)}`}>
                    {patient.riesgo.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{patient.proximaVisita}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};