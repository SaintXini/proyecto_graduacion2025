import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, Eye, Download, Users, X, Save, Building2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const CommunitiesTab = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    population: '',
    health_center_id: ''
  });

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/communities`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommunities(response.data);
    } catch (err) {
      console.error('Error cargando comunidades:', err);
      setError('Error al cargar las comunidades');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.location) {
      alert('Por favor complete los campos obligatorios (Nombre y Ubicación)');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/communities`, 
        {
          ...formData,
          population: parseInt(formData.population) || 0
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommunities([...communities, response.data.community]);
      setShowModal(false);
      resetForm();
      alert('Comunidad creada exitosamente');
    } catch (err) {
      console.error('Error creando comunidad:', err);
      alert(err.response?.data?.message || 'Error al crear la comunidad');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.location) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/communities/${selectedCommunity.id}`,
        {
          ...formData,
          population: parseInt(formData.population) || 0
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommunities(communities.map(c => 
        c.id === selectedCommunity.id ? response.data.community : c
      ));
      setShowModal(false);
      resetForm();
      alert('Comunidad actualizada exitosamente');
    } catch (err) {
      console.error('Error actualizando comunidad:', err);
      alert(err.response?.data?.message || 'Error al actualizar la comunidad');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (communityId) => {
    if (!window.confirm('¿Está seguro de eliminar esta comunidad?')) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/communities/${communityId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCommunities(communities.filter(c => c.id !== communityId));
      alert('Comunidad eliminada exitosamente');
    } catch (err) {
      console.error('Error eliminando comunidad:', err);
      alert(err.response?.data?.message || 'Error al eliminar la comunidad');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode, community = null) => {
    setModalMode(mode);
    setSelectedCommunity(community);
    
    if (community && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: community.name || '',
        description: community.description || '',
        location: community.location || '',
        population: community.population?.toString() || '0',
        health_center_id: community.health_center_id?.toString() || ''
      });
    } else {
      resetForm();
    }
    
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      population: '',
      health_center_id: ''
    });
    setSelectedCommunity(null);
  };

  const downloadCommunitiesCSV = () => {
    try {
      const headers = ['Nombre', 'Ubicación', 'Población', 'Descripción', 'Centro de Salud ID'];
      const rows = communities.map(community => [
        community.name,
        community.location,
        community.population || 0,
        community.description || 'N/A',
        community.health_center_id || 'N/A'
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `comunidades_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('Datos de comunidades descargados exitosamente');
    } catch (err) {
      console.error('Error descargando CSV:', err);
      alert('Error al descargar los datos');
    }
  };

  if (loading && communities.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando comunidades...</p>
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
            onClick={loadCommunities}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            <span>Gestión de Comunidades</span>
          </h3>
          <div className="flex space-x-3">
            <button
              onClick={downloadCommunitiesCSV}
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
              <span>Nueva Comunidad</span>
            </button>
          </div>
        </div>

        {communities.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay comunidades registradas</p>
            <button
              onClick={() => openModal('create')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Crear Primera Comunidad
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <div 
                key={community.id} 
                className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition bg-gradient-to-br from-white to-blue-50"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-gray-800 text-lg flex-1">{community.name}</h4>
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p className="flex items-center">
                    <span className="font-medium min-w-[100px]">Ubicación:</span> 
                    <span className="text-gray-800">{community.location}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium min-w-[100px]">Población:</span> 
                    <span className="text-gray-800">{community.population?.toLocaleString() || 0} habitantes</span>
                  </p>
                  {community.description && (
                    <p className="text-gray-600 text-xs mt-2 line-clamp-2">
                      {community.description}
                    </p>
                  )}
                </div>

                <div className="flex space-x-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => openModal('view', community)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Ver</span>
                  </button>
                  <button
                    onClick={() => openModal('edit', community)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm">Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(community.id)}
                    disabled={loading}
                    className="flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para crear/editar/ver comunidad */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {modalMode === 'create' && 'Nueva Comunidad'}
                {modalMode === 'edit' && 'Editar Comunidad'}
                {modalMode === 'view' && 'Detalles de Comunidad'}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Comunidad *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={modalMode === 'view'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Ej: San Juan Sacatepéquez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  disabled={modalMode === 'view'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Ej: Sacatepéquez, Guatemala"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Población (habitantes)
                </label>
                <input
                  type="number"
                  value={formData.population}
                  onChange={(e) => setFormData({ ...formData, population: e.target.value })}
                  disabled={modalMode === 'view'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Ej: 15000"
                  min="0"
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
                  placeholder="Descripción de la comunidad..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Centro de Salud
                </label>
                <input
                  type="number"
                  value={formData.health_center_id}
                  onChange={(e) => setFormData({ ...formData, health_center_id: e.target.value })}
                  disabled={modalMode === 'view'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Ej: 1"
                  min="1"
                />
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