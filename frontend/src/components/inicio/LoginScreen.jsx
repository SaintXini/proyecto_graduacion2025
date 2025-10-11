import React, { useState } from 'react';
import RoleButton from './RoleButton';
import LoginForm from './LoginForm';

export default function LoginScreen({ roles, onBack, onLogin }) {
  const [selectedRole, setSelectedRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const currentBg = selectedRole ? roles.find(r => r.id === selectedRole)?.bgImage : null;

  const handleLogin = () => {
    if (!selectedRole || !email || !password) {
      alert('Por favor completa todos los campos');
      return;
    }
    onLogin(selectedRole);
  };

  const handleBack = () => {
    setSelectedRole('');
    setEmail('');
    setPassword('');
    onBack();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 transition-all duration-700 ease-in-out">
        {currentBg ? (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
              style={{ backgroundImage: `url(${currentBg})` }}
            />
            <div className="absolute inset-0 bg-black/60" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600" />
        )}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={handleBack}
          className="mb-6 text-white hover:text-gray-200 font-semibold text-lg bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm"
        >
          ← Regresar
        </button>

        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Bienvenido al Sistema
            </h1>
            <p className="text-white text-lg">
              Ingresa tus datos para continuar
            </p>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                1. Selecciona tu rol
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {roles.map((role) => (
                  <RoleButton
                    key={role.id}
                    role={role}
                    isSelected={selectedRole === role.id}
                    onClick={() => setSelectedRole(role.id)}
                  />
                ))}
              </div>
            </div>

            <LoginForm 
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />

            <button
              onClick={handleLogin}
              disabled={!selectedRole || !email || !password}
              className={`w-full py-5 rounded-xl font-bold text-xl transition-all ${
                selectedRole && email && password
                  ? `${roles.find(r => r.id === selectedRole)?.color} text-white hover:shadow-xl hover:scale-105`
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {!selectedRole ? 'Primero selecciona tu rol' : 
               !email || !password ? 'Completa todos los campos' : 
               'Entrar al Sistema'}
            </button>

            <div className="mt-6 text-center">
              <button className="text-blue-600 hover:text-blue-800 font-semibold">
                ¿No puedes entrar? Contacta al administrador
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}