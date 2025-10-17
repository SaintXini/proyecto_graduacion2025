import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Eye, Download, Plus, Edit, Trash2, X, Save, Activity, User, Stethoscope } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import html2canvas from 'html2canvas';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const TraceabilityTab = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [filters, setFilters] = useState({
    patient_id: '',
    doctor_id: '',
    date: ''
  });

  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    diagnosis: '',
    symptoms: '',
    treatment: '',
    notes: ''
  });

  useEffect(() => {
    loadMedicalRecords();
  }, []);

  const loadMedicalRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      let url = `${API_URL}/traceability`;

      const params = new URLSearchParams();
      if (filters.patient_id) params.append('patient_id', filters.patient_id);
      if (filters.doctor_id) params.append('doctor_id', filters.doctor_id);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedicalRecords(response.data);
    } catch (err) {
      console.error('Error cargando registros médicos:', err);
      setError('Error al cargar los registros médicos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.patient_id || !formData.doctor_id || !formData.diagnosis) {
      alert('Por favor complete los campos obligatorios (ID Paciente, ID Médico y Diagnóstico)');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/traceability`, 
        {
          ...formData,
          patient_id: parseInt(formData.patient_id),
          doctor_id: parseInt(formData.doctor_id)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMedicalRecords([response.data.record, ...medicalRecords]);
      setShowModal(false);
      resetForm();
      alert('Registro médico creado exitosamente');
    } catch (err) {
      console.error('Error creando registro:', err);
      alert(err.response?.data?.message || 'Error al crear el registro médico');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.patient_id || !formData.doctor_id || !formData.diagnosis) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/traceability/${selectedRecord.id}`,
        {
          ...formData,
          patient_id: parseInt(formData.patient_id),
          doctor_id: parseInt(formData.doctor_id)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMedicalRecords(medicalRecords.map(record => 
        record.id === selectedRecord.id ? response.data.record : record
      ));
      setShowModal(false);
      resetForm();
      alert('Registro médico actualizado exitosamente');
    } catch (err) {
      console.error('Error actualizando registro:', err);
      alert(err.response?.data?.message || 'Error al actualizar el registro');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recordId) => {
    if (!window.confirm('¿Está seguro de eliminar este registro médico?')) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/traceability/${recordId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMedicalRecords(medicalRecords.filter(record => record.id !== recordId));
      alert('Registro médico eliminado exitosamente');
    } catch (err) {
      console.error('Error eliminando registro:', err);
      alert(err.response?.data?.message || 'Error al eliminar el registro');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode, record = null) => {
    setModalMode(mode);
    setSelectedRecord(record);

    if (record && (mode === 'edit' || mode === 'view')) {
      setFormData({
        patient_id: record.patient_id?.toString() || '',
        doctor_id: record.doctor_id?.toString() || '',
        diagnosis: record.diagnosis || '',
        symptoms: record.symptoms || '',
        treatment: record.treatment || '',
        notes: record.notes || ''
      });
    } else {
      resetForm();
    }

    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      patient_id: '',
      doctor_id: '',
      diagnosis: '',
      symptoms: '',
      treatment: '',
      notes: ''
    });
    setSelectedRecord(null);
  };

  const applyFilters = () => loadMedicalRecords();
  const clearFilters = () => {
    setFilters({ patient_id: '', doctor_id: '', date: '' });
    loadMedicalRecords();
  };

  const downloadRecordsCSV = () => {
    try {
      const headers = ['ID', 'Fecha', 'ID Paciente', 'ID Médico', 'Diagnóstico', 'Síntomas', 'Tratamiento', 'Notas'];
      const rows = medicalRecords.map(record => [
        record.id,
        record.visit_date ? new Date(record.visit_date).toLocaleDateString('es-GT') : 'N/A',
        record.patient_id,
        record.doctor_id,
        record.diagnosis,
        record.symptoms || 'N/A',
        record.treatment || 'N/A',
        record.notes || 'N/A'
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `registros_medicos_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert('Registros médicos descargados exitosamente');
    } catch (err) {
      console.error('Error descargando CSV:', err);
      alert('Error al descargar los datos');
    }
  };

  const downloadRecordPDF = async (record) => {
    try {
      alert(`Generando PDF para el registro médico #${record.id}...`);
    } catch (err) {
      console.error('Error generando PDF:', err);
      alert('Error al generar el PDF');
    }
  };

  const downloadChartAsPNG = async () => {
    try {
      const element = document.getElementById('consultations-chart');
      if (!element) {
        alert('No se pudo encontrar el gráfico');
        return;
      }

      const canvas = await html2canvas(element, { backgroundColor: '#ffffff', scale: 2 });
      const link = document.createElement('a');
      link.download = `consultas_mensuales_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      alert('Gráfico descargado exitosamente');
    } catch (err) {
      console.error('Error descargando gráfico:', err);
      alert('Error al descargar el gráfico');
    }
  };

  const calculateMonthlyStats = () => {
    const stats = {};
    medicalRecords.forEach(record => {
      if (record.visit_date) {
        const month = new Date(record.visit_date).toLocaleDateString('es-GT', { month: 'short' });
        stats[month] = (stats[month] || 0) + 1;
      }
    });

    return Object.entries(stats).map(([month, count]) => ({ mes: month, consultas: count }));
  };

  const monthlyData = calculateMonthlyStats();

  if (loading && medicalRecords.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando registros médicos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 font-medium">{error}</p>
          <button onClick={loadMedicalRecords} className="mt-2 text-sm text-red-600 hover:text-red-800 underline">
            Reintentar
          </button>
        </div>
      )}

      {/* Gestión y botones */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span>Gestión de Trazabilidad Médica</span>
          </h3>
          <div className="flex space-x-3">
            <button onClick={downloadRecordsCSV} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              <Download className="w-4 h-4" />
              <span>Descargar CSV</span>
            </button>
            <button onClick={() => openModal('create')} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Plus className="w-5 h-5" />
              <span>Nuevo Registro</span>
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Paciente</label>
            <input type="number" placeholder="Buscar por paciente..." value={filters.patient_id} onChange={(e) => setFilters({ ...filters, patient_id: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Médico</label>
            <input type="number" placeholder="Buscar por médico..." value={filters.doctor_id} onChange={(e) => setFilters({ ...filters, doctor_id: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div className="flex items-end space-x-2">
            <button onClick={applyFilters} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Aplicar</button>
            <button onClick={clearFilters} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">Limpiar</button>
          </div>
        </div>

        {/* Tabla de registros */}
        {medicalRecords.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay registros médicos</p>
            <button onClick={() => openModal('create')} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Crear Primer Registro
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID Paciente</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID Médico</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Diagnóstico</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tratamiento</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {medicalRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-700 flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{record.visit_date ? new Date(record.visit_date).toLocaleDateString('es-GT') : 'N/A'}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 flex items-center space-x-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span>{record.patient_id}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 flex items-center space-x-2">
                      <Stethoscope className="w-4 h-4 text-green-600" />
                      <span>{record.doctor_id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{record.diagnosis}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{record.treatment ? <span className="line-clamp-2">{record.treatment}</span> : <span className="text-gray-400">Sin tratamiento</span>}</td>
                    <td className="px-4 py-3 flex items-center space-x-2">
                      <button onClick={() => openModal('view', record)} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition" title="Ver detalles">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => openModal('edit', record)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition" title="Editar">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => downloadRecordPDF(record)} className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition" title="Descargar PDF">
                        <Download className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(record.id)} disabled={loading} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Total Consultas</h4>
          <p className="text-3xl font-bold text-gray-800">{medicalRecords.length}</p>
          <p className="text-sm text-green-600 mt-2">Registradas</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Pacientes Únicos</h4>
          <p className="text-3xl font-bold text-gray-800">{[...new Set(medicalRecords.map(r => r.patient_id))].length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Médicos Participantes</h4>
          <p className="text-3xl font-bold text-gray-800">{[...new Set(medicalRecords.map(r => r.doctor_id))].length}</p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="text-lg font-bold text-gray-800 mb-4">Consultas por Mes</h4>
        <div id="consultations-chart" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="consultas" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <button onClick={downloadChartAsPNG} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Descargar Gráfico
        </button>
      </div>
    </div>
  );
};
