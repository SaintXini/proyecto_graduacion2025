import React, { useContext } from 'react';
import { AlertCircle, AlertTriangle, Info, Calendar, User, Phone, MapPin } from 'lucide-react';
import { AppContext } from './context/AppContext';
export const AlertsView = () => {
const { alerts, patients, communities, loading } = useContext(AppContext);
const getAlertIcon = (type) => {
switch(type) {
case 'urgent':
return <AlertCircle className="w-6 h-6 text-red-600" />;
case 'warning':
return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
default:
return <Info className="w-6 h-6 text-blue-600" />;
}
};
const getAlertColor = (type) => {
switch(type) {
case 'urgent':
return 'border-red-500 bg-red-50';
case 'warning':
return 'border-yellow-500 bg-yellow-50';
default:
return 'border-blue-500 bg-blue-50';
}
};
const getPriorityBadge = (type) => {
switch(type) {
case 'urgent':
return <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full"> URGENTE</span>;
case 'warning':
return <span className="bg-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full"> ADVERTENCIA</span>;
default:
return <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full"> INFO</span>;
}
};
const getPatientCommunity = (patientId) => {
const patient = patients.find(p => p.id === patientId);
if (!patient || !patient.communities || patient.communities.length === 0) {
return null;
}
const communityId = patient.communities[0];
return communities.find(c => c.id === communityId);
};
return (
<div>
<div className="mb-6">
<h2 className="text-2xl font-bold text-gray-800 flex items-center">
<AlertCircle className="w-8 h-8 text-red-600 mr-3" />
Alertas del Sistema
</h2>
<p className="text-gray-600 mt-2">
Pacientes que requieren atención prioritaria
</p>
{alerts.length > 0 && (
<div className="mt-4 inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-lg">
<AlertCircle className="w-5 h-5 mr-2" />
<span className="font-bold">{alerts.length}</span>
<span className="ml-2">alerta{alerts.length !== 1 ?'s' : ''} activa{alerts.length !== 1 ? 's' : ''}</span>
</div>
)}
</div>
{loading ? (
<div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
<div className="text-center">
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
<p className="mt-4 text-gray-600">Cargando alertas...</p>
</div>
</div>
) : (
<div className="space-y-4">
{alerts.length === 0 ? (
<div className="bg-white rounded-lg shadow p-8 text-center">
<div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
<svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round"/>
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
</div>
<p className="text-gray-500 text-lg font-medium">No hay alertas activas</p>
<p className="text-gray-400 text-sm mt-2">
 Excelente trabajo manteniendo el sistema monitoreado
</p>
<p className="text-gray-400 text-xs mt-1">
Las alertas de pacientes de alto riesgo aparecerán aquí automáticamente
</p>
</div>
) : (
alerts.map(alert => {
const patient = patients.find(p => p.id === alert.patient_id);
const community = getPatientCommunity(alert.patient_id);
return (
<div
key={alert.id}
className={`border-l-4 rounded-lg shadow-lg p-6 ${getAlertColor(alert.type)} hover:shadow-xl transition`}
>
<div className="flex items-start">
<div className="mr-4">
{getAlertIcon(alert.type)}
</div>
<div className="flex-1">
<div className="flex items-center justify-between mb-3">
<h3 className="text-lg font-bold text-gray-800">
Alerta Médica
</h3>
{getPriorityBadge(alert.type)}
</div>
{/* Información del paciente */}
<div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
<div className="flex items-center text-sm text-gray-700 mb-2">
<User className="w-5 h-5 mr-2 text-blue-600" />
<span className="font-bold text-lg">
{patient ? `${patient.first_name} ${patient.last_name}` : `Paciente #${alert.patient_id}`}
</span>
</div>
{patient && (
<div className="ml-7 space-y-1 text-sm">
<div className="flex items-center text-gray-600">
<span className="font-medium mr-2">CUI:</span>
<span>{patient.username}</span>
</div>
{patient.phone && (
<div className="flex items-center text-gray-600">
<Phone className="w-4 h-4 mr-2" />
<span className="font-medium mr-2">Teléfono:</span>
<a href={`tel:${patient.phone}`} className="text-blue-600 hover:underline">
{patient.phone}
</a>
</div>
)}
{patient.email && (
<div className="flex items-center text-gray-600">
<span className="font-medium mr-2">Email:</span>
<a href={`mailto:${patient.email}`} className="text-blue-600 hover:underline">
{patient.email}
</a>
</div>
)}
{community && (
<div className="flex items-center text-gray-600">
<MapPin className="w-4 h-4 mr-2 text-green-600" />
<span className="font-medium mr-2">Comunidad:</span>
<span>{community.name} - {community.location}</span>
</div>
)}
</div>
)}
</div>
{/* Motivo de la alerta */}
<div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
<p className="text-sm font-bold text-gray-700 mb-2 flex items-center">
<AlertCircle className="w-4 h-4 mr-2 text-red-600" />
Motivo de la Alerta:
</p>
<p className="text-gray-900 font-medium">{alert.message}</p>
</div>
{/* Fecha */}
{alert.date && (
<div className="flex items-center text-sm text-gray-600 mb-4">
<Calendar className="w-4 h-4 mr-2" />
<span>Fecha de registro: {new Date(alert.date).toLocaleDateString('es-GT', {
day: 'numeric',
month: 'long',
year: 'numeric',
hour: '2-digit',
minute: '2-digit'
})}</span>
</div>
)}
{/* Acciones */}
<div className="flex flex-wrap gap-3">
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition shadow">
 Ver Historial Médico
</button>
<button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition shadow">
 Nueva Consulta
</button>
{patient?.phone && (
<a
href={`tel:${patient.phone}`}
className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition shadow"
>
 Llamar
</a>
)}
<button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition">
✓ Marcar como Revisado
</button>
</div>
</div>
</div>
</div>
);
})
)}
</div>
)}
{/* Información adicional */}
{alerts.length > 0 && (
<div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
<div className="flex">
<Info className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
<div>
<h4 className="text-sm font-bold text-blue-900">Información Importante</h4>
<p className="text-sm text-blue-800 mt-1">
Las alertas se generan automáticamente cuando se detectan diagnósticos críticos, urgentes o de alto riesgo.
Revisa cada caso y toma las acciones necesarias lo antes posible.
</p>
</div>
</div>
</div>
)}
</div>
);
};