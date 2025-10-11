import React, { useState } from 'react';
import Muni from './pages/muni';
import Inicio from './pages/inicio';
import PatientDashboard from './pages/Paciente'; // import correcto
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [pagina, setPagina] = useState('inicio'); // controla qué página mostrar

  return (
    <div>
      <nav>
        <button onClick={() => setPagina('inicio')}>Inicio</button>
        <button onClick={() => setPagina('admin')}>Administrador</button>
        <button onClick={() => setPagina('muni')}>Municipalidad</button>
        <button onClick={() => setPagina('paciente')}>Paciente</button>
        <button onClick={() => setPagina('medico')}>medico</button>

      </nav>

      {pagina === 'inicio' && <Inicio />}
      {pagina === 'admin' && <AdminDashboard />}
      {pagina === 'muni' && <Muni />}
      {pagina === 'paciente' && <PatientDashboard />}
      {pagina === 'medico' && <Dashboard />}

    </div>
  );
}
