import React from 'react';

export default function LoginForm({ email, setEmail, password, setPassword }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        2. Ingresa tus datos
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-lg">
            Usuario o Correo
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
            placeholder="Escribe tu usuario"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-lg">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
            placeholder="Escribe tu contraseña"
          />
        </div>
      </div>
    </div>
  );
}