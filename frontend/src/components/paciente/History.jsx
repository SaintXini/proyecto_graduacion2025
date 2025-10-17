import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

const History = ({ nutritionHistory, onRefresh }) => {
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
          <h2 className="text-2xl font-bold">Historial Médico</h2>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>

        {nutritionHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay registros médicos
            </h3>
            <p className="text-gray-600">
              Tus consultas y registros médicos aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {nutritionHistory.map((record, idx) => (
              <div key={idx} className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded-r-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">{record.date}</p>
                    {record.doctor && (
                      <p className="text-sm text-gray-600 mt-1">
                        Atendido por: {record.doctor}
                      </p>
                    )}
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 bg-blue-100 text-blue-800">
                      {record.estado}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {record.diagnosis && (
                    <div className="bg-white p-3 rounded">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Diagnóstico:</p>
                      <p className="text-sm text-gray-800">{record.diagnosis}</p>
                    </div>
                  )}

                  {record.symptoms && (
                    <div className="bg-white p-3 rounded">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Síntomas:</p>
                      <p className="text-sm text-gray-800">{record.symptoms}</p>
                    </div>
                  )}

                  {record.treatment && (
                    <div className="bg-white p-3 rounded">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Tratamiento:</p>
                      <p className="text-sm text-gray-800">{record.treatment}</p>
                    </div>
                  )}

                  {record.notes && (
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Observaciones:</p>
                      <p className="text-sm text-gray-600">{record.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;