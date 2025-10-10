// components/inicio/LoginScreen.jsx
import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ roles, roleMapping, onBack, onLoginSuccess }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError('');
    setCredentials({ username: '', password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔐 Intentando login...', {
      username: credentials.username,
      roleSeleccionado: selectedRole?.name,
      roleBackend: roleMapping[selectedRole?.id]
    });

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          role: roleMapping[selectedRole.id] // Enviar el rol mapeado
        }),
      });

      console.log('📡 Respuesta del servidor:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciales inválidas');
      }

      const data = await response.json();
      console.log('✅ Datos recibidos del backend:', data);

      // Verificar que tenemos token y user
      if (!data.token || !data.user) {
        throw new Error('Respuesta del servidor incompleta');
      }

      // Construir objeto de usuario
      const userData = {
        id: data.user.id,
        username: data.user.username || credentials.username,
        email: data.user.email,
        role: data.user.role,
        first_name: data.user.first_name,
        last_name: data.user.last_name
      };

      console.log('👤 Datos de usuario procesados:', userData);

      // Guardar en contexto (esto también guarda en localStorage)
      const loginSuccess = login(userData, data.token);

      if (!loginSuccess) {
        throw new Error('Error al guardar la sesión');
      }

      console.log('✅ Login exitoso. Usuario guardado en contexto.');

      // Esperar un momento para asegurar que se guardó
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verificar que se guardó en localStorage
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      console.log('🔍 Verificación final:', {
        tokenEnLocalStorage: !!savedToken,
        userEnLocalStorage: !!savedUser
      });

      if (!savedToken || !savedUser) {
        throw new Error('Error: Los datos no se guardaron en localStorage');
      }

      // AHORA SÍ, llamar a onLoginSuccess
      console.log('🎉 Todo OK. Redirigiendo...');
      onLoginSuccess(userData);

    } catch (err) {
      console.error('❌ Error en login:', err);
      setError(err.message || 'Error al iniciar sesión');
      
      // Limpiar datos si hay error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <button
            onClick={onBack}
            className="mb-8 flex items-center space-x-2 text-white hover:text-blue-200 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al inicio</span>
          </button>

          <h1 className="text-4xl font-bold text-white text-center mb-4">
            Selecciona tu Rol
          </h1>
          <p className="text-blue-100 text-center mb-12 text-lg">
            Elige el tipo de usuario para iniciar sesión
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className="group relative overflow-hidden bg-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="p-8 relative z-10">
                    <div className={`${role.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                      {role.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm text-center">
                      {role.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const Icon = selectedRole.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => setSelectedRole(null)}
          className="mb-8 flex items-center space-x-2 text-white hover:text-blue-200 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Cambiar rol</span>
        </button>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className={`${selectedRole.color} p-8 text-white text-center`}>
            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{selectedRole.name}</h2>
            <p className="text-white/90">{selectedRole.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usuario o Email
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa tu usuario o email"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    placeholder="Ingresa tu contraseña"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${selectedRole.color} text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Iniciar Sesión</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700"
                onClick={() => alert('Contacta al administrador del sistema')}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>
        </div>

        {/* Credenciales de prueba */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <p className="text-white text-sm text-center mb-2">Credenciales de prueba:</p>
          <p className="text-white/80 text-xs text-center">Usuario: admin | Contraseña: admin123</p>
        </div>
      </div>
    </div>
  );
}