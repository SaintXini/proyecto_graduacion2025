import React, { useState, useEffect } from 'react';
import { Apple, Eye, Edit, Trash2, Plus, Download, X, Save, UtensilsCrossed } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const NutritionTab = () => {
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const [formData, setFormData] = useState({
    patient_id: '',
    title: '',
    description: '',
    calories_target: '',
    start_date: '',
    end_date: '',
    status: 'active'
  });

  useEffect(() => {
    loadNutritionPlans();
  }, []);

  const loadNutritionPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/nutrition`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNutritionPlans(response.data);
    } catch (err) {
      console.error('Error cargando planes de nutrición:', err);
      setError('Error al cargar los planes de nutrición');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.patient_id || !formData.title) {
      alert('Por favor complete los campos obligatorios (ID Paciente y Título)');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/nutrition`, 
        {
          ...formData,
          patient_id: parseInt(formData.patient_id),
          calories_target: parseInt(formData.calories_target) || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNutritionPlans([...nutritionPlans, response.data.plan]);
      setShowModal(false);
      resetForm();
      alert('Plan de nutrición creado exitosamente');
    } catch (err) {
      console.error('Error creando plan:', err);
      alert(err.response?.data?.message || 'Error al crear el plan de nutrición');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.patient_id || !formData.title) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/nutrition/${selectedPlan.id}`,
        {
          ...formData,
          patient_id: parseInt(formData.patient_id),
          calories_target: parseInt(formData.calories_target) || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNutritionPlans(nutritionPlans.map(plan => 
        plan.id === selectedPlan.id ? response.data.plan : plan
      ));
      setShowModal(false);
      resetForm();
      alert('Plan de nutrición actualizado exitosamente');
    } catch (err) {
      console.error('Error actualizando plan:', err);
      alert(err.response?.data?.message || 'Error al actualizar el plan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId) => {
    if (!window.confirm('¿Está seguro de eliminar este plan de nutrición?')) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/nutrition/${planId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNutritionPlans(nutritionPlans.filter(plan => plan.id !== planId));
      alert('Plan de nutrición eliminado exitosamente');
    } catch (err) {
      console.error('Error eliminando plan:', err);
      alert(err.response?.data?.message || 'Error al eliminar el plan');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode, plan = null) => {
    setModalMode(mode);
    setSelectedPlan(plan);
    
    if (plan && (mode === 'edit' || mode === 'view')) {
      setFormData({
        patient_id: plan.patient_id?.toString() || '',
        title: plan.title || '',
        description: plan.description || '',
        calories_target: plan.calories_target?.toString() || '',
        start_date: plan.start_date ? plan.start_date.split('T')[0] : '',
        end_date: plan.end_date ? plan.end_date.split('T')[0] : '',
        status: plan.status || 'active'
      });
    } else {
      resetForm();
    }
    
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      patient_id: '',
      title: '',
      description: '',
      calories_target: '',
      start_date: '',
      end_date: '',
      status: 'active'
    });
    setSelectedPlan(null);
  };

  const downloadNutritionPlansCSV = () => {
    try {
      const headers = ['ID Paciente', 'Título', 'Calorías Objetivo', 'Fecha Inicio', 'Fecha Fin', 'Estado', 'Descripción'];
      const rows = nutritionPlans.map(plan => [
        plan.patient_id,
        plan.title,
        plan.calories_target || 'N/A',
        plan.start_date ? new Date(plan.start_date).toLocaleDateString('es-GT') : 'N/A',
        plan.end_date ? new Date(plan.end_date).toLocaleDateString('es-GT') : 'N/A',
        plan.status === 'active' ? 'Activo' : 'Inactivo',
        plan.description || 'N/A'
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `planes_nutricion_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('Planes de nutrición descargados exitosamente');
    } catch (err) {
      console.error('Error descargando CSV:', err);
      alert('Error al descargar los datos');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'active': 'bg-green-100 text-green-700',
      'completed': 'bg-blue-100 text-blue-700',
      'inactive': 'bg-gray-100 text-gray-700'
    };
    return badges[status] || badges['active'];
  };

  const getStatusLabel = (status) => {
    const labels = {
      'active': 'Activo',
      'completed': 'Completado',
      'inactive': 'Inactivo'
    };
    return labels[status] || status;
  };

  if (loading && nutritionPlans.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando planes de nutrición...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 font-medium">{error}</p>
          <button 
            onClick={loadNutritionPlans}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
            <Apple className="w-6 h-6 text-blue-600" />
            <span>Gestión de Planes de Nutrición</span>
          </h3>
          <div className="flex space-x-3">
            <button
              onClick={downloadNutritionPlansCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Download className="w-4 h-4" />
              <span>Descargar CSV</span>
            </button>
            <button
              onClick={() => openModal('create')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Nuevo Plan</span>
            </button>
          </div>
        </div>

        {nutritionPlans.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <UtensilsCrossed className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay planes de nutrición registrados</p>
            <button
              onClick={() => openModal('create')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Crear Primer Plan
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Título</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID Paciente</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Calorías Objetivo</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha Inicio</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha Fin</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead><tbody className="divide-y divide-gray-200">
                {nutritionPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-700">{plan.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">{plan.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{plan.patient_id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {plan.calories_target ? `${plan.calories_target} kcal` : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {plan.start_date ? new Date(plan.start_date).toLocaleDateString('es-GT') : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {plan.end_date ? new Date(plan.end_date).toLocaleDateString('es-GT') : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(plan.status)}`}>
                        {getStatusLabel(plan.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal('view', plan)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal('edit', plan)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          disabled={loading}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para crear/editar/ver plan */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {modalMode === 'create' && 'Nuevo Plan de Nutrición'}
                {modalMode === 'edit' && 'Editar Plan de Nutrición'}
                {modalMode === 'view' && 'Detalles del Plan de Nutrición'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID del Paciente *
                  </label>
                  <input
                    type="number"
                    value={formData.patient_id}
                    onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Ej: 1"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calorías Objetivo (kcal)
                  </label>
                  <input
                    type="number"
                    value={formData.calories_target}
                    onChange={(e) => setFormData({ ...formData, calories_target: e.target.value })}
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Ej: 2000"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Plan *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  disabled={modalMode === 'view'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Ej: Plan de Alimentación Balanceada"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={modalMode === 'view'}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Descripción del plan de nutrición..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Fin
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  disabled={modalMode === 'view'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="active">Activo</option>
                  <option value="completed">Completado</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>

              {modalMode !== 'view' && (
                <p className="text-xs text-gray-500 mt-2">
                  * Campos obligatorios
                </p>
              )}
            </div>

            {modalMode !== 'view' && (
              <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  onClick={modalMode === 'create' ? handleCreate : handleUpdate}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Guardando...' : (modalMode === 'create' ? 'Crear' : 'Actualizar')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};