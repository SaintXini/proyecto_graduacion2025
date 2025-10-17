import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, CheckCircle, Edit } from 'lucide-react';
import patientApiService from '../../services/patientApi';

const Profile = ({ patientData, communityInfo, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: patientData?.first_name || '',
    last_name: patientData?.last_name || '',
    phone: patientData?.phone || '',
    email: patientData?.email || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await patientApiService.updateProfile(formData);
      alert('Perfil actualizado exitosamente');
      setEditing(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      alert('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Información Personal</h2>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit className="w-4 h-4" />
            <span>{editing ? 'Cancelar' : 'Editar'}</span>
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:bg-gray-400"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <User className="w-10 h-10 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Usuario</p>
                <p className="font-semibold text-gray-800">{patientData.username}</p>
              </div>
              {patientData.is_active && <CheckCircle className="w-6 h-6 text-green-500" />}
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <User className="w-10 h-10 text-purple-600" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Nombre Completo</p>
                <p className="font-semibold text-gray-800">
                  {patientData.first_name} {patientData.last_name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <Phone className="w-10 h-10 text-green-600" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Teléfono</p>
                <p className="font-semibold text-gray-800">{patientData.phone || 'No registrado'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <Mail className="w-10 h-10 text-red-600" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-800">{patientData.email}</p>
              </div>
            </div>

            {communityInfo && (
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-10 h-10 text-orange-600" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Comunidad</p>
                  <p className="font-semibold text-gray-800">{communityInfo.name}</p>
                  {communityInfo.location && (
                    <p className="text-sm text-gray-600">{communityInfo.location}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 pt-6 border-t">
          <h3 className="font-bold text-gray-800 mb-3">Estado de la Cuenta</h3>
          <div className={`border rounded-lg p-4 ${
            patientData.is_active ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-3">
              <CheckCircle className={`w-6 h-6 ${
                patientData.is_active ? 'text-green-600' : 'text-red-600'
              }`} />
              <div>
                <p className={`font-semibold ${
                  patientData.is_active ? 'text-green-800' : 'text-red-800'
                }`}>
                  {patientData.is_active ? 'Cuenta Activa' : 'Cuenta Inactiva'}
                </p>
                <p className={`text-sm ${
                  patientData.is_active ? 'text-green-700' : 'text-red-700'
                }`}>
                  Registrado el {new Date(patientData.created_at).toLocaleDateString('es-GT')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;