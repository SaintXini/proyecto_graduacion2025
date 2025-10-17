// Frontend/src/components/medical/CreatePatientModal.jsx
import React, { useState } from 'react';
import { X, User, Mail, Phone, CreditCard } from 'lucide-react';

export const CreatePatientModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    cui: '',
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    password: 'default123'
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cui || formData.cui.length < 5) {
      newErrors.cui = 'CUI debe tener al menos 5 caracteres';
    }

    if (!formData.nombre || formData.nombre.trim().length < 2) {
      newErrors.nombre = 'Nombre es requerido (mínimo 2 caracteres)';
    }

    if (!formData.apellidos || formData.apellidos.trim().length < 2) {
      newErrors.apellidos = 'Apellidos son requeridos (mínimo 2 caracteres)';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefono || formData.telefono.length < 8) {
      newErrors.telefono = 'Teléfono debe tener al menos 8 dígitos';
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
      await onSubmit(formData);
      // Limpiar formulario
      setFormData({
        cui: '',
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        password: 'default123'
      });
      setErrors({});
    } catch (error) {
      console.error('Error en modal:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Limpiar error del campo al escribir
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h3 className="text-xl font-bold text-gray-800">Nuevo Paciente</h3>
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
          {/* CUI */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                CUI <span className="text-red-500">*</span>
              </div>
            </label>
            <input
              type="text"
              value={formData.cui}
              onChange={(e) => handleChange('cui', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.cui ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: 1234567890101"
              disabled={loading}
            />
            {errors.cui && <p className="text-red-500 text-xs mt-1">{errors.cui}</p>}
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Nombre <span className="text-red-500">*</span>
              </div>
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Juan"
              disabled={loading}
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
          </div>

          {/* Apellidos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellidos <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.apellidos}
              onChange={(e) => handleChange('apellidos', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.apellidos ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Pérez García"
              disabled={loading}
            />
            {errors.apellidos && <p className="text-red-500 text-xs mt-1">{errors.apellidos}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email <span className="text-red-500">*</span>
              </div>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: juan.perez@example.com"
              disabled={loading}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Teléfono <span className="text-red-500">*</span>
              </div>
            </label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.telefono ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: 12345678"
              disabled={loading}
            />
            {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
          </div>

          {/* Info adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Se asignará automáticamente una contraseña por defecto. 
              El paciente podrá cambiarla después de su primer acceso.
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
              {loading ? 'Creando...' : 'Crear Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};