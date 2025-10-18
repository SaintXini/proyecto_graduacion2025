// Frontend/src/components/medical/AppointmentsView.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Plus, Calendar, Clock, MapPin, User, Check, X, AlertCircle, Home } from 'lucide-react';
import { AppContext } from './context/AppContext';
import medicalApiService from '../../services/medicalApiService';

export const AppointmentsView = () => {
  const { patients, currentUser, loading: contextLoading } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  const [newAppointment, setNewAppointment] = useState({
    patient_id: '',
    doctor_id: currentUser?.id || '',
    appointment_date: '',
    duration_minutes: 30,
    appointment_type: 'consulta',
    reason: '',
    notes: '',
    location: '',
    is_home_visit: false
  });

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Cargar citas al montar el componente
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      console.log('🔵 Cargando citas...');
      
      const response = await medicalApiService.getAppointments();
      setAppointments(response);
      
      console.log('✅ Citas cargadas:', response.length);
    } catch (error) {
      console.error('❌ Error cargando citas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar slots disponibles cuando cambia la fecha
  useEffect(() => {
    if (selectedDate && newAppointment.doctor_id) {
      loadAvailableSlots();
    }
  }, [selectedDate, newAppointment.doctor_id]);

 const loadAvailableSlots = async () => {
  try {
    setLoadingSlots(true);
    console.log('📅 Cargando slots disponibles...');
    
    // SOLUCIÓN TEMPORAL: Generar slots en el frontend
    const slots = generateTimeSlots(selectedDate);
    setAvailableSlots(slots);
    console.log('✅ Slots generados:', slots.length);
  } catch (error) {
    console.error('❌ Error cargando slots:', error);
    setAvailableSlots([]);
  } finally {
    setLoadingSlots(false);
  }
};

// Agregar esta función antes del return
const generateTimeSlots = (date) => {
  const slots = [];
  const baseDate = new Date(date);
  
  // Horario de 8:00 AM a 5:00 PM
  for (let hour = 8; hour < 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const slotDate = new Date(baseDate);
      slotDate.setHours(hour, minute, 0, 0);
      
      // Solo agregar slots futuros
      if (slotDate > new Date()) {
        slots.push(slotDate.toISOString());
      }
    }
  }
  
  return slots;
};

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    
    if (!newAppointment.patient_id || !newAppointment.appointment_date) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    try {
      console.log('🔵 Creando cita:', newAppointment);
      
      const appointmentData = {
        ...newAppointment,
        patient_id: parseInt(newAppointment.patient_id),
        doctor_id: parseInt(newAppointment.doctor_id),
        duration_minutes: parseInt(newAppointment.duration_minutes)
      };
      
      await medicalApiService.createAppointment(appointmentData);
      
      alert('✅ Cita creada exitosamente');
      
      // Recargar citas
      await loadAppointments();
      
      // Cerrar modal y limpiar formulario
      setShowCreateModal(false);
      resetForm();
      
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error al crear cita: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      console.log('🔵 Actualizando estado de cita:', appointmentId, newStatus);
      
      await medicalApiService.updateAppointment(appointmentId, { status: newStatus });
      
      alert('✅ Estado actualizado');
      await loadAppointments();
      
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error al actualizar estado');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('¿Está seguro de cancelar esta cita?')) {
      return;
    }

    try {
      console.log('🔵 Cancelando cita:', appointmentId);
      
      await medicalApiService.cancelAppointment(appointmentId, {
        reason: 'Cancelada por el médico'
      });
      
      alert('✅ Cita cancelada');
      await loadAppointments();
      
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error al cancelar cita');
    }
  };

  const resetForm = () => {
    setNewAppointment({
      patient_id: '',
      doctor_id: currentUser?.id || '',
      appointment_date: '',
      duration_minutes: 30,
      appointment_type: 'consulta',
      reason: '',
      notes: '',
      location: '',
      is_home_visit: false
    });
    setSelectedDate('');
    setAvailableSlots([]);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setNewAppointment({...newAppointment, appointment_date: ''});
  };

  const handleSlotSelect = (slot) => {
    setNewAppointment({...newAppointment, appointment_date: slot});
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      case 'no_show': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'scheduled': return 'Programada';
      case 'confirmed': return 'Confirmada';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      case 'no_show': return 'No Asistió';
      default: return status;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'consulta': return 'bg-blue-50 text-blue-700';
      case 'seguimiento': return 'bg-green-50 text-green-700';
      case 'urgencia': return 'bg-red-50 text-red-700';
      case 'preventiva': return 'bg-purple-50 text-purple-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getTypeText = (type) => {
    switch(type) {
      case 'consulta': return 'Consulta';
      case 'seguimiento': return 'Seguimiento';
      case 'urgencia': return 'Urgencia';
      case 'preventiva': return 'Preventiva';
      default: return type;
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-GT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtrar citas
  const filteredAppointments = appointments.filter(appointment => {
    if (filterStatus !== 'all' && appointment.status !== filterStatus) return false;
    if (filterType !== 'all' && appointment.appointment_type !== filterType) return false;
    return true;
  });

  // Agrupar por estado
  const upcomingAppointments = filteredAppointments.filter(a => 
    ['scheduled', 'confirmed'].includes(a.status) && 
    new Date(a.appointment_date) >= new Date()
  );

  const pastAppointments = filteredAppointments.filter(a => 
    ['completed', 'cancelled', 'no_show'].includes(a.status) ||
    (new Date(a.appointment_date) < new Date() && ['scheduled', 'confirmed'].includes(a.status))
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Calendar className="w-8 h-8 text-blue-600 mr-3" />
            Citas Médicas
          </h2>
          <p className="text-gray-600 text-sm mt-1">Gestión de citas y horarios</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center hover:bg-blue-700 transition shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Cita
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Todas las citas</option>
              <option value="scheduled">Programadas</option>
              <option value="confirmed">Confirmadas</option>
              <option value="completed">Completadas</option>
              <option value="cancelled">Canceladas</option>
              <option value="no_show">No Asistió</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Cita
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Todos los tipos</option>
              <option value="consulta">Consulta</option>
              <option value="seguimiento">Seguimiento</option>
              <option value="urgencia">Urgencia</option>
              <option value="preventiva">Preventiva</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Próximas</p>
              <p className="text-2xl font-bold text-blue-800">{upcomingAppointments.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Confirmadas</p>
              <p className="text-2xl font-bold text-green-800">
                {appointments.filter(a => a.status === 'confirmed').length}
              </p>
            </div>
            <Check className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Hoy</p>
              <p className="text-2xl font-bold text-purple-800">
                {appointments.filter(a => {
                  const today = new Date().toDateString();
                  const appointmentDate = new Date(a.appointment_date).toDateString();
                  return today === appointmentDate;
                }).length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Esta Semana</p>
              <p className="text-2xl font-bold text-orange-800">
                {appointments.filter(a => {
                  const appointmentDate = new Date(a.appointment_date);
                  const today = new Date();
                  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                  return appointmentDate >= today && appointmentDate <= weekFromNow;
                }).length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando citas...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Citas Próximas */}
          {upcomingAppointments.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Citas Próximas ({upcomingAppointments.length})
              </h3>
              <div className="space-y-4">
                {upcomingAppointments.map(appointment => (
                  <div key={appointment.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <User className="w-5 h-5 text-gray-600" />
                          <h4 className="text-lg font-bold text-gray-800">
                            {appointment.patient_name || `Paciente #${appointment.patient_id}`}
                          </h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(appointment.appointment_type)}`}>
                            {getTypeText(appointment.appointment_type)}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="font-medium">{formatDateTime(appointment.appointment_date)}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Clock className="w-4 h-4 mr-2 text-gray-500" />
                          <span>Duración: {appointment.duration_minutes} minutos</span>
                        </div>

                        {appointment.is_home_visit && appointment.location && (
                          <div className="flex items-center text-sm text-green-600 mb-2">
                            <Home className="w-4 h-4 mr-2" />
                            <span className="font-medium">Visita Domiciliaria: {appointment.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {appointment.reason && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-3">
                        <p className="text-sm font-bold text-blue-800 mb-1">📋 Motivo:</p>
                        <p className="text-sm text-gray-900">{appointment.reason}</p>
                      </div>
                    )}

                    {appointment.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm font-bold text-gray-700 mb-1">📝 Notas:</p>
                        <p className="text-sm text-gray-900">{appointment.notes}</p>
                      </div>
                    )}

                    {appointment.patient_info && (
                      <div className="border-t pt-3 mt-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-gray-600">
                            <strong>Contacto:</strong> {appointment.patient_info.phone || 'N/A'}
                          </div>
                          <div className="text-gray-600">
                            <strong>Email:</strong> {appointment.patient_info.email}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Acciones */}
                    <div className="flex gap-2 mt-4">
                      {appointment.status === 'scheduled' && (
                        <button
                          onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition flex items-center"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Confirmar
                        </button>
                      )}
                      
                      {['scheduled', 'confirmed'].includes(appointment.status) && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                          >
                            Completar
                          </button>
                          
                          <button
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition flex items-center"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancelar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Citas Pasadas */}
          {pastAppointments.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-600" />
                Historial de Citas ({pastAppointments.length})
              </h3>
              <div className="space-y-4">
                {pastAppointments.slice(0, 10).map(appointment => (
                  <div key={appointment.id} className="bg-gray-50 rounded-lg shadow p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h5 className="font-bold text-gray-800">
                            {appointment.patient_name || `Paciente #${appointment.patient_id}`}
                          </h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(appointment.appointment_type)}`}>
                            {getTypeText(appointment.appointment_type)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDateTime(appointment.appointment_date)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredAppointments.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No hay citas registradas</p>
              <p className="text-gray-400 text-sm mt-2">
                Las citas médicas creadas aparecerán aquí
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Crear primera cita
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal crear cita */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Crear Nueva Cita</h3>
            
            <form onSubmit={handleCreateAppointment}>
              <div className="space-y-4">
                {/* Paciente */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paciente *
                  </label>
                  <select
                    value={newAppointment.patient_id}
                    onChange={(e) => setNewAppointment({...newAppointment, patient_id: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

                {/* Fecha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de la Cita *
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Horarios disponibles */}
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horario Disponible *
                    </label>
                    {loadingSlots ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-sm text-gray-600 mt-2">Cargando horarios...</p>
                      </div>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                        {availableSlots.map(slot => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => handleSlotSelect(slot)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                              newAppointment.appointment_date === slot
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                            }`}
                          >
                            {formatTime(slot)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-yellow-50 rounded-lg">
                        <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                        <p className="text-sm text-yellow-800">No hay horarios disponibles para esta fecha</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tipo de cita */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Cita *
                  </label>
                  <select
                    value={newAppointment.appointment_type}
                    onChange={(e) => setNewAppointment({...newAppointment, appointment_type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  >
                    <option value="consulta">Consulta General</option>
                    <option value="seguimiento">Seguimiento</option>
                    <option value="urgencia">Urgencia</option>
                    <option value="preventiva">Preventiva</option>
                  </select>
                </div>

                {/* Duración */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración (minutos)
                  </label>
                  <select
                    value={newAppointment.duration_minutes}
                    onChange={(e) => setNewAppointment({...newAppointment, duration_minutes: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="15">15 minutos</option>
                    <option value="30">30 minutos</option>
                    <option value="45">45 minutos</option>
                    <option value="60">60 minutos</option>
                  </select>
                </div>

                {/* Visita domiciliaria */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_home_visit"
                    checked={newAppointment.is_home_visit}
                    onChange={(e) => setNewAppointment({...newAppointment, is_home_visit: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="is_home_visit" className="ml-2 text-sm text-gray-700 flex items-center">
                    <Home className="w-4 h-4 mr-1 text-green-600" />
                    Visita Domiciliaria
                  </label>
                </div>

                {/* Ubicación (si es domiciliaria) */}
                {newAppointment.is_home_visit && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Ubicación
                    </label>
                    <input
                      type="text"
                      value={newAppointment.location}
                      onChange={(e) => setNewAppointment({...newAppointment, location: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Dirección de la visita"
                    />
                  </div>
                )}

                {/* Motivo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo de la Cita *
                  </label>
                  <textarea
                    value={newAppointment.reason}
                    onChange={(e) => setNewAppointment({...newAppointment, reason: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows="3"
                    required
                    placeholder="Describa el motivo de la consulta"
                  />
                </div>

                {/* Notas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas Adicionales
                  </label>
                  <textarea
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows="2"
                    placeholder="Notas u observaciones adicionales"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newAppointment.appointment_date}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Crear Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};