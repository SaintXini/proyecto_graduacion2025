import React, { useState } from 'react';
import { Users, Heart, Shield, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoginScreen from '../inicio/LoginScreen';
import HomePage from '../inicio/HomePage';
import { useAuth } from '../../context/AuthContext';

export default function Inicio() {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Si ya hay un usuario logueado, redirigir a su dashboard
  React.useEffect(() => {
    if (user) {
      redirectToDashboard(user.role);
    }
  }, [user]);

  /**
   * Mapeo de roles del frontend al backend
   */
  const roleMapping = {
    'administrador': 'admin',
    'autoridades': 'authority',
    'medicos': 'doctor',
    'pacientes': 'patient'
  };

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

  /**
   * Redirigir al dashboard según el rol
   */
  const redirectToDashboard = (role) => {
    switch (role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'authority':
        navigate('/authority/dashboard');
        break;
      case 'doctor':
        navigate('/doctor/dashboard');
        break;
      case 'patient':
        navigate('/patient/dashboard');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const handleLoginSuccess = (userData) => {
    // El contexto ya maneja el guardado del usuario
    redirectToDashboard(userData.role);
  };

  return showLogin ? (
    <LoginScreen
      roles={roles}
      roleMapping={roleMapping}
      onBack={() => setShowLogin(false)}
      onLoginSuccess={handleLoginSuccess}
    />
  ) : (
    <HomePage onLoginClick={() => setShowLogin(true)} />
  );
}
