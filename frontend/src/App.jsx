import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Páginas públicas
import Inicio from './components/pages/inicio';
import Unauthorized from './components/pages/Unauthorized';

// Dashboards por rol
import AdminDashboard from './components/pages/AdminDashboard';
import AuthorityDashboard from './components/pages/Muni';
import DoctorDashboard from './components/pages/Dashboard';
import PatientDashboard from './components/pages/Paciente';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Ruta pública - Inicio/Login */}
          <Route path="/" element={<Inicio />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Rutas protegidas para ADMIN */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas para AUTORIDADES */}
          <Route
            path="/authority/*"
            element={
              <ProtectedRoute allowedRoles={['authority']}>
                <AuthorityDashboard />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas para MÉDICOS */}
          <Route
            path="/doctor/*"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas para PACIENTES */}
          <Route
            path="/patient/*"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirección para rutas no encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;