import React, { useState } from 'react';
import { Calendar, Clock, RefreshCw } from 'lucide-react';

const Appointments = ({ appointments, onRefresh }) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (onRefresh) await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Controles y Citas</h2>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay citas programadas
            </h3>
            <p className="text-gray-600">
              Tus próximas citas médicas aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map(apt => (
              <div key={apt.id} className={`p-5 rounded-lg border-2 ${
                apt.status === 'programada' 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className={`rounded-full p-3 ${
                      apt.status === 'programada' 
                        ? 'bg-blue-500' 
                        : 'bg-gray-400'
                    }`}>
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{apt.type}</h3>
                      <p className="text-gray-600 mt-1">{apt.doctor}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          {apt.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {apt.time}
                        </div>
                      </div>
                      {apt.notes && (
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-semibold">Notas:</span> {apt.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    apt.status === 'programada' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-300 text-gray-700'
                  }`}>
                    {apt.status === 'programada' ? 'Programada' : 'Completada'}
                  </span>
                </div>

                {apt.status === 'programada' && (
                  <div className="mt-4 flex space-x-3">
                    <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                      Confirmar Asistencia
                    </button>
                    <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold">
                      Reagendar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;