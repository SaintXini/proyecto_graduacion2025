// Frontend/src/components/medical/CreateMedicalRecordModal.jsx
import React, { useState, useContext } from 'react';
import { X, FileText, User, Stethoscope, Pill } from 'lucide-react';
import { AppContext } from './context/AppContext';

export const CreateMedicalRecordModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const { patients, currentUser } = useContext(AppContext);
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: currentUser?.id || '',
    diagnosis: '',
    symptoms: '',
    treatment: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patient_id) {
      newErrors.patient_id = 'Debe seleccionar un paciente';
    }

    if (!formData.diagnosis || formData.diagnosis.trim().length < 5) {
      newErrors.diagnosis = 'Diagnóstico es requerido (mínimo 5 caracteres)';
    }

    if (!formData.symptoms || formData.symptoms.trim().length < 5) {
      newErrors.symptoms = 'Síntomas son requeridos (mínimo 5 caracteres)';
    }

    if (!formData.treatment || formData.treatment.trim().length < 5) {
      newErrors.treatment = 'Tratamiento es requerido (mínimo 5 caracteres)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        ...formData,
        patient_id: parseInt(formData.patient_id),
        doctor_id: currentUser?.id
      });
      
      // Limpiar formulario
      setFormData({
        patient_id: '',
        doctor_id: currentUser?.id || '',
        diagnosis: '',
        symptoms: '',
        treatment: '',
        notes: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error en modal:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-blue-600" />
            Nuevo Registro Médico
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Paciente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Paciente <span className="text-red-500">*</span>
              </div>
            </label>
            <select
              value={formData.patient_id}
              onChange={(e) => handleChange('patient_id', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.patient_id ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            >
              <option value="">Seleccione un paciente</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.first_name} {patient.last_name} - {patient.username}
                </option>
              ))}
            </select>
            {errors.patient_id && <p className="text-red-500 text-xs mt-1">{errors.patient_id}</p>}
          </div>

          {/* Diagnóstico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <Stethoscope className="w-4 h-4 mr-2" />
                Diagnóstico <span className="text-red-500">*</span>
              </div>
            </label>
            <input
              type="text"
              value={formData.diagnosis}
              onChange={(e) => handleChange('diagnosis', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.diagnosis ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Desnutrición aguda moderada"
              disabled={loading}
            />
            {errors.diagnosis && <p className="text-red-500 text-xs mt-1">{errors.diagnosis}</p>}
          </div>

          {/* Síntomas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Síntomas <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.symptoms}
              onChange={(e) => handleChange('symptoms', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.symptoms ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describa los síntomas observados..."
              rows="3"
              disabled={loading}
            />
            {errors.symptoms && <p className="text-red-500 text-xs mt-1">{errors.symptoms}</p>}
          </div>

          {/* Tratamiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <Pill className="w-4 h-4 mr-2" />
                Tratamiento <span className="text-red-500">*</span>
              </div>
            </label>
            <textarea
              value={formData.treatment}
              onChange={(e) => handleChange('treatment', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.treatment ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describa el tratamiento prescrito..."
              rows="3"
              disabled={loading}
            />
            {errors.treatment && <p className="text-red-500 text-xs mt-1">{errors.treatment}</p>}
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas Adicionales
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observaciones adicionales (opcional)..."
              rows="2"
              disabled={loading}
            />
          </div>

          {/* Info adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Este registro será creado con la fecha y hora actual. 
              El doctor asignado es: {currentUser?.first_name} {currentUser?.last_name}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Crear Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};