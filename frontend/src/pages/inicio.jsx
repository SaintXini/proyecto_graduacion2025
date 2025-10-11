import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, Heart, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../components/inicio/LoginScreen';
import HomePage from '../components/inicio/HomePage';

export default function Inicio() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, getDashboardByRole, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  // Si el usuario ya está autenticado, redirigir a su dashboard
  useEffect(() => {
    // Solo redirigir si estamos en la página de inicio "/"
    if (user && location.pathname === '/') {
      const dashboard = getDashboardByRole(user.role);
      navigate(`/${dashboard}`, { replace: true });
    }
  }, [user, navigate, getDashboardByRole, location.pathname]);

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-green-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto"></div>
          <p className="mt-4 text-white text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si ya está autenticado y estamos en "/", no mostrar nada (el useEffect redirigirá)
  if (user && location.pathname === '/') {
    return null;
  }

  const roles = [
    {
      id: 'administrador',
      name: 'Administrador',
      icon: Shield,
      color: 'bg-purple-600',
      description: 'Control total del sistema',
      bgImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80'
    },
    {
      id: 'autoridades',
      name: 'Autoridades Municipales',
      icon: Users,
      color: 'bg-blue-600',
      description: 'Gestión y supervisión',
      bgImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80'
    },
    {
      id: 'medicos',
      name: 'Médicos',
      icon: Heart,
      color: 'bg-red-600',
      description: 'Atención médica y diagnóstico',
      bgImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80'
    },
    {
      id: 'pacientes',
      name: 'Pacientes',
      icon: User,
      color: 'bg-green-600',
      description: 'Consulta tu información',
      bgImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&q=80'
    }
  ];

  return showLogin ? (
    <LoginScreen
      roles={roles}
      onBack={() => setShowLogin(false)}
    />
  ) : (
    <HomePage onLoginClick={() => setShowLogin(true)} />
  );
}
