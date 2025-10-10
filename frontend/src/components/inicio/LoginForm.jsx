import React from 'react';
import { Mail, Lock, User } from 'lucide-react';

export default function LoginForm({ username, setUsername, password, setPassword }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        2. Ingresa tus credenciales
      </h2>
      
      <div className="space-y-4">
        {/* Campo de usuario/email */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Usuario o Email
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario o email"
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
            />
          </div>
        </div>

        {/* Campo de contraseña */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}