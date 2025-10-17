import React, { useContext } from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { AppContext } from './context/AppContext';

export const UpcomingVisits = () => {
    const { patients, medicalRecords, communities } = useContext(AppContext);

    // Obtener últimos registros médicos como visitas recientes
    const recentRecords = medicalRecords
        .sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date))
        .slice(0, 6);

    const getTimeAgo = (date) => {
        const now = new Date();
        const visitDate = new Date(date);
        const diffTime = Math.abs(now - visitDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Hoy';
        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return `Hace ${diffDays} días`;
        if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
        return `Hace ${Math.floor(diffDays / 30)} meses`;
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
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <Calendar className="w-6 h-6 mr-2 text-blue-500" />
                    Actividad Médica Reciente
                </h3>
                <span className="text-sm text-gray-500">
                    Últimas {recentRecords.length} consultas
                </span>
            </div>

            <div className="space-y-3">
                {recentRecords.length === 0 ? (
                    <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No hay consultas registradas</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Las consultas médicas recientes aparecerán aquí
                        </p>
                    </div>
                ) : (
                    recentRecords.map(record => {
                        const patient = patients.find(p => p.id === record.patient_id);
                        const community = getPatientCommunity(record.patient_id);
                        return (
                            <div
                                key={record.id}
                                className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors rounded-r-lg cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <User className="w-4 h-4 text-gray-600 mr-2" />
                                        <span className="font-semibold text-gray-800">
                                            {patient
                                                ? `${patient.first_name} ${patient.last_name}`
                                                : `Paciente #${record.patient_id}`}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500 flex items-center bg-white px-2 py-1 rounded">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {getTimeAgo(record.visit_date)}
                                    </span>
                                </div>

                                {community && (
                                    <div className="flex items-center text-xs text-gray-600 mb-2">
                                        <MapPin className="w-3 h-3 mr-1 text-green-600" />
                                        <span>{community.name} - {community.location}</span>
                                    </div>
                                )}

                                <div className="text-sm text-gray-700 mb-2">
                                    <strong className="text-gray-800">Fecha:</strong>{' '}
                                    {new Date(record.visit_date).toLocaleDateString('es-GT', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>

                                <div className="bg-white rounded p-2 mb-2">
                                    <div className="text-xs text-gray-600 mb-1">
                                        <strong className="text-gray-800">Diagnóstico:</strong>
                                    </div>
                                    <div className="text-sm text-gray-900">
                                        {record.diagnosis}
                                    </div>
                                </div>

                                {record.treatment && (
                                    <div className="text-xs text-blue-700 bg-blue-100 rounded px-2 py-1 mt-2">
                                        <strong className="font-medium">Tratamiento:</strong> {record.treatment}
                                    </div>
                                )}

                                {record.doctor_name && (
                                    <div className="text-xs text-gray-500 mt-2 flex items-center">
                                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        Atendido por: {record.doctor_name}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {recentRecords.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium hover:bg-blue-50 py-2 rounded-lg transition">
                        Ver historial completo →
                    </button>
                </div>
            )}
        </div>
    );
};
