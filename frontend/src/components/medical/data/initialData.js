export const initialPatients = [
  {
    id: 1,
    nombre: 'María González',
    edad: 35,
    telefono: '+502 5555-1234',
    email: 'maria@ejemplo.com',
    direccion: '5ta Avenida 10-25, Zona 1',
    coordenadas: { lat: 14.6349, lng: -90.5069 },
    riesgo: 'alto',
    diagnostico: 'Desnutrición aguda severa',
    peso: 42,
    talla: 158,
    muac: 18.5,
    imc: 16.8,
    tratamiento: 'Suplementación RUTF',
    ultimaVisita: '2025-10-01',
    proximaVisita: '2025-10-10',
    historial: [
      { fecha: '2025-09-15', peso: 40, talla: 158, muac: 18.0, notas: 'Inicio de tratamiento' },
      { fecha: '2025-10-01', peso: 42, talla: 158, muac: 18.5, notas: 'Mejora gradual' }
    ],
    historialClinico: [
      {
        id: 1,
        fecha: '2025-09-15',
        tipo: 'consulta',
        medico: 'Dr. Juan Pérez',
        diagnostico: 'Desnutrición aguda severa',
        sintomas: 'Pérdida de peso severa, debilidad, fatiga',
        tratamiento: 'Suplementación RUTF, 3 sobres diarios',
        examenes: 'Hemograma completo, perfil nutricional',
        notas: 'Paciente presenta IMC de 16.0, requiere intervención inmediata.',
        proximaConsulta: '2025-09-29'
      }
    ]
  },
  {
    id: 2,
    nombre: 'Pedro Martínez',
    edad: 8,
    telefono: '+502 5555-5678',
    email: '',
    direccion: '3ra Calle 15-40, Zona 3',
    coordenadas: { lat: 14.6289, lng: -90.5159 },
    riesgo: 'medio',
    diagnostico: 'Desnutrición crónica moderada',
    peso: 20,
    talla: 115,
    muac: 16.0,
    imc: 15.1,
    tratamiento: 'Programa nutricional',
    ultimaVisita: '2025-09-28',
    proximaVisita: '2025-10-15',
    historial: [],
    historialClinico: []
  },
  {
    id: 3,
    nombre: 'Ana López',
    edad: 42,
    telefono: '+502 5555-9012',
    email: 'ana.lopez@ejemplo.com',
    direccion: '7ma Avenida 5-10, Zona 2',
    coordenadas: { lat: 14.6409, lng: -90.5129 },
    riesgo: 'bajo',
    diagnostico: 'Control nutricional',
    peso: 58,
    talla: 160,
    imc: 22.7,
    muac: 24.0,
    tratamiento: 'Seguimiento mensual',
    ultimaVisita: '2025-09-20',
    proximaVisita: '2025-10-20',
    historial: [],
    historialClinico: []
  }
];

export const initialVisits = [
  { id: 1, pacienteId: 1, fecha: '2025-10-10', hora: '09:00', estado: 'programada', confirmada: false },
  { id: 2, pacienteId: 2, fecha: '2025-10-15', hora: '14:00', estado: 'programada', confirmada: false }
];

export const initialAlerts = [
  { id: 1, tipo: 'critico', paciente: 'María González', mensaje: 'IMC crítico - Requiere atención inmediata', fecha: '2025-10-06' },
  { id: 2, tipo: 'recordatorio', paciente: 'Pedro Martínez', mensaje: 'Visita programada mañana', fecha: '2025-10-06' }
];