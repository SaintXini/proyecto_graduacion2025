import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, CheckCircle, Save } from 'lucide-react';
import patientApiService from '../../services/patientApi';

const Location = ({ patientData, communityInfo, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [availability, setAvailability] = useState({
    available: true,
    mornings: true,
    afternoons: true,
    instructions: ''
  });

  useEffect(() => {
    loadCommunities();
    if (communityInfo) {
      setSelectedCommunity(communityInfo.id);
    }
  }, [communityInfo]);

  const loadCommunities = async () => {
    try {
      const data = await patientApiService.getAllCommunities();
      setCommunities(data);
    } catch (error) {
      console.error('Error cargando comunidades:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Aquí puedes implementar la lógica para guardar la ubicación
      // Por ahora solo simula el guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Ubicación actualizada exitosamente');
      setEditing(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error guardando ubicación:', error);
      alert('Error al guardar la ubicación');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Ubicación y Disponibilidad</h2>

        {/* Información de Comunidad */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
          <div className="flex items-start space-x-4">
            <MapPin className="w-8 h-8 text-blue-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-2">Comunidad Asignada</h3>
              {communityInfo ? (
                <>
                  <p className="text-gray-700 font-semibold">{communityInfo.name}</p>
                  {communityInfo.location && (
                    <p className="text-gray-600 mt-1">{communityInfo.location}</p>
                  )}
                  {communityInfo.description && (
                    <p className="text-sm text-gray-600 mt-2">{communityInfo.description}</p>
                  )}
                  {communityInfo.population && (
                    <p className="text-sm text-gray-500 mt-2">
                      Población: {communityInfo.population} habitantes
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-600">No tienes una comunidad asignada</p>
              )}
              
              {editing && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Comunidad
                  </label>
                  <select
                    value={selectedCommunity || ''}
                    onChange={(e) => setSelectedCommunity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccione una comunidad</option>
                    {communities.map(community => (
                      <option key={community.id} value={community.id}>
                        {community.name} - {community.location}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Disponibilidad para Visitas */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Disponibilidad para Visitas</h3>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Editar
              </button>
            )}
          </div>

          <div className="space-y-3">
            {/* Estado de disponibilidad */}
            <div className={`flex items-center justify-between p-3 rounded-lg ${
              availability.available ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className="flex items-center space-x-3">
                <CheckCircle className={`w-5 h-5 ${
                  availability.available ? 'text-green-600' : 'text-red-600'
                }`} />
                <span className="font-semibold text-gray-800">
                  {availability.available ? 'Disponible para visitas' : 'No disponible'}
                </span>
              </div>
              {editing && (
                <button
                  onClick={() => setAvailability({ ...availability, available: !availability.available })}
                  className="px-4 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                >
                  Cambiar
                </button>
              )}
            </div>

            {/* Horarios preferidos */}
            {availability.available && (
              <>
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Horarios preferidos:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center space-x-2 p-3 rounded cursor-pointer ${
                      editing ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-100'
                    }`}>
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={availability.mornings}
                        onChange={(e) => editing && setAvailability({ 
                          ...availability, 
                          mornings: e.target.checked 
                        })}
                        disabled={!editing}
                      />
                      <span className="text-sm text-gray-700">Mañanas (8-12)</span>
                    </label>
                    <label className={`flex items-center space-x-2 p-3 rounded cursor-pointer ${
                      editing ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-100'
                    }`}>
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={availability.afternoons}
                        onChange={(e) => editing && setAvailability({ 
                          ...availability, 
                          afternoons: e.target.checked 
                        })}
                        disabled={!editing}
                      />
                      <span className="text-sm text-gray-700">Tardes (2-6)</span>
                    </label>
                  </div>
                </div>

                {/* Instrucciones especiales */}
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Instrucciones especiales:</p>
                  <textarea
                    className={`w-full p-3 border border-gray-300 rounded-lg text-sm ${
                      !editing && 'bg-gray-50'
                    }`}
                    rows="3"
                    placeholder="Ej: Casa con portón verde, segundo piso..."
                    value={availability.instructions}
                    onChange={(e) => setAvailability({ 
                      ...availability, 
                      instructions: e.target.value 
                    })}
                    disabled={!editing}
                  />
                </div>
              </>
            )}

            {/* Botones de acción */}
            {editing && (
              <div className="flex space-x-3 mt-4 pt-4 border-t">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:bg-gray-400"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
                <button
                  onClick={() => setEditing(false)}
                  disabled={saving}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;