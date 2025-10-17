import React, { useContext, useState } from 'react';
import { Plus, FileText, Calendar, Pill, User, Stethoscope } from 'lucide-react';
import { AppContext } from './context/AppContext';

export const RecordsView = () => {
  const {
    medicalRecords,
    patients,
    currentUser,
    createMedicalRecord,
    loading
  } = useContext(AppContext);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    patient_id: '',
    doctor_id: currentUser?.id || '',
    diagnosis: '',
    symptoms: '',
    treatment: '',
    notes: ''
  });

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    if (!newRecord.patient_id || !newRecord.diagnosis) {
      alert('Por favor complete los campos obligatorios');
      return;
    }
    try {
      await createMedicalRecord({
        ...newRecord,
        doctor_id: currentUser.id
      });
      alert('Registro médico creado exitosamente');
      setShowCreateModal(false);
      setNewRecord({
        patient_id: '',
        doctor_id: currentUser?.id || '',
        diagnosis: '',
        symptoms: '',
        treatment: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error creando registro:', error);
      alert('Error al crear registro médico: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Registros Médicos</h2>
          <p className="text-gray-600 text-sm mt-1">Historial completo de consultas médicas</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-green-700 transition shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Consulta
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando registros...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {medicalRecords.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No hay registros médicos</p>
              <p className="text-gray-400 text-sm mt-2">
                Los registros médicos creados aparecerán aquí
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Crear primer registro
              </button>
            </div>
          ) : (
            medicalRecords.map(record => (
              <div key={record.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Stethoscope className="w-5 h-5 text-green-600 mr-2" />
                      <h3 className="text-lg font-bold text-gray-800">
                        {record.patient_name || `Paciente #${record.patient_id}`}
                      </h3>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(record.visit_date).toLocaleDateString('es-GT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      <User className="w-4 h-4 inline mr-1" />
                      Dr. {record.doctor_name || `Doctor #${record.doctor_id}`}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-sm font-bold text-red-800 mb-1"> Diagnóstico:</p>
                    <p className="text-gray-900">{record.diagnosis}</p>
                  </div>

                  {record.symptoms && (
                    <div className="bg-yellow-50 rounded-lg p-3">
                      <p className="text-sm font-bold text-yellow-800 mb-1"> Síntomas:</p>
                      <p className="text-gray-900">{record.symptoms}</p>
                    </div>
                  )}

                  {record.treatment && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm font-bold text-green-800 mb-1"> Tratamiento:</p>
                      <p className="text-gray-900">{record.treatment}</p>
                    </div>
                  )}

                  {record.notes && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm font-bold text-blue-800 mb-1"> Notas:</p>
                      <p className="text-gray-900">{record.notes}</p>
                    </div>
                  )}

                  {record.prescriptions && record.prescriptions.length > 0 && (
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-sm font-bold text-purple-800 mb-2 flex items-center">
                        <Pill className="w-4 h-4 mr-1" />
                        Prescripciones:
                      </p>
                      {record.prescriptions.map((prescription, idx) => (
                        <div key={idx} className="text-sm text-gray-800 mb-2 pl-4 border-l-2 border-purple-300">
                          <strong>{prescription.medication_name}</strong>
                          <div className="text-xs text-gray-600">
                            Dosis: {prescription.dosage} | Frecuencia: {prescription.frequency}
                            {prescription.duration && ` | Duración: ${prescription.duration}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal crear registro médico */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Crear Registro Médico</h3>
            <form onSubmit={handleCreateRecord}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paciente *
                  </label>
                  <select
                    value={newRecord.patient_id}
                    onChange={(e) => setNewRecord({ ...newRecord, patient_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    required
                  >
                    <option value="">Seleccione un paciente</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.first_name} {patient.last_name} - {patient.username}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diagnóstico *
                  </label>
                  <textarea
                    value={newRecord.diagnosis}
                    onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    rows="3"
                    required
                    placeholder="Ingrese el diagnóstico del paciente"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Síntomas
                  </label>
                  <textarea
                    value={newRecord.symptoms}
                    onChange={(e) => setNewRecord({ ...newRecord, symptoms: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    rows="3"
                    placeholder="Describa los síntomas presentados"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tratamiento
                  </label>
                  <textarea
                    value={newRecord.treatment}
                    onChange={(e) => setNewRecord({ ...newRecord, treatment: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    rows="3"
                    placeholder="Indique el tratamiento a seguir"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas Adicionales
                  </label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    rows="3"
                    placeholder="Observaciones adicionales"
                  />
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
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Crear Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
