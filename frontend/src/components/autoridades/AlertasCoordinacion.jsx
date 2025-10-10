import React from 'react';
import { Bell, AlertCircle } from 'lucide-react';
import { enviarAlerta } from './utils/reportUtils';

const AlertasCoordinacion = ({ alertasActivas }) => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Alertas y Coordinación</h2>
      <p className="text-gray-600">Notificaciones de brotes críticos y comunicación con centros de salud y ONGs.</p>
    </div>


    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-orange-600" />
            Alertas Activas
          </h3>
          <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-bold">
            {alertasActivas} Activas
          </span>
        </div>
        <div className="space-y-4">
          <div className="border-l-4 border-red-600 bg-red-50 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-red-900">Brote Crítico en Antigua Guatemala</p>
                <p className="text-sm text-red-700 mt-1">63 nuevos casos en las últimas 2 semanas. Requiere intervención inmediata.</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-red-600">Hace 2 horas</p>
                  <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-l-4 border-orange-600 bg-orange-50 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-orange-900">Recursos Insuficientes - San Miguel Dueñas</p>
                <p className="text-sm text-orange-700 mt-1">Necesidad de suministros nutricionales adicionales.</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-orange-600">Hace 5 horas</p>
                  <button className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded transition-colors">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-l-4 border-yellow-600 bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-yellow-900">Seguimiento Requerido - Alotenango</p>
                <p className="text-sm text-yellow-700 mt-1">Brigada médica programada para seguimiento.</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-yellow-600">Hace 1 día</p>
                  <button className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition-colors">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Coordinación Interinstitucional</h3>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">Centros de Salud</span>
              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Conectado</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">6 centros en Sacatepéquez</p>
            <button
              onClick={enviarAlerta}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm font-medium"
            >
              Enviar Actualización
            </button>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">Hospital Regional</span>
              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Conectado</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Hospital Nacional de Antigua Guatemala</p>
            <button
              onClick={enviarAlerta}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors text-sm font-medium"
            >
              Enviar Actualización
            </button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">ONGs Colaboradoras</span>
              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Conectado</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">4 organizaciones activas</p>
            <button
              onClick={enviarAlerta}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors text-sm font-medium"
            >
              Enviar Actualización
            </button>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">Ministerio de Salud</span>
              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Conectado</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Coordinación departamental</p>
            <button
              onClick={enviarAlerta}
              className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors text-sm font-medium"
            >
              Enviar Actualización
            </button>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-8 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-2">Envío Masivo de Alertas</h3>
          <p className="text-red-100">Notificar a todas las instituciones coordinadas sobre situaciones críticas</p>
        </div>
        <Bell className="h-16 w-16 text-red-300" />
      </div>
      <button
        onClick={enviarAlerta}
        className="mt-6 w-full px-6 py-4 bg-white hover:bg-gray-100 text-red-600 rounded-lg transition-colors font-bold text-lg shadow-lg"
      >
        Enviar Alerta General a Todos los Contactos
      </button>
    </div>

    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Historial de Comunicaciones</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Actualización enviada a Centros de Salud</p>
              <p className="text-xs text-gray-500">05/10/2025 - 14:30</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">Entregado</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Alerta crítica - Todas las instituciones</p>
              <p className="text-xs text-gray-500">05/10/2025 - 09:15</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">Entregado</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Reporte semanal enviado a MSPAS</p>
              <p className="text-xs text-gray-500">04/10/2025 - 16:00</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">Entregado</span>
        </div>
      </div>
    </div>
  </div>
);

export default AlertasCoordinacion;