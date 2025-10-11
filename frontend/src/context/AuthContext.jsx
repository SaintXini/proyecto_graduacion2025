import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si hay sesión al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Error al verificar autenticación:', err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  /**
   * Login de usuario
   * @param {string} email - Email o username
   * @param {string} password - Contraseña
   * @param {string} roleId - ID del rol seleccionado
   */
  const login = async (email, password, roleId) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Intentando login con:', { email, roleId });
      
      const data = await authService.login(email, password);
      
      console.log('Respuesta del servidor:', data);
      
      // Verificar que el rol del usuario coincida con el seleccionado
      const roleMap = {
        'administrador': 'admin',
        'autoridades': 'authority',
        'medicos': 'doctor',
        'pacientes': 'patient'
      };
      
      const expectedRole = roleMap[roleId];
      
      console.log('Rol esperado:', expectedRole, 'Rol recibido:', data.user.role);
      
      if (data.user.role !== expectedRole) {
        throw new Error(`Credenciales inválidas para el rol seleccionado. Tu rol es: ${data.user.role}`);
      }
      
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error('Error en login:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Error al iniciar sesión';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Registro de nuevo usuario
   * @param {object} userData - Datos del usuario
   */
  const registerUser = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Registrando usuario:', userData);
      
      const data = await authService.register(userData);
      
      console.log('Usuario registrado:', data);
      
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error('Error en registro:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Error al registrar usuario';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout de usuario
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  /**
   * Obtener el dashboard según el rol del usuario
   * @param {string} role - Rol del usuario
   * @returns {string} Nombre del componente del dashboard
   */
  const getDashboardByRole = (role) => {
    const dashboards = {
      'admin': 'admin',
      'authority': 'muni',
      'doctor': 'medico',
      'patient': 'paciente'
    };
    
    return dashboards[role] || 'inicio';
  };

  // IMPORTANTE: Definir el objeto value después de todas las funciones
  const value = {
    user,
    loading,
    error,
    login,
    register: registerUser,  // Ahora está definido correctamente
    logout,
    getDashboardByRole,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};