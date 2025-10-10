// components/Profile.jsx
import React from 'react';
import { User, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';

const Profile = ({ patientData }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Información Personal</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <User className="w-10 h-10 text-blue-600" />
          <div className="flex-1">
            <p className="text-sm text-gray-600">Tutor</p>
            <p className="font-semibold text-gray-800">{patientData.name}</p>
          </div>
          {patientData.verified && <CheckCircle className="w-6 h-6 text-green-500" />}
        </div>
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <User className="w-10 h-10 text-purple-600" />
          <div className="flex-1">
            <p className="text-sm text-gray-600">Paciente</p>
            <p className="font-semibold text-gray-800">{patientData.childName}</p>
            <p className="text-sm text-gray-600">{patientData.childAge}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <Phone className="w-10 h-10 text-green-600" />
          <div className="flex-1">
            <p className="text-sm text-gray-600">Teléfono</p>
            <p className="font-semibold text-gray-800">{patientData.phone}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <Mail className="w-10 h-10 text-red-600" />
          <div className="flex-1">
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold text-gray-800">{patientData.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <MapPin className="w-10 h-10 text-orange-600" />
          <div className="flex-1">
            <p className="text-sm text-gray-600">Dirección</p>
            <p className="font-semibold text-gray-800">{patientData.address}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t">
        <h3 className="font-bold text-gray-800 mb-3">Verificación de Identidad</h3>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">Cuenta Verificada</p>
              <p className="text-sm text-green-700">Verificado vía SMS el 01 Oct 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default Profile;
