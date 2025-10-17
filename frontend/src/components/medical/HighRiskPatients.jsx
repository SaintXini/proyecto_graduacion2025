import React, { useContext } from 'react';
import { AlertCircle, Calendar, User, TrendingUp } from 'lucide-react';
import { AppContext } from './context/AppContext';
export const HighRiskPatients = () => {
const { patients, medicalRecords } = useContext(AppContext);
// Obtener pacientes con alertas críticas
const highRiskRecords = medicalRecords
.filter(r =>
r.diagnosis?.toLowerCase().includes('crítico') ||
r.diagnosis?.toLowerCase().includes('urgente') ||
r.diagnosis?.toLowerCase().includes('alto riesgo') ||
r.diagnosis?.toLowerCase().includes('desnutrición severa') ||
r.diagnosis?.toLowerCase().includes('desnutrición aguda')
)
.sort((a, b) => new Date(b.visit_date) -new Date(a.visit_date))
.slice(0, 5);
const getRiskLevel = (diagnosis) => {
const lowerDiag = diagnosis?.toLowerCase() || '';
if (lowerDiag.includes('crítico') || lowerDiag.includes('severa')) {
return { text: 'CRÍTICO', color: 'bg-red-600' };
}
if (lowerDiag.includes('urgente') || lowerDiag.includes('aguda')) {
return { text: 'URGENTE', color: 'bg-orange-600' };
}
return { text: 'ALTO RIESGO', color: 'bg-yellow-600' };
};
return (
<div className="bg-white rounded-xl shadow-lg p-6">
<div className="flex items-center justify-between mb-6">
<h3 className="text-xl font-bold text-gray-800 flex items-center">
<AlertCircle className="w-6 h-6 mr-2 text-red-500" />
Pacientes de Alto Riesgo
</h3>
{highRiskRecords.length > 0 && (
<span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">
{highRiskRecords.length} casos
</span>
)}
</div>
<div className="space-y-4">
{highRiskRecords.length === 0 ? (
<div className="text-center py-8">
<AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
<p className="text-gray-500 font-medium">No hay pacientes de alto riesgo</p>
<p className="text-xs text-gray-400 mt-1">
Excelente trabajo manteniendo la salud de la comunidad
</p>
</div>
) : (
highRiskRecords.map(record => {
const patient = patients.find(p => p.id === record.patient_id);
const riskLevel = getRiskLevel(record.diagnosis);
return (
<div
key={record.id}
className="border-l-4 border-red-500 pl-4 py-3 bg-red-50 rounded-r-lg hover:bg-red-100 transition-colors cursor-pointer"
>
<div className="flex items-start justify-between mb-2">
<div className="flex items-center">
<User className="w-4 h-4 text-gray-600 mr-2" />
<span className="font-semibold text-gray-800">
{patient ? `${patient.first_name} ${patient.last_name}` : `Paciente #${record.patient_id}`}
</span>
</div>
<span className={`${riskLevel.color} text-white text-xs font-bold px-2 py-1 rounded`}>
{riskLevel.text}
</span>
</div>
<div className="text-sm text-gray-700 mb-2 font-medium">
{record.diagnosis}
</div>
{record.symptoms && (
<div className="text-xs text-gray-600 mb-2">
<strong>Síntomas:</strong> {record.symptoms}
</div>
)}
<div className="flex items-center justify-between text-xs text-gray-500 mt-2">
<div className="flex items-center">
<Calendar className="w-3 h-3 mr-1" />
{new Date(record.visit_date).toLocaleDateString('es-GT', {
day: 'numeric',
month: 'short',
year: 'numeric'
})}
</div>
{patient?.phone && (
<span className="text-blue-600 font-medium">
 {patient.phone}
</span>
)}
</div>
{record.treatment && (
<div className="mt-2 pt-2 border-t border-red-200">
<div className="text-xs text-gray-600">
<strong className="text-green-700">Tratamiento:</strong>{' '}
<span className="text-gray-800">{record.treatment}</span>
</div>
</div>
)}
</div>
);
})
)}
</div>
{highRiskRecords.length > 0 && (
<div className="mt-6 pt-4 border-t">
<button className="w-full text-center text-sm text-red-600 hover:text-red-800 font-medium hover:bg-red-50 py-2 rounded-lg transition">
Ver todos los casos de alto riesgo →
</button>
</div>
)}
</div>
);
};