export const mockData = {
  patient: {
    name: 'María García',
    childName: 'Lucas García',
    childAge: '3 años',
    phone: '+502 5555-1234',
    email: 'maria.garcia@email.com',
    address: 'Zona 10, Guatemala City',
    verified: true
  },
  nutritionHistory: [
    { date: '15 Sep 2025', peso: '14.2 kg', talla: '95 cm', estado: 'Normal', notas: 'Desarrollo adecuado' },
    { date: '15 Ago 2025', peso: '13.8 kg', talla: '93 cm', estado: 'Normal', notas: 'Ganancia de peso adecuada' },
    { date: '15 Jul 2025', peso: '13.5 kg', talla: '92 cm', estado: 'Alerta', notas: 'Revisar alimentación' }
  ],
  appointments: [
    { id: 1, type: 'Control Nutricional', date: '12 Oct 2025', time: '10:00 AM', status: 'programada', doctor: 'Dra. Ana López' },
    { id: 2, type: 'Visita Domiciliaria', date: '18 Oct 2025', time: '02:00 PM', status: 'programada', doctor: 'Enf. Carlos Ruiz' },
    { id: 3, type: 'Control de Seguimiento', date: '05 Sep 2025', time: '09:00 AM', status: 'completada', doctor: 'Dra. Ana López' }
  ],
  treatments: [
    { name: 'Suplemento Vitamínico', dosage: '5ml diarios', start: '01 Ago 2025', end: '01 Nov 2025', status: 'activo', progress: 65 },
    { name: 'Plan Alimenticio', dosage: 'Según guía', start: '15 Jul 2025', end: '15 Dic 2025', status: 'activo', progress: 50 }
  ],
  notifications: [
    { id: 1, type: 'cita', title: 'Recordatorio de Cita', message: 'Control nutricional el 12 de octubre a las 10:00 AM', date: '10 Oct 2025', read: false, priority: 'high' },
    { id: 2, type: 'visita', title: 'Visita Domiciliaria Programada', message: 'El equipo visitará su hogar el 18 de octubre a las 2:00 PM', date: '09 Oct 2025', read: false, priority: 'medium' },
    { id: 3, type: 'seguimiento', title: 'Actualización de Tratamiento', message: 'Por favor confirme que está siguiendo el plan alimenticio', date: '05 Oct 2025', read: true, priority: 'low' }
  ],
  educationalMaterials: [
    { id: 1, title: 'Alimentación Saludable 0-5 años', category: 'nutricion', duration: '5 min', icon: '🥗' },
    { id: 2, title: 'Higiene en la Preparación de Alimentos', category: 'higiene', duration: '4 min', icon: '🧼' },
    { id: 3, title: 'Prevención de Desnutrición Infantil', category: 'prevencion', duration: '6 min', icon: '🛡️' },
    { id: 4, title: 'Recetas Nutritivas para Niños', category: 'nutricion', duration: '10 min', icon: '👨‍🍳' },
    { id: 5, title: 'Señales de Alerta en el Desarrollo', category: 'prevencion', duration: '5 min', icon: '⚠️' }
  ]
};
