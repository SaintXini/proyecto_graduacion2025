import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Eye, Download, Plus, Edit, Trash2, X, Save, Activity, User, Stethoscope, FileDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const TraceabilityTab = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]); // Lista completa de pacientes
  const [doctors, setDoctors] = useState([]);
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
    loadInitialData();
  }, []);

  // Efecto para filtrar pacientes cuando cambia el médico seleccionado
  useEffect(() => {
    filterPatientsByDoctor();
  }, [filters.doctor_id]);

  const loadInitialData = async () => {
    await Promise.all([
      loadMedicalRecords(),
      loadPatients(),
      loadDoctors()
    ]);
  };

  const loadPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users?role=patient`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(response.data);
      setAllPatients(response.data); // Guardar lista completa
      console.log('✅ Pacientes cargados:', response.data.length);
    } catch (err) {
      console.error('❌ Error cargando pacientes:', err);
    }
  };

  const loadDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users?role=doctor`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(response.data);
      console.log('✅ Médicos cargados:', response.data.length);
    } catch (err) {
      console.error('❌ Error cargando médicos:', err);
    }
  };

  // Filtrar pacientes según el médico seleccionado
  const filterPatientsByDoctor = async () => {
    if (!filters.doctor_id) {
      // Si no hay médico seleccionado, mostrar todos los pacientes
      setPatients(allPatients);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // Obtener registros médicos del médico seleccionado
      const response = await axios.get(`${API_URL}/traceability?doctor_id=${filters.doctor_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Extraer IDs únicos de pacientes que han sido atendidos por este médico
      const patientIds = [...new Set(response.data.map(record => record.patient_id))];
      
      // Filtrar la lista de pacientes
      const filteredPatients = allPatients.filter(patient => patientIds.includes(patient.id));
      
      setPatients(filteredPatients);
      console.log(`✅ Pacientes del médico ${filters.doctor_id}:`, filteredPatients.length);
    } catch (err) {
      console.error('❌ Error filtrando pacientes por médico:', err);
      setPatients(allPatients); // En caso de error, mostrar todos
    }
  };

  const handleDoctorFilterChange = (doctorId) => {
    setFilters({ 
      ...filters, 
      doctor_id: doctorId,
      patient_id: '' // Resetear selección de paciente
    });
  };

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

      console.log('📥 Cargando registros médicos desde:', url);
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Registros médicos cargados:', response.data);
      setMedicalRecords(response.data);
    } catch (err) {
      console.error('❌ Error cargando registros médicos:', err);
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

      const newRecord = response.data.record || response.data;
      setMedicalRecords([newRecord, ...medicalRecords]);
      setShowModal(false);
      resetForm();
      alert('Registro médico creado exitosamente');
      
      // Recargar para obtener nombres completos
      loadMedicalRecords();
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

      const updatedRecord = response.data.record || response.data;
      setMedicalRecords(medicalRecords.map(record => 
        record.id === selectedRecord.id ? updatedRecord : record
      ));
      setShowModal(false);
      resetForm();
      alert('Registro médico actualizado exitosamente');
      
      // Recargar para obtener nombres completos
      loadMedicalRecords();
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
    setPatients(allPatients); // Restaurar lista completa de pacientes
    loadMedicalRecords();
  };

  const downloadCompletePDFReport = async () => {
    try {
      setLoading(true);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // ===== PORTADA =====
      pdf.setFillColor(59, 130, 246);
      pdf.rect(0, 0, pageWidth, 60, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Reporte de Trazabilidad Médica', pageWidth / 2, 30, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Sistema de Salud Comunitaria - Guatemala', pageWidth / 2, 42, { align: 'center' });
      pdf.text(`Fecha: ${new Date().toLocaleDateString('es-GT', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`, pageWidth / 2, 52, { align: 'center' });

      yPosition = 80;
      pdf.setTextColor(0, 0, 0);

      // ===== RESUMEN EJECUTIVO =====
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(59, 130, 246);
      pdf.text('Resumen Ejecutivo', 15, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);

      const uniquePatients = [...new Set(medicalRecords.map(r => r.patient_id))].length;
      const uniqueDoctors = [...new Set(medicalRecords.map(r => r.doctor_id))].length;
      const avgRecordsPerDoctor = uniqueDoctors > 0 ? (medicalRecords.length / uniqueDoctors).toFixed(1) : 0;

      const summaryData = [
        ['Total de Registros Médicos:', medicalRecords.length],
        ['Pacientes Atendidos:', uniquePatients],
        ['Médicos Participantes:', uniqueDoctors],
        ['Promedio Consultas/Médico:', avgRecordsPerDoctor]
      ];

      summaryData.forEach(([label, value]) => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(label, 20, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(String(value), 120, yPosition);
        yPosition += 8;
      });

      // ===== GRÁFICA 1: CONSULTAS POR MES =====
      if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = 20;
      }

      yPosition += 10;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(59, 130, 246);
      pdf.text('Consultas por Mes', 15, yPosition);
      yPosition += 5;

      const chartElement1 = document.getElementById('consultations-chart');
      if (chartElement1) {
        const canvas1 = await html2canvas(chartElement1, { 
          backgroundColor: '#ffffff', 
          scale: 2 
        });
        const imgData1 = canvas1.toDataURL('image/png');
        const imgWidth1 = pageWidth - 30;
        const imgHeight1 = (canvas1.height * imgWidth1) / canvas1.width;
        
        pdf.addImage(imgData1, 'PNG', 15, yPosition, imgWidth1, Math.min(imgHeight1, 80));
        yPosition += Math.min(imgHeight1, 80) + 10;
      }

      // ===== NUEVA PÁGINA: DISTRIBUCIÓN POR DIAGNÓSTICO =====
      pdf.addPage();
      yPosition = 20;

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(59, 130, 246);
      pdf.text('Distribución por Diagnóstico', 15, yPosition);
      yPosition += 5;

      const diagnosisChart = document.getElementById('diagnosis-chart');
      if (diagnosisChart) {
        const canvas2 = await html2canvas(diagnosisChart, { 
          backgroundColor: '#ffffff', 
          scale: 2 
        });
        const imgData2 = canvas2.toDataURL('image/png');
        const imgWidth2 = pageWidth - 30;
        const imgHeight2 = (canvas2.height * imgWidth2) / canvas2.width;
        
        pdf.addImage(imgData2, 'PNG', 15, yPosition, imgWidth2, Math.min(imgHeight2, 90));
        yPosition += Math.min(imgHeight2, 90) + 10;
      }

      // ===== GRÁFICA 3: ACTIVIDAD POR MÉDICO =====
      if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = 20;
      }

      yPosition += 5;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(59, 130, 246);
      pdf.text('Actividad por Médico', 15, yPosition);
      yPosition += 5;

      const doctorChart = document.getElementById('doctor-activity-chart');
      if (doctorChart) {
        const canvas3 = await html2canvas(doctorChart, { 
          backgroundColor: '#ffffff', 
          scale: 2 
        });
        const imgData3 = canvas3.toDataURL('image/png');
        const imgWidth3 = pageWidth - 30;
        const imgHeight3 = (canvas3.height * imgWidth3) / canvas3.width;
        
        pdf.addImage(imgData3, 'PNG', 15, yPosition, imgWidth3, Math.min(imgHeight3, 80));
        yPosition += Math.min(imgHeight3, 80) + 10;
      }

      // ===== TABLA DE REGISTROS RECIENTES =====
      pdf.addPage();
      yPosition = 20;

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(59, 130, 246);
      pdf.text('Registros Médicos Recientes (Últimos 10)', 15, yPosition);
      yPosition += 10;

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      
      const headers = ['Fecha', 'Paciente', 'Médico', 'Diagnóstico'];
      const colWidths = [30, 50, 50, 55];
      let xPos = 15;
      
      headers.forEach((header, i) => {
        pdf.text(header, xPos, yPosition);
        xPos += colWidths[i];
      });
      
      yPosition += 5;
      pdf.setLineWidth(0.5);
      pdf.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 5;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);

      const recentRecords = medicalRecords.slice(0, 10);
      
      recentRecords.forEach((record, index) => {
        if (yPosition > pageHeight - 15) {
          pdf.addPage();
          yPosition = 20;
        }

        xPos = 15;
        const rowData = [
          record.visit_date ? new Date(record.visit_date).toLocaleDateString('es-GT') : 'N/A',
          (record.patient_name || `ID: ${record.patient_id}`).substring(0, 20),
          (record.doctor_name || `ID: ${record.doctor_id}`).substring(0, 20),
          record.diagnosis.substring(0, 25)
        ];

        rowData.forEach((data, i) => {
          pdf.text(data, xPos, yPosition);
          xPos += colWidths[i];
        });

        yPosition += 6;
      });

      // ===== PIE DE PÁGINA =====
      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(
          `Página ${i} de ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
        pdf.text(
          'Sistema de Salud Comunitaria - Guatemala',
          pageWidth - 15,
          pageHeight - 10,
          { align: 'right' }
        );
      }

      // ===== GUARDAR PDF =====
      pdf.save(`reporte_trazabilidad_${new Date().toISOString().split('T')[0]}.pdf`);
      alert('✅ Reporte PDF generado exitosamente con gráficas y estadísticas');
    } catch (err) {
      console.error('❌ Error generando PDF:', err);
      alert('Error al generar el reporte PDF');
    } finally {
      setLoading(false);
    }
  };

  const downloadRecordPDF = async (record) => {
    try {
      alert(`Generando PDF para el registro médico #${record.id}...\nPaciente: ${record.patient_name || 'ID: ' + record.patient_id}\nMédico: ${record.doctor_name || 'ID: ' + record.doctor_id}`);
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

  const calculateDiagnosisStats = () => {
    const diagnosisCount = {};
    medicalRecords.forEach(record => {
      const diagnosis = record.diagnosis || 'Sin diagnóstico';
      diagnosisCount[diagnosis] = (diagnosisCount[diagnosis] || 0) + 1;
    });

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    
    return Object.entries(diagnosisCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }));
  };

  const calculateDoctorActivity = () => {
    const doctorStats = {};
    medicalRecords.forEach(record => {
      const doctorName = record.doctor_name || `Doctor ID: ${record.doctor_id}`;
      doctorStats[doctorName] = (doctorStats[doctorName] || 0) + 1;
    });

    return Object.entries(doctorStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([doctor, consultas]) => ({ doctor, consultas }));
  };

  const monthlyData = calculateMonthlyStats();
  const diagnosisData = calculateDiagnosisStats();
  const doctorActivityData = calculateDoctorActivity();

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
            <button 
              onClick={downloadCompletePDFReport} 
              disabled={loading || medicalRecords.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileDown className="w-4 h-4" />
              <span>{loading ? 'Generando PDF...' : 'Descargar Reporte PDF'}</span>
            </button>
            <button 
              onClick={() => openModal('create')} 
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Nuevo Registro</span>
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Stethoscope className="w-4 h-4 inline mr-1" />
              Médico
            </label>
            <select
              value={filters.doctor_id} 
              onChange={(e) => handleDoctorFilterChange(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los médicos</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  Dr(a). {doctor.first_name} {doctor.last_name}
                </option>
              ))}
            </select>
            {filters.doctor_id && (
              <p className="text-xs text-blue-600 mt-1">
                Mostrando pacientes de este médico
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 inline mr-1" />
              Paciente
            </label>
            <select
              value={filters.patient_id} 
              onChange={(e) => setFilters({ ...filters, patient_id: e.target.value })} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={patients.length === 0}
            >
              <option value="">
                {filters.doctor_id 
                  ? (patients.length > 0 ? 'Todos los pacientes de este médico' : 'Este médico no tiene pacientes') 
                  : 'Todos los pacientes'}
              </option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.first_name} {patient.last_name}
                </option>
              ))}
            </select>
            {patients.length === 0 && filters.doctor_id && (
              <p className="text-xs text-orange-600 mt-1">
                Este médico aún no tiene pacientes registrados
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Fecha
            </label>
            <input 
              type="date" 
              value={filters.date} 
              onChange={(e) => setFilters({ ...filters, date: e.target.value })} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            />
          </div>
          
          <div className="flex items-end space-x-2">
            <button 
              onClick={applyFilters} 
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Aplicar
            </button>
            <button 
              onClick={clearFilters} 
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              title="Limpiar todos los filtros"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Tabla de registros */}
        {medicalRecords.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay registros médicos</p>
            <button 
              onClick={() => openModal('create')} 
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Crear Primer Registro
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Paciente</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Médico</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Diagnóstico</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tratamiento</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {medicalRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {record.visit_date ? new Date(record.visit_date).toLocaleDateString('es-GT') : 'N/A'}
                        </span>
                      </div>
                    </td>
                    
                    {/* PACIENTE - Muestra el nombre completo */}
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="font-medium">
                            {record.patient_name || `Paciente ID: ${record.patient_id}`}
                          </div>
                          {record.patient_info?.email && (
                            <div className="text-xs text-gray-500">{record.patient_info.email}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    {/* MÉDICO - Muestra el nombre completo */}
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="flex items-center space-x-2">
                        <Stethoscope className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="font-medium">
                            {record.doctor_name || `Doctor ID: ${record.doctor_id}`}
                          </div>
                          {record.doctor_info?.email && (
                            <div className="text-xs text-gray-500">{record.doctor_info.email}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {record.diagnosis}
                      </span>
                    </td>
                    
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {record.treatment ? (
                        <span className="line-clamp-2">{record.treatment}</span>
                      ) : (
                        <span className="text-gray-400">Sin tratamiento</span>
                      )}
                    </td>
                    
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal('view', record)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal('edit', record)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadRecordPDF(record)}
                          className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition"
                          title="Descargar PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
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

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Total Consultas</h4>
          <p className="text-3xl font-bold text-gray-800">{medicalRecords.length}</p>
          <p className="text-sm text-green-600 mt-2">Registradas</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Pacientes Únicos</h4>
          <p className="text-3xl font-bold text-gray-800">
            {[...new Set(medicalRecords.map(r => r.patient_id))].length}
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Médicos Participantes</h4>
          <p className="text-3xl font-bold text-gray-800">
            {[...new Set(medicalRecords.map(r => r.doctor_id))].length}
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Consultas por mes */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Consultas por Mes
          </h4>
          <div id="consultations-chart" style={{ height: 250 }}>
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
        </div>

        {/* Gráfico 2: Distribución por diagnóstico */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-green-600" />
            Distribución por Diagnóstico
          </h4>
          <div id="diagnosis-chart" style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={diagnosisData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => 
                    percent > 0 ? `${name.substring(0, 15)} ${(percent * 100).toFixed(0)}%` : ''
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {diagnosisData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gráfico 3: Actividad por médico */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Stethoscope className="w-5 h-5 mr-2 text-purple-600" />
          Actividad por Médico (Top 10)
        </h4>
        <div id="doctor-activity-chart" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={doctorActivityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="doctor" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="consultas" fill="#8B5CF6" name="Consultas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal para crear/editar/ver registro */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {modalMode === 'create' && 'Nuevo Registro Médico'}
                {modalMode === 'edit' && 'Editar Registro Médico'}
                {modalMode === 'view' && 'Detalles del Registro Médico'}
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
                    <User className="w-4 h-4 inline mr-1" />
                    Paciente *
                  </label>
                  {modalMode === 'view' ? (
                    <input
                      type="text"
                      value={selectedRecord?.patient_name || `ID: ${formData.patient_id}`}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  ) : (
                    <select
                      value={formData.patient_id}
                      onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                      disabled={modalMode === 'view'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">Seleccione un paciente</option>
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>
                          ID: {patient.id} - {patient.first_name} {patient.last_name} ({patient.email})
                        </option>
                      ))}
                    </select>
                  )}
                  {patients.length === 0 && modalMode !== 'view' && (
                    <p className="text-xs text-orange-600 mt-1">
                      No hay pacientes registrados
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Stethoscope className="w-4 h-4 inline mr-1" />
                    Médico *
                  </label>
                  {modalMode === 'view' ? (
                    <input
                      type="text"
                      value={selectedRecord?.doctor_name || `ID: ${formData.doctor_id}`}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  ) : (
                    <select
                      value={formData.doctor_id}
                      onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                      disabled={modalMode === 'view'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">Seleccione un médico</option>
                      {doctors.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>
                          ID: {doctor.id} - Dr(a). {doctor.first_name} {doctor.last_name} ({doctor.email})
                        </option>
                      ))}
                    </select>
                  )}
                  {doctors.length === 0 && modalMode !== 'view' && (
                    <p className="text-xs text-orange-600 mt-1">
                      No hay médicos registrados
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnóstico *
                </label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  disabled={modalMode === 'view'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Ej: Desnutrición leve"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Síntomas
                </label>
                <textarea
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  disabled={modalMode === 'view'}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Describa los síntomas presentados..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tratamiento
                </label>
                <textarea
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  disabled={modalMode === 'view'}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Describa el tratamiento recomendado..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas Adicionales
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  disabled={modalMode === 'view'}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Notas adicionales del médico..."
                />
              </div>

              {modalMode !== 'view' && (
                <p className="text-xs text-gray-500 mt-2">
                  * Campos obligatorios
                </p>
              )}

              {/* Información completa en modo vista */}
              {modalMode === 'view' && selectedRecord && (
                <div className="border-t border-gray-200 pt-4 mt-4 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 mb-3">Información Completa</h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium text-gray-600">Paciente:</span>
                      <p className="text-gray-800 mt-1">
                        {selectedRecord.patient_name || `ID: ${selectedRecord.patient_id}`}
                      </p>
                      {selectedRecord.patient_info?.phone && (
                        <p className="text-gray-500 text-xs">Tel: {selectedRecord.patient_info.phone}</p>
                      )}
                      {selectedRecord.patient_info?.email && (
                        <p className="text-gray-500 text-xs">{selectedRecord.patient_info.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-600">Médico:</span>
                      <p className="text-gray-800 mt-1">
                        {selectedRecord.doctor_name || `ID: ${selectedRecord.doctor_id}`}
                      </p>
                      {selectedRecord.doctor_info?.email && (
                        <p className="text-gray-500 text-xs">{selectedRecord.doctor_info.email}</p>
                      )}
                    </div>
                  </div>

                  {selectedRecord.prescriptions && selectedRecord.prescriptions.length > 0 && (
                    <div className="mt-4">
                      <span className="font-medium text-gray-600 block mb-2">Prescripciones:</span>
                      <ul className="space-y-2">
                        {selectedRecord.prescriptions.map((prescription, idx) => (
                          <li key={idx} className="bg-white p-3 rounded border border-gray-200">
                            <p className="font-medium text-gray-800">{prescription.medication_name}</p>
                            <p className="text-sm text-gray-600">
                              Dosis: {prescription.dosage} - {prescription.frequency}
                            </p>
                            {prescription.duration && (
                              <p className="text-sm text-gray-600">Duración: {prescription.duration}</p>
                            )}
                            {prescription.instructions && (
                              <p className="text-xs text-gray-500 mt-1">{prescription.instructions}</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 text-xs text-gray-500">
                    <p>Fecha de consulta: {selectedRecord.visit_date ? new Date(selectedRecord.visit_date).toLocaleString('es-GT') : 'N/A'}</p>
                    <p>Registro creado: {selectedRecord.created_at ? new Date(selectedRecord.created_at).toLocaleString('es-GT') : 'N/A'}</p>
                  </div>
                </div>
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
                  <span>
                    {loading ? 'Guardando...' : (modalMode === 'create' ? 'Crear Registro' : 'Actualizar Registro')}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};