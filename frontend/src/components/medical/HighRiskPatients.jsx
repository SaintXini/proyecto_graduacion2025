import React, { useContext } from 'react';
import { AlertCircle } from 'lucide-react';
import { AppContext } from './context/AppContext';

export const HighRiskPatients = () => {
  const { patients, medicalRecords } = useContext(AppContext);

  // Obtener pacientes con alertas críticas
  const highRiskRecords = medicalRecords
    .filter(r => 
      r.diagnosis?.toLowerCase().includes('crítico') || 
      r.diagnosis?.toLowerCase().includes('urgente') ||
      r.diagnosis?.toLowerCase().includes('alto riesgo')
    )
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
        Pacientes de Alto Riesgo
      </h3>
      <div className="space-y-3">
        {highRiskRecords.map(record => {
          const patient = patients.find(p => p.id === record.patient_id);
          return (
            <div key={record.id} className="border-l-4 border-red-500 pl-4 py-2">
              <div className="font-semibold text-gray-800">
                {patient ? `${patient.first_name} ${patient.last_name}` : `Paciente #${record.patient_id}`}
              </div>
              <div className="text-sm text-gray-600">{record.diagnosis}</div>
              <div className="text-xs text-gray-500 mt-1">
                Fecha: {new Date(record.visit_date).toLocaleDateString('es-GT')}
              </div>
            </div>
          );
        })}
        {highRiskRecords.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No hay pacientes de alto riesgo actualmente
          </p>
        )}
      </div>
    </div>
  );
};