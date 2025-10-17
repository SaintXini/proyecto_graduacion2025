import React, { useState, useEffect } from 'react';
import { Bell, AlertCircle, Send, CheckCircle } from 'lucide-react';
import authorityService from '../../services/authorityService';

const AlertasCoordinacion = () => {
  const [alertasActivas, setAlertasActivas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [historialComunicaciones, setHistorialComunicaciones] = useState([]);
  const [mensajeAlerta, setMensajeAlerta] = useState('');
  const [instituciones, setInstituciones] = useState([
    { id: 'centros_salud', nombre: 'Centros de Salud', conectado: true, seleccionado: true },
    { id: 'hospital', nombre: 'Hospital Regional', conectado: true, seleccionado: true },
    { id: 'ongs', nombre: 'ONGs Colaboradoras', conectado: true, seleccionado: true },
    { id: 'mspas', nombre: 'Ministerio de Salud', conectado: true, seleccionado: true }
  ]);

  useEffect(() => {
    loadAlertsData();
    loadCommunicationHistory();
  }, []);

  const loadAlertsData = async () => {
    try {
      setLoading(true);
      console.log('🚨 Cargando alertas activas...');
      
      const alerts = await authorityService.getActiveAlerts();
      setAlertasActivas(alerts);
      
      console.log('✅ Alertas cargadas:', alerts.length);
    } catch (error) {
      console.error('❌ Error cargando alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCommunicationHistory = async () => {
    try {
      // Cargar reportes de tipo 'alerta' como historial
      const reports = await authorityService.getAllReports({ report_type: 'alerta' });
      
      const history = reports.map(report => ({
        id: report.id,
        mensaje: report.title,
        destinatarios: report.data?.destinatarios?.join(', ') || 'Todas las instituciones',
        fecha: new Date(report.created_at),
        estado: 'Entregado'
      })).sort((a, b) => b.fecha - a.fecha);
      
      setHistorialComunicaciones(history);
      console.log('📜 Historial cargado:', history.length, 'comunicaciones');
    } catch (error) {
      console.error('❌ Error cargando historial:', error);
    }
  };

  const toggleInstitucion = (id) => {
    setInstituciones(instituciones.map(inst => 
      inst.id === id ? { ...inst, seleccionado: !inst.seleccionado } : inst
    ));
  };

  const enviarAlerta = async (mensaje, institucionesSeleccionadas) => {
    try {
      setSending(true);
      console.log('📢 Enviando alerta...', { mensaje, institucionesSeleccionadas });
      
      const result = await authorityService.sendAlert({
        title: 'Alerta del Sistema de Autoridades',
        message: mensaje || 'Actualización importante del sistema de salud comunitaria',
        type: 'coordinacion',
        priority: 'alta',
        recipients: institucionesSeleccionadas,
        data: {
          timestamp: new Date().toISOString(),
          origen: 'Dashboard de Autoridades'
        }
      });
      
      if (result.success) {
        // Agregar al historial inmediatamente
        const nuevaComunicacion = {
          id: result.alert_id,
          mensaje: mensaje || 'Alerta enviada',
          destinatarios: institucionesSeleccionadas.join(', '),
          fecha: new Date(),
          estado: 'Entregado'
        };
        
        setHistorialComunicaciones([nuevaComunicacion, ...historialComunicaciones]);
        
        alert(`✅ ${result.message}\n\n📧 Enviado a:\n${institucionesSeleccionadas.map(d => `• ${d}`).join('\n')}`);
        
        // Limpiar mensaje
        setMensajeAlerta('');
        
        // Recargar alertas
        await loadAlertsData();
      }
    } catch (error) {
      console.error('❌ Error enviando alerta:', error);
      alert('❌ Error al enviar la alerta. Por favor intente nuevamente.');
    } finally {
      setSending(false);
    }
  };

  const enviarActualizacion = async (institucion) => {
    const mensaje = `Actualización del estado del sistema de salud comunitaria - ${new Date().toLocaleDateString('es-GT')}`;
    await enviarAlerta(mensaje, [institucion]);
  };

  const enviarAlertaMasiva = async () => {
    const seleccionadas = instituciones.filter(i => i.seleccionado).map(i => i.nombre);
    
    if (seleccionadas.length === 0) {
      alert('⚠️ Debe seleccionar al menos una institución');
      return;
    }
    
    if (!mensajeAlerta.trim()) {
      alert('⚠️ Debe ingresar un mensaje para la alerta');
      return;
    }
    
    if (!confirm(`¿Enviar alerta a ${seleccionadas.length} institución(es)?\n\n${seleccionadas.join('\n')}`)) {
      return;
    }
    
    await enviarAlerta(mensajeAlerta, seleccionadas);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando alertas y coordinación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Alertas y Coordinación</h2>
        <p className="text-gray-600">
          Notificaciones de brotes críticos en tiempo real y comunicación con centros de salud y ONGs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas Activas */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-orange-600" />
              Alertas Activas
            </h3>
            <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-bold">
              {alertasActivas.length} Activas
            </span>
          </div>

          {alertasActivas.length === 0 ? (
            <div className="text-center py-8 text-green-600">
              <CheckCircle className="h-12 w-12 mx-auto mb-2" />
              <p className="font-medium">✅ Sin alertas activas</p>
              <p className="text-sm text-gray-500 mt-1">Todas las comunidades bajo control</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {alertasActivas.map((alerta, index) => (
                <div
                  key={alerta.id || index}
                  className="border-l-4 border-red-600 bg-red-50 p-4 rounded-lg"
                >
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-red-900">{alerta.title}</p>
                      <p className="text-sm text-red-700 mt-1">{alerta.message}</p>
                      <div className="mt-2 text-xs text-red-600">
                        <span className="font-medium">Comunidad:</span> {alerta.community_name}
                      </div>
                      <div className="text-xs text-red-600">
                        <span className="font-medium">Nivel:</span> {alerta.nivel} • 
                        <span className="ml-1">{alerta.casos} casos</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-red-600">
                          {new Date(alerta.created_at).toLocaleString('es-GT')}
                        </p>
                        <button
                          onClick={() => enviarAlerta(
                            `ALERTA: ${alerta.title} - ${alerta.message}`,
                            instituciones.filter(i => i.seleccionado).map(i => i.nombre)
                          )}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                        >
                          Notificar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coordinación Interinstitucional */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Coordinación Interinstitucional</h3>
          <div className="space-y-4">
            {instituciones.map((institucion) => (
              <div
                key={institucion.id}
                className={`border rounded-lg p-4 ${
                  institucion.seleccionado ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={institucion.seleccionado}
                      onChange={() => toggleInstitucion(institucion.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="font-semibold text-gray-900">{institucion.nombre}</span>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      institucion.conectado
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-400 text-white'
                    }`}
                  >
                    {institucion.conectado ? '● Conectado' : '○ Desconectado'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {institucion.id === 'centros_salud' && '6 centros en Sacatepéquez'}
                  {institucion.id === 'hospital' && 'Hospital Nacional de Antigua Guatemala'}
                  {institucion.id === 'ongs' && '4 organizaciones activas'}
                  {institucion.id === 'mspas' && 'Coordinación departamental'}
                </p>
                <button
                  onClick={() => enviarActualizacion(institucion.nombre)}
                  disabled={sending}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {sending ? 'Enviando...' : 'Enviar Actualización'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Envío Masivo de Alertas */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              <Bell className="h-8 w-8 mr-2" />
              Envío Masivo de Alertas
            </h3>
            <p className="text-red-100">
              Notificar a instituciones seleccionadas sobre situaciones críticas
            </p>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <label className="block text-sm font-medium text-red-100 mb-2">
            Instituciones seleccionadas: {instituciones.filter(i => i.seleccionado).length}
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {instituciones.filter(i => i.seleccionado).map(inst => (
              <span key={inst.id} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {inst.nombre}
              </span>
            ))}
          </div>
          
          <label className="block text-sm font-medium text-red-100 mb-2">
            Mensaje de la alerta:
          </label>
          <textarea
            value={mensajeAlerta}
            onChange={(e) => setMensajeAlerta(e.target.value)}
            placeholder="Escriba el mensaje de la alerta que desea enviar..."
            className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            rows="3"
          />
        </div>

        <button
          onClick={enviarAlertaMasiva}
          disabled={sending}
          className="w-full px-6 py-4 bg-white hover:bg-gray-100 text-red-600 rounded-lg transition-colors font-bold text-lg shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {sending ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600 mr-2"></div>
              Enviando Alerta...
            </>
          ) : (
            <>
              <Send className="h-6 w-6 mr-2" />
              Enviar Alerta a Instituciones Seleccionadas
            </>
          )}
        </button>
      </div>

      {/* Historial de Comunicaciones */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Historial de Comunicaciones</h3>
          <button
            onClick={loadCommunicationHistory}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            🔄 Actualizar
          </button>
        </div>

        {historialComunicaciones.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Send className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No hay comunicaciones registradas</p>
            <p className="text-sm mt-1">Las alertas enviadas aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-3">
            {historialComunicaciones.slice(0, 10).map((comunicacion, index) => (
              <div
                key={comunicacion.id || index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{comunicacion.mensaje}</p>
                    <p className="text-xs text-gray-500">
                      {comunicacion.fecha.toLocaleString('es-GT')} • {comunicacion.destinatarios}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-green-600 font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {comunicacion.estado}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instrucciones */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Instrucciones:</span> Seleccione las instituciones que desea notificar, 
              escriba el mensaje de la alerta y presione "Enviar". La notificación quedará registrada en el historial 
              y en el sistema de reportes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertasCoordinacion;