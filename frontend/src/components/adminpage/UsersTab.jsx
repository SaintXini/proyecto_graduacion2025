import React from 'react';
import { UserPlus, Eye, EyeOff, Download, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const UsersTab = ({
  users,
  newUser,
  setNewUser,
  handleCreateUser,
  toggleUserStatus,
  handleDeleteUser,
  downloadUserActions,
  showPassword,
  togglePasswordVisibility,
  userActivityData,
  downloadChart,
  loading
}) => {
  
  const getRoleLabel = (role) => {
    const roleLabels = {
      'doctor': 'Médico',
      'authority': 'Autoridad',
      'admin': 'Administrador',
      'patient': 'Paciente',
      'medico': 'Médico',
      'autoridad': 'Autoridad'
    };
    return roleLabels[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      'admin': 'bg-pink-100 text-pink-700',
      'doctor': 'bg-blue-100 text-blue-700',
      'medico': 'bg-blue-100 text-blue-700',
      'authority': 'bg-purple-100 text-purple-700',
      'autoridad': 'bg-purple-100 text-purple-700',
      'patient': 'bg-green-100 text-green-700'
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Formulario de creación de usuario */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <UserPlus className="w-6 h-6 text-blue-600" />
          <span>Crear Nuevo Usuario</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="CUI *"
            value={newUser.cui}
            onChange={(e) => setNewUser({ ...newUser, cui: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          
          <input
            type="text"
            placeholder="Nombre *"
            value={newUser.nombre}
            onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          
          <input
            type="text"
            placeholder="Apellidos *"
            value={newUser.apellidos}
            onChange={(e) => setNewUser({ ...newUser, apellidos: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          
          <input
            type="email"
            placeholder="Email *"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          
          <input
            type="tel"
            placeholder="Teléfono"
            value={newUser.telefono}
            onChange={(e) => setNewUser({ ...newUser, telefono: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          
          <input
            type="password"
            placeholder="Contraseña *"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          
          <select
            value={newUser.rol}
            onChange={(e) => setNewUser({ ...newUser, rol: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="doctor">Médico</option>
            <option value="authority">Autoridad</option>
            <option value="admin">Administrador</option>
            <option value="patient">Paciente</option>
          </select>
          
          <button
            onClick={handleCreateUser}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            <span>{loading ? 'Creando...' : 'Crear Usuario'}</span>
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          * Campos obligatorios. La contraseña debe tener al menos 6 caracteres.
        </p>
      </div>

      {/* Lista de usuarios */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Lista de Usuarios</h3>
          <span className="text-sm text-gray-600">Total: {users.length} usuarios</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">CUI</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre Completo</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Teléfono</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contraseña</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-700">{user.cui}</td>
                    
                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                      {user.nombre} {user.apellidos}
                    </td>
                    
                    <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                    
                    <td className="px-4 py-3 text-sm text-gray-700">{user.telefono || 'N/A'}</td>
                    
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700">
                          {showPassword[user.id] ? user.password : '••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(user.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title={showPassword[user.id] ? 'Ocultar' : 'Mostrar'}
                        >
                          {showPassword[user.id] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.rol)}`}>
                        {getRoleLabel(user.rol)}
                      </span>
                    </td>
                    
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        disabled={loading}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition ${
                          user.activo
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {user.activo ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>{user.activo ? 'Activo' : 'Inactivo'}</span>
                      </button>
                    </td>
                    
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => downloadUserActions(user)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                          title="Descargar acciones"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => alert(`Funcionalidad de edición en desarrollo para: ${user.nombre}`)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={loading}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráfica de actividad de usuarios */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Actividad de Usuarios por Tipo</h3>
          <button
            onClick={() => downloadChart('Actividad de Usuarios')}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Descargar</span>
          </button>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userActivityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="accion" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};