// components/History.jsx
import React from 'react';

const History = ({ nutritionHistory }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Historial Nutricional</h2>
      <div className="space-y-4">
        {nutritionHistory.map((record, idx) => (
          <div key={idx} className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded-r-lg">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold text-gray-800 text-lg">{record.date}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                  record.estado === 'Normal' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {record.estado}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="bg-white p-3 rounded">
                <p className="text-sm text-gray-600">Peso</p>
                <p className="text-xl font-bold text-gray-800">{record.peso}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-sm text-gray-600">Talla</p>
                <p className="text-xl font-bold text-gray-800">{record.talla}</p>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm font-semibold text-gray-700 mb-1">Observaciones:</p>
              <p className="text-sm text-gray-600">{record.notas}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default History;
