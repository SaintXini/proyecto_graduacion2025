// Frontend/src/components/medical/CreateNutritionPlanModal.jsx
import React, { useState, useContext } from 'react';
import { X, Apple, User, Calendar, TrendingUp } from 'lucide-react';
import { AppContext } from './context/AppContext';

export const CreateNutritionPlanModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const { patients } = useContext(AppContext);
  const [formData, setFormData] = useState({
    patient_id: '',
    title: '',
    description: '',
    calories_target: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patient_id) {
      newErrors.patient_id = 'Debe seleccionar un paciente';
    }

    if (!formData.title || formData.title.trim().length < 5) {
      newErrors.title = 'Título es requerido (mínimo 5 caracteres)';
    }

    if (formData.calories_target && (isNaN(formData.calories_target) || formData.calories_target < 1000 || formData.calories_target > 5000)) {
      newErrors.calories_target = 'Las calorías deben estar entre 1000 y 5000';
    }

    if (formData.end_date && new Date(formData.end_date) <= new Date(formData.start_date)) {
      newErrors.end_date = 'La fecha de fin debe ser posterior a la fecha de inicio';
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
      const dataToSubmit = {
        ...formData,
        patient_id: parseInt(formData.patient_id),
        calories_target: formData.calories_target ? parseInt(formData.calories_target) : null
      };
      
      await onSubmit(dataToSubmit);
      
      // Limpiar formulario
      setFormData({
        patient_id: '',
        title: '',
        description: '',
        calories_target: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        status: 'active'
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
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Apple className="w-6 h-6 mr-2 text-green-600" />
            Nuevo Plan de Nutrición
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
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
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

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título del Plan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Plan de Recuperación Nutricional"
              disabled={loading}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Describe los objetivos y detalles del plan nutricional..."
              rows="3"
              disabled={loading}
            />
          </div>

          {/* Calorías Objetivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Calorías Objetivo (diarias)
              </div>
            </label>
            <input
              type="number"
              value={formData.calories_target}
              onChange={(e) => handleChange('calories_target', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.calories_target ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: 2500"
              min="1000"
              max="5000"
              disabled={loading}
            />
            {errors.calories_target && <p className="text-red-500 text-xs mt-1">{errors.calories_target}</p>}
            <p className="text-xs text-gray-500 mt-1">Rango recomendado: 1000-5000 calorías</p>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            {/* Fecha Inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Fecha de Inicio
                </div>
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading}
              />
            </div>

            {/* Fecha Fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Fin
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange('end_date', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.end_date ? 'border-red-500' : 'border-gray-300'
                }`}
                min={formData.start_date}
                disabled={loading}
              />
              {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado del Plan
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            >
              <option value="active">Activo</option>
              <option value="paused">Pausado</option>
              <option value="completed">Completado</option>
            </select>
          </div>

          {/* Info adicional */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Nota:</strong> Después de crear el plan, podrás añadir comidas específicas 
              con sus valores nutricionales detallados.
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
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};