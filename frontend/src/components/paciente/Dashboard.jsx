// components/Dashboard.jsx
import React from 'react';
import { Bell, Calendar, CheckCircle, AlertCircle, FileText } from 'lucide-react';

const Dashboard = ({ patientData, notifications, appointments, treatments }) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Bienvenida, {patientData.name}</h2>
          <p className="text-blue-100">Paciente: {patientData.childName} ({patientData.childAge})</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-full p-3">
          {patientData.verified ? <CheckCircle className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
        </div>
      </div>
    </div>

    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
      <div className="flex items-start">
        <Bell className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
        <div>
          <h3 className="font-semibold text-yellow-800">Tienes {notifications.filter(n => !n.read).length} notificaciones pendientes</h3>
          <p className="text-yellow-700 text-sm mt-1">Revisa tus próximas citas y recordatorios importantes</p>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-blue-600" />
        Próximas Citas
      </h3>
      <div className="space-y-3">
        {appointments.filter(a => a.status === 'programada').map(apt => (
          <div key={apt.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 rounded-full p-3 text-white">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{apt.type}</p>
                <p className="text-sm text-gray-600">{apt.date} - {apt.time}</p>
                <p className="text-sm text-gray-500">{apt.doctor}</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              Confirmar
            </button>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-green-600" />
        Tratamientos Activos
      </h3>
      <div className="space-y-4">
        {treatments.map((treatment, idx) => (
          <div key={idx} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-gray-800">{treatment.name}</p>
                <p className="text-sm text-gray-600">{treatment.dosage}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                {treatment.status}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progreso</span>
                <span>{treatment.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${treatment.progress}%` }} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Inicio: {treatment.start} - Fin: {treatment.end}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Dashboard;
