export const initialUsers = [
  { 
    id: 1, 
    cui: '2894567890101', 
    nombre: 'Juan', 
    apellidos: 'Pérez García', 
    email: 'juan.perez@hospital.gt', 
    telefono: '50231234567', 
    rol: 'medico', 
    activo: true, 
    password: 'Med2024!' 
  },
  { 
    id: 2, 
    cui: '2756789012345', 
    nombre: 'María', 
    apellidos: 'López Mendoza', 
    email: 'maria.lopez@salud.gob.gt', 
    telefono: '50298765432', 
    rol: 'autoridad', 
    activo: true, 
    password: 'Auth2024!' 
  },
  { 
    id: 3, 
    cui: '2834567123456', 
    nombre: 'Carlos', 
    apellidos: 'Ramírez Torres', 
    email: 'carlos.ramirez@admin.gt', 
    telefono: '50245678901', 
    rol: 'admin', 
    activo: false, 
    password: 'Admin2024!' 
  },
];

export const initialCommunities = [
  { id: 1, nombre: 'San Juan Sacatepéquez', departamento: 'Guatemala', poblacion: 35000, medicos: 5 },
  { id: 2, nombre: 'Chimaltenango Centro', departamento: 'Chimaltenango', poblacion: 28000, medicos: 4 },
  { id: 3, nombre: 'Sololá', departamento: 'Sololá', poblacion: 42000, medicos: 6 },
];

export const initialNutritionData = [
  { id: 1, alimento: 'Frijol Negro', calorias: 132, proteina: 8.9, categoria: 'Leguminosas' },
  { id: 2, alimento: 'Maíz', calorias: 86, proteina: 3.3, categoria: 'Cereales' },
  { id: 3, alimento: 'Incaparina', calorias: 380, proteina: 18, categoria: 'Suplementos' },
];

export const initialTraceability = [
  { id: 1, medico: 'Juan Pérez García', paciente: 'Ana Hernández', fecha: '2025-10-03', diagnostico: 'Desnutrición leve', tratamiento: 'Suplemento alimenticio' },
  { id: 2, medico: 'Juan Pérez García', paciente: 'Pedro Gómez', fecha: '2025-10-02', diagnostico: 'Control de peso', tratamiento: 'Plan nutricional' },
  { id: 3, medico: 'María López Mendoza', paciente: 'Sofía Martínez', fecha: '2025-10-01', diagnostico: 'Evaluación preventiva', tratamiento: 'Seguimiento mensual' },
];

export const activityData = [
  { mes: 'May', usuarios: 45, alertas: 12, consultas: 120 },
  { mes: 'Jun', usuarios: 52, alertas: 8, consultas: 145 },
  { mes: 'Jul', usuarios: 58, alertas: 15, consultas: 168 },
  { mes: 'Ago', usuarios: 64, alertas: 10, consultas: 192 },
  { mes: 'Sep', usuarios: 71, alertas: 7, consultas: 215 },
  { mes: 'Oct', usuarios: 78, alertas: 5, consultas: 234 },
];

export const userActivityData = [
  { accion: 'Inicio Sesión', cantidad: 45 },
  { accion: 'Crear Paciente', cantidad: 32 },
  { accion: 'Actualizar Datos', cantidad: 28 },
  { accion: 'Generar Reporte', cantidad: 15 },
];

export const roleDistribution = [
  { name: 'Médicos', value: 45, color: '#3b82f6' },
  { name: 'Autoridades', value: 12, color: '#8b5cf6' },
  { name: 'Admins', value: 8, color: '#ec4899' },
];