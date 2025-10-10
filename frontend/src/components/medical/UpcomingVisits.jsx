import React, { useContext } from 'react';
import { Calendar } from 'lucide-react';
import { AppContext } from './context/AppContext';

export const UpcomingVisits = () => {
  const { visits, patients } = useContext(AppContext);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-blue-500" />
        Próximas Visitas
      </h3>
      <div className="space-y-3">
        {visits.slice(0, 3).map(visit => {
          const patient = patients.find(p => p.id === visit.pacienteId);
          return (
            <div key={visit.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="font-semibold text-gray-800">{patient?.nombre}</div>
              <div className="text-sm text-gray-600">
                {visit.fecha} a las {visit.hora}
              </div>
              <div className="text-xs text-gray-500 mt-1">{patient?.direccion}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};