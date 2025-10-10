import React, { useContext } from 'react';
import { AlertCircle } from 'lucide-react';
import { AppContext } from './context/AppContext';

export const HighRiskPatients = () => {
  const { patients } = useContext(AppContext);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
        Pacientes de Alto Riesgo
      </h3>
      <div className="space-y-3">
        {patients.filter(p => p.riesgo === 'alto').map(patient => (
          <div key={patient.id} className="border-l-4 border-red-500 pl-4 py-2">
            <div className="font-semibold text-gray-800">{patient.nombre}</div>
            <div className="text-sm text-gray-600">{patient.diagnostico}</div>
            <div className="text-xs text-gray-500 mt-1">
              IMC: {patient.imc} | Próxima visita: {patient.proximaVisita}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};