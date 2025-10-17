import React, { useContext, useState } from 'react';
import { MapPin, Calendar, Clock, User, Home, Plus, Navigation, AlertCircle } from 'lucide-react';
import { AppContext } from './context/AppContext';

export const VisitsView = () => {
    const { patients, medicalRecords, communities, loading } = useContext(AppContext);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Obtener visitas basadas en registros médicos con ubicación
    const visits = medicalRecords.map(record => {
        const patient = patients.find(p => p.id === record.patient_id);

        // Obtener la comunidad del paciente
        let community = null;
        if (patient?.communities && patient.communities.length > 0) {
            const communityId = patient.communities[0];
            community = communities.find(c => c.id === communityId);
        }

        return {
            id: record.id,
            patient: patient,
            community: community,
            date: record.visit_date,
            diagnosis: record.diagnosis,
            treatment: record.treatment,
            doctor: record.doctor_name,
            symptoms: record.symptoms,
            notes: record.notes
        };
    });

    // Separar visitas con y sin ubicación
    const visitsWithLocation = visits.filter(v => v.community);
    const visitsWithoutLocation = visits.filter(v => !v.community);
    const upcomingVisits = visitsWithLocation.filter(v => new Date(v.date) >= new Date());
    const pastVisits = visitsWithLocation.filter(v => new Date(v.date) < new Date());

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Home className="w-8 h-8 text-blue-600 mr-3" />
                        Visitas Domiciliarias
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Gestión de visitas médicas en comunidades
                    </p>
                </div>
            </div>

            {/* Alerta si hay registros sin ubicación */}
            {visitsWithoutLocation.length > 0 && (
                <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-yellow-900">Registros sin ubicación</h4>
                            <p className="text-sm text-yellow-800 mt-1">
                                Hay {visitsWithoutLocation.length} registro{visitsWithoutLocation.length !== 1 ? 's' : ''} médico{visitsWithoutLocation.length !== 1 ? 's' : ''} sin comunidad asignada.
                                Asigna una comunidad a los pacientes para que sus consultas aparezcan aquí.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total de Visitas</p>
                            <p className="text-3xl font-bold text-gray-800">{visits.length}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Home className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Con Ubicación</p>
                            <p className="text-3xl font-bold text-green-800">{visitsWithLocation.length}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <MapPin className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Sin Ubicación</p>
                            <p className="text-3xl font-bold text-yellow-800">{visitsWithoutLocation.length}</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <AlertCircle className="w-8 h-8 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Comunidades</p>
                            <p className="text-3xl font-bold text-purple-800">
                                {new Set(visitsWithLocation.map(v => v.community?.id).filter(Boolean)).size}
                            </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <Navigation className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando visitas...</p>
                    </div>
                </div>
            ) : visitsWithLocation.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                        <Home className="w-10 h-10 text-blue-600" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium">No hay visitas domiciliarias registradas</p>
                    <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
                        Las visitas aparecen automáticamente cuando registras una consulta médica de un paciente que tiene una comunidad asignada.
                    </p>
                    <div className="mt-6 bg-blue-50 rounded-lg p-4 max-w-lg mx-auto">
                        <p className="text-sm text-blue-800 font-medium mb-2"> ¿Cómo generar visitas?</p>
                        <ol className="text-sm text-blue-700 text-left space-y-2">
                            <li>1. Crea o edita un paciente y asígnale una comunidad</li>
                            <li>2. Registra una consulta médica para ese paciente</li>
                            <li>3. La visita aparecerá automáticamente aquí</li>
                        </ol>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Visitas por comunidad */}
                    {communities.filter(c => visitsWithLocation.some(v => v.community?.id === c.id)).map(community => {
                        const communityVisits = visitsWithLocation.filter(v => v.community?.id === community.id);
                        return (
                            <div key={community.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                                    <div className="flex items-center justify-between text-white">
                                        <div className="flex items-center">
                                            <MapPin className="w-6 h-6 mr-3" />
                                            <div>
                                                <h3 className="text-lg font-bold">{community.name}</h3>
                                                <p className="text-sm opacity-90">{community.location}</p>
                                                {community.population && (
                                                    <p className="text-xs opacity-75 mt-1">Población: {community.population} habitantes</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold">{communityVisits.length}</p>
                                            <p className="text-sm opacity-90">visitas</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    {communityVisits.slice(0, 5).map(visit => (
                                        <div key={visit.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg hover:bg-blue-100 transition">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center">
                                                    <User className="w-5 h-5 text-gray-600 mr-2" />
                                                    <span className="font-bold text-gray-800">
                                                        {visit.patient ? `${visit.patient.first_name} ${visit.patient.last_name}` : 'Paciente desconocido'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600 bg-white px-2 py-1 rounded">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    {new Date(visit.date).toLocaleDateString('es-GT')}
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-lg p-3 mb-2">
                                                <p className="text-sm font-bold text-gray-700 mb-1"> Diagnóstico:</p>
                                                <p className="text-sm text-gray-900">{visit.diagnosis}</p>
                                            </div>

                                            {visit.symptoms && (
                                                <div className="text-xs text-gray-600 bg-yellow-50 rounded px-2 py-1 mb-1">
                                                    <strong>Síntomas:</strong> {visit.symptoms}
                                                </div>
                                            )}

                                            {visit.treatment && (
                                                <div className="text-xs text-gray-600 bg-green-50 rounded px-2 py-1 mb-1">
                                                    <strong>Tratamiento:</strong> {visit.treatment}
                                                </div>
                                            )}

                                            {visit.doctor && (
                                                <div className="text-xs text-gray-500 mt-2">
                                                    Atendido por: {visit.doctor}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {communityVisits.length > 5 && (
                                        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2 hover:bg-blue-50 rounded-lg transition">
                                            Ver todas las {communityVisits.length} visitas →
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
