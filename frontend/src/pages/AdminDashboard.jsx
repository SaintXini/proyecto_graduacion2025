import React, { useState, useEffect } from 'react';
import { Header } from '../components/adminpage/Header';
import { Navigation } from '../components/adminpage/Navigation';
import { Footer } from '../components/adminpage/Footer';
import { DashboardTab } from '../components/adminpage/DashboardTab';
import { CommunitiesTab } from '../components/adminpage/CommunitiesTab';
import { NutritionTab } from '../components/adminpage/NutritionTab';
import { TraceabilityTab } from '../components/adminpage/TraceabilityTab';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  userService, 
  communityService, 
  nutritionService, 
  traceabilityService 
} from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para datos
  const [users, setUsers] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [nutritionData, setNutritionData] = useState([]);
  const [traceability, setTraceability] = useState([]);

  // Estados para el formulario de usuario
  const [showPassword, setShowPassword] = useState({});
  const [newUser, setNewUser] = useState({
    cui: '',
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    password: '',
    rol: 'doctor'
  });

  // Verificar autenticación antes de cargar datos
  useEffect(() => {
    console.log('🔍 [AdminDashboard] Verificando autenticación...');
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (!token || !savedUser) {
      console.error('❌ [AdminDashboard] No hay token o usuario, redirigiendo...');
      navigate('/', { replace: true });
      return;
    }
    
    console.log('✅ [AdminDashboard] Token disponible, cargando datos...');
    loadInitialData();
  }, []); // Solo se ejecuta una vez al montar

  const loadInitialData = async () => {
    console.log('📊 [AdminDashboard] Iniciando carga de datos...');
    
    // Verificar token nuevamente
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ [AdminDashboard] Token no disponible');
      setError('Sesión no válida');
      navigate('/', { replace: true });
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔑 [AdminDashboard] Token presente:', token.substring(0, 20) + '...');
      
      // Cargar todos los datos en paralelo con manejo individual de errores
      const results = await Promise.allSettled([
        userService.getAll(),
        communityService.getAll(),
        nutritionService.getAll(),
        traceabilityService.getAll()
      ]);
      
      // Procesar resultados
      const [usersResult, communitiesResult, nutritionResult, traceabilityResult] = results;
      
      if (usersResult.status === 'fulfilled') {
        setUsers(usersResult.value || []);
        console.log('✅ [AdminDashboard] Usuarios cargados:', usersResult.value?.length);
      } else {
        console.error('❌ [AdminDashboard] Error cargando usuarios:', usersResult.reason);
        // Si falla cargar usuarios, es probable que sea un problema de autenticación
        if (usersResult.reason?.response?.status === 401) {
          console.error('🔒 [AdminDashboard] Error 401 - Token inválido');
          setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
          setTimeout(() => {
            localStorage.clear();
            navigate('/', { replace: true });
          }, 2000);
          return;
        }
      }
      
      if (communitiesResult.status === 'fulfilled') {
        setCommunities(communitiesResult.value || []);
        console.log('✅ [AdminDashboard] Comunidades cargadas:', communitiesResult.value?.length);
      } else {
        console.error('❌ [AdminDashboard] Error cargando comunidades:', communitiesResult.reason);
      }
      
      if (nutritionResult.status === 'fulfilled') {
        setNutritionData(nutritionResult.value || []);
        console.log('✅ [AdminDashboard] Datos de nutrición cargados:', nutritionResult.value?.length);
      } else {
        console.error('❌ [AdminDashboard] Error cargando nutrición:', nutritionResult.reason);
      }
      
      if (traceabilityResult.status === 'fulfilled') {
        setTraceability(traceabilityResult.value || []);
        console.log('✅ [AdminDashboard] Trazabilidad cargada:', traceabilityResult.value?.length);
      } else {
        console.error('❌ [AdminDashboard] Error cargando trazabilidad:', traceabilityResult.reason);
      }
      
    } catch (err) {
      console.error('❌ [AdminDashboard] Error general cargando datos:', err);
      setError('Error al cargar los datos del sistema');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FUNCIONES DE GESTIÓN DE USUARIOS
  // ============================================
  const handleCreateUser = async () => {
    // Validar campos obligatorios
    if (!newUser.cui || !newUser.nombre || !newUser.apellidos || !newUser.email || !newUser.password) {
      alert('Por favor complete todos los campos obligatorios (CUI, Nombre, Apellidos, Email, Contraseña)');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      alert('Por favor ingrese un email válido');
      return;
    }

    // Validar longitud de contraseña
    if (newUser.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      // Mapear el rol del frontend al formato del backend
      const roleMap = {
        'medico': 'doctor',
        'autoridad': 'authority',
        'admin': 'admin',
        'paciente': 'patient'
      };

      const userData = {
        cui: newUser.cui,
        nombre: newUser.nombre,
        apellidos: newUser.apellidos,
        email: newUser.email,
        telefono: newUser.telefono,
        password: newUser.password,
        role: roleMap[newUser.rol] || newUser.rol,
        activo: true
      };

      const createdUser = await userService.create(userData);

      // Agregar el nuevo usuario a la lista
      setUsers([...users, createdUser]);

      // Limpiar formulario
      setNewUser({
        cui: '',
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        password: '',
        rol: 'medico'
      });

      alert('Usuario creado exitosamente');
    } catch (err) {
      console.error('Error creando usuario:', err);
      const errorMsg = err.response?.data?.message || 'Error al crear usuario';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    setLoading(true);
    try {
      const updatedUser = await userService.update(userId, {
        ...user,
        activo: !user.activo
      });

      // Actualizar el usuario en la lista
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
    } catch (err) {
      console.error('Error actualizando usuario:', err);
      alert('Error al actualizar el estado del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) {
      return;
    }

    setLoading(true);
    try {
      await userService.delete(userId);
      // Remover el usuario de la lista
      setUsers(users.filter(u => u.id !== userId));
      alert('Usuario eliminado exitosamente');
    } catch (err) {
      console.error('Error eliminando usuario:', err);
      alert('Error al eliminar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const downloadUserActions = (user) => {
    // Crear un CSV con las acciones del usuario
    const csvContent = `data:text/csv;charset=utf-8,Usuario,CUI,Email,Rol,Estado\n${user.nombre} ${user.apellidos},${user.cui},${user.email},${user.rol},${user.activo ? 'Activo' : 'Inactivo'}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `acciones_${user.cui}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const togglePasswordVisibility = (userId) => {
    setShowPassword(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  // ============================================
  // FUNCIONES DE DESCARGA DE GRÁFICAS
  // ============================================
  const downloadChart = (chartName) => {
    alert(`Funcionalidad de descarga de gráfica: ${chartName}\nEn desarrollo - Se integrará con librería de exportación`);
  };

  // ============================================
  // DATOS PARA GRÁFICAS (CALCULADOS)
  // ============================================
  const activityData = [
    { mes: 'Ene', usuarios: 45, consultas: 234 },
    { mes: 'Feb', usuarios: 52, consultas: 289 },
    { mes: 'Mar', usuarios: 61, consultas: 312 },
    { mes: 'Abr', usuarios: 58, consultas: 298 },
    { mes: 'May', usuarios: 67, consultas: 356 },
    { mes: 'Jun', usuarios: 78, consultas: 402 }
  ];

  const userActivityData = [
    { accion: 'Creación Usuarios', cantidad: 12 },
    { accion: 'Consultas', cantidad: 234 },
    { accion: 'Reportes', cantidad: 45 },
    { accion: 'Actualizaciones', cantidad: 89 }
  ];

  const roleDistribution = [
    { name: 'Médicos', value: users.filter(u => u.role === 'doctor').length, color: '#3b82f6' },
    { name: 'Autoridades', value: users.filter(u => u.role === 'authority').length, color: '#8b5cf6' },
    { name: 'Pacientes', value: users.filter(u => u.role === 'patient').length, color: '#10b981' },
    { name: 'Admins', value: users.filter(u => u.role === 'admin').length, color: '#f59e0b' }
  ];

  // ============================================
  // RENDER
  // ============================================
  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos del sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header userName={user?.nombre || 'Administrador'} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <DashboardTab
            activityData={activityData}
            roleDistribution={roleDistribution}
            downloadChart={downloadChart}
            totalUsers={users.length}
            activeUsers={users.filter(u => u.activo).length}
          />
        )}

        {activeTab === 'users' && (
          <UsersTab
            users={users}
            newUser={newUser}
            setNewUser={setNewUser}
            handleCreateUser={handleCreateUser}
            toggleUserStatus={toggleUserStatus}
            handleDeleteUser={handleDeleteUser}
            downloadUserActions={downloadUserActions}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            userActivityData={userActivityData}
            downloadChart={downloadChart}
            loading={loading}
          />
        )}

        {activeTab === 'communities' && (
          <CommunitiesTab communities={communities} />
        )}

        {activeTab === 'nutrition' && (
          <NutritionTab nutritionData={nutritionData} />
        )}

        {activeTab === 'traceability' && (
          <TraceabilityTab
            traceability={traceability}
            downloadChart={downloadChart}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;