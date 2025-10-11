import React, { useState } from 'react';
import { Users, Heart, Shield, User } from 'lucide-react';
import LoginScreen from '../components/inicio/LoginScreen';
import HomePage from '../components/inicio/HomePage';

export default function App() {
  const [showLogin, setShowLogin] = useState(false);

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

  const handleLogin = (role) => {
    alert(`Bienvenido/a ${roles.find(r => r.id === role)?.name}`);
  };

  return showLogin ? (
    <LoginScreen 
      roles={roles}
      onBack={() => setShowLogin(false)}
      onLogin={handleLogin}
    />
  ) : (
    <HomePage onLoginClick={() => setShowLogin(true)} />
  );
}