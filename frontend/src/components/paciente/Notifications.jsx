import React from 'react';
import { Calendar, MapPin, FileText, RefreshCw } from 'lucide-react';

const Notifications = ({ notifications, setSelectedNotification, onRefresh }) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (onRefresh) await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  const handleNotificationClick = (notif) => {
    if (setSelectedNotification) {
      setSelectedNotification(notif);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Notificaciones y Recordatorios</h2>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay notificaciones
            </h3>
            <p className="text-gray-600">
              Tus notificaciones y recordatorios aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className={`p-4 rounded-lg border-l-4 cursor-pointer transition ${
                  notif.priority === 'high' 
                    ? 'border-red-500 bg-red-50 hover:bg-red-100' 
                    : notif.priority === 'medium' 
                    ? 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100' 
                    : 'border-blue-500 bg-blue-50 hover:bg-blue-100'
                } ${notif.read ? 'opacity-60' : ''}`}
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`rounded-full p-2 ${
                      notif.type === 'cita' 
                        ? 'bg-blue-500' 
                        : notif.type === 'visita' 
                        ? 'bg-purple-500' 
                        : 'bg-green-500'
                    }`}>
                      {notif.type === 'cita' && <Calendar className="w-5 h-5 text-white" />}
                      {notif.type === 'visita' && <MapPin className="w-5 h-5 text-white" />}
                      {notif.type === 'seguimiento' && <FileText className="w-5 h-5 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-gray-800">{notif.title}</h3>
                        {!notif.read && (
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{notif.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;