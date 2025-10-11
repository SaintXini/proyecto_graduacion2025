import React, { useContext } from 'react';
import { Calendar } from 'lucide-react';
import { AppContext } from './context/AppContext';

export const UpcomingVisits = () => {
  const { patients, medicalRecords } = useContext(AppContext);

  // Obtener últimos registros médicos como próximas visitas
  const recentRecords = medicalRecords
    .sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-blue-500" />
        Últimas Visitas Médicas
      </h3>
      <div className="space-y-3">
        {recentRecords.map(record => {
          const patient = patients.find(p => p.id === record.patient_id);
          return (
            <div key={record.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="font-semibold text-gray-800">
                {patient ? `${patient.first_name} ${patient.last_name}` : `Paciente #${record.patient_id}`}
              </div>
              <div className="text-sm text-gray-600">
                {new Date(record.visit_date).toLocaleDateString('es-GT')}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {record.diagnosis}
              </div>
            </div>
          );
        })}
        {recentRecords.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No hay visitas registradas
          </p>
        )}
      </div>
    </div>
  );
};
