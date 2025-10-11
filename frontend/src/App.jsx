import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Páginas
import Inicio from './pages/Inicio';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import Muni from './pages/muni';
import PatientDashboard from './pages/Paciente';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        {/* 🔧 Navegación de prueba (solo para desarrollo) */}
        <nav style={{ padding: '10px', backgroundColor: '#eee' }}>
          <strong>Modo desarrollo:</strong>{" "}
          <Link to="/">Inicio</Link> |{" "}
          <Link to="/admin">Admin</Link> |{" "}
          <Link to="/muni">Muni</Link> |{" "}
          <Link to="/medico">Médico</Link> |{" "}
          <Link to="/paciente">Paciente</Link>
        </nav>

        <Routes>
          {/* Ruta pública */}
          <Route path="/" element={<Inicio />} />

          {/* Rutas protegidas */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/muni" 
            element={
              <ProtectedRoute allowedRoles={['authority']}>
                <Muni />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/medico" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/paciente" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
