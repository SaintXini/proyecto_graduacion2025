import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = ({ roles, onBack }) => {
  const navigate = useNavigate();
  const { login, getDashboardByRole } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState(null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!selectedRole) {
      setError('Por favor selecciona un rol');
      return;
    }

    if (!credentials.email || !credentials.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔐 Iniciando proceso de login...');
      console.log('📧 Email:', credentials.email);
      console.log('🎭 Rol seleccionado:', selectedRole);
      
      // Llamar al login desde AuthContext
      const user = await login(credentials.email, credentials.password, selectedRole);
      
      console.log('✅ Login exitoso, usuario:', user);
      
      // Verificar que el token se guardó
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      console.log('💾 Token guardado:', savedToken ? 'SÍ' : 'NO');
      console.log('💾 Usuario guardado:', savedUser ? 'SÍ' : 'NO');
      
      if (!savedToken || !savedUser) {
        throw new Error('Error al guardar la sesión');
      }
      
      // Obtener el dashboard correspondiente al rol
      const dashboard = getDashboardByRole(user.role);
      console.log('🚀 Redirigiendo a:', dashboard);
      
      // Redirigir al dashboard correspondiente
      navigate(`/${dashboard}`, { replace: true });
      
    } catch (err) {
      console.error('❌ Error en login:', err);
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          <button
            onClick={onBack}
            className="mb-6 flex items-center text-white hover:text-gray-200 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </button>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Selecciona tu Rol
            </h1>
            <p className="text-xl text-white/90">
              Elige el rol con el que deseas acceder al sistema
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => {
                  console.log('🎭 Rol seleccionado:', role.id);
                  setSelectedRole(role.id);
                }}
                className="group relative overflow-hidden rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${role.bgImage})`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                </div>

                <div className="relative p-8 h-64 flex flex-col items-center justify-end text-white">
                  <div className={`${role.color} p-4 rounded-full mb-4 group-hover:scale-110 transition-transform`}>
                    <role.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{role.name}</h3>
                  <p className="text-sm text-white/80">{role.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentRole = roles.find((r) => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button
          onClick={() => {
            setSelectedRole(null);
            setError('');
            setCredentials({ email: '', password: '' });
          }}
          className="mb-6 flex items-center text-white hover:text-gray-200 transition"
          disabled={loading}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Cambiar rol
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className={`${currentRole.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4`}>
              <currentRole.icon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-gray-600">{currentRole.name}</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario o Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa tu usuario"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa tu contraseña"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${currentRole.color} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Problemas para acceder?{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Contactar soporte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;