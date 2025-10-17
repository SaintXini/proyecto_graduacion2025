// Frontend/src/components/medical/PatientsView.jsx
import React, { useContext, useState } from 'react';
import { Plus, Search, Edit, MapPin } from 'lucide-react';
import { AppContext } from './context/AppContext';

export const PatientsView = () => {
  const { patients, communities, createPatient, loading } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    cui: '',
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    password: '',
    community_id: '' // ← IMPORTANTE: Este campo debe estar aquí
  });

  const filteredPatients = patients.filter(p =>
    p.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    
    if (!newPatient.cui || !newPatient.nombre || !newPatient.apellidos || !newPatient.email) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    try {
      console.log('🔵 Creando paciente con datos:', newPatient);
      
      // CRÍTICO: Convertir community_id a número si existe
      const patientData = {
        ...newPatient,
        community_id: newPatient.community_id ? parseInt(newPatient.community_id) : null
      };
      
      console.log('🔵 Datos procesados:', patientData);
      
      const createdPatient = await createPatient(patientData);
      console.log('✅ Paciente creado:', createdPatient);
      
      alert('✅ Paciente creado exitosamente');
      
      // Cerrar modal
      setShowCreateModal(false);
      
      // Limpiar formulario
      setNewPatient({
        cui: '',
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        password: '',
        community_id: ''
      });
      
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error al crear paciente: ' + (error.response?.data?.message || error.message));
    }
  };

  // Función para obtener el nombre de la comunidad
  const getCommunityName = (patient) => {
    if (!patient.communities || patient.communities.length === 0) {
      return 'Sin comunidad';
    }
    const communityId = patient.communities[0];
    const community = communities.find(c => c.id === communityId);
    return community ? `${community.name} - ${community.location}` : `Comunidad ID: ${communityId}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Pacientes</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Paciente
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, CUI o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabla de pacientes */}
      {loading ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando pacientes...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CUI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comunidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No se encontraron pacientes
                  </td>
                </tr>
              ) : (
                filteredPatients.map(patient => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {patient.first_name} {patient.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Usuario: {patient.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{patient.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{patient.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{patient.phone || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        <span className={patient.communities && patient.communities.length > 0 ? 'text-green-700 font-medium' : 'text-gray-500'}>
                          {getCommunityName(patient)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        patient.is_active
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.is_active ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">
                        <Edit className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal crear paciente */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Crear Nuevo Paciente</h3>
            
            <form onSubmit={handleCreatePatient}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CUI */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CUI (DPI) *
                  </label>
                  <input
                    type="text"
                    value={newPatient.cui}
                    onChange={(e) => setNewPatient({...newPatient, cui: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={newPatient.nombre}
                    onChange={(e) => setNewPatient({...newPatient, nombre: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Apellidos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    value={newPatient.apellidos}
                    onChange={(e) => setNewPatient({...newPatient, apellidos: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={newPatient.telefono}
                    onChange={(e) => setNewPatient({...newPatient, telefono: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Contraseña */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    value={newPatient.password}
                    onChange={(e) => setNewPatient({...newPatient, password: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                    minLength="6"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                {/* Comunidad - IMPORTANTE */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1 text-green-600" />
                    Comunidad *
                  </label>
                  <select
                    value={newPatient.community_id}
                    onChange={(e) => {
                      console.log('🔵 Comunidad seleccionada:', e.target.value);
                      setNewPatient({...newPatient, community_id: e.target.value});
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  >
                    <option value="">Seleccione una comunidad</option>
                    {communities.map(community => (
                      <option key={community.id} value={community.id}>
                        {community.name} - {community.location}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    ⚠️ Debe seleccionar una comunidad para que el paciente aparezca en visitas domiciliarias
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Crear Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};