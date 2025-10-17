import React, { useState, useEffect } from 'react';
import { Users, Activity, AlertCircle, CheckCircle, UserPlus, Download, FileText, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const DashboardTab = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    consultations_today: 0,
    active_alerts: 0
  });
  
  const [activityData, setActivityData] = useState([]);
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Cargar todas las estadísticas en paralelo
      const [statsRes, activityRes, rolesRes, userActivityRes, recentActivityRes] = await Promise.allSettled([
        axios.get(`${API_URL}/dashboard/stats`, config),
        axios.get(`${API_URL}/dashboard/activity`, config),
        axios.get(`${API_URL}/dashboard/roles`, config),
        axios.get(`${API_URL}/dashboard/user-activity`, config),
        axios.get(`${API_URL}/dashboard/recent-activity`, config)
      ]);

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data);
      }

      if (activityRes.status === 'fulfilled') {
        setActivityData(activityRes.value.data);
      }

      if (rolesRes.status === 'fulfilled') {
        setRoleDistribution(rolesRes.value.data);
      }

      if (userActivityRes.status === 'fulfilled') {
        setUserActivity(userActivityRes.value.data);
      }

      if (recentActivityRes.status === 'fulfilled') {
        setRecentActivity(recentActivityRes.value.data);
      }

    } catch (err) {
      console.error('Error cargando dashboard:', err);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Función para descargar gráficas individuales como PNG
  const downloadChartAsPNG = async (elementId, fileName) => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        alert('No se pudo encontrar el gráfico');
        return;
      }

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2
      });

      const link = document.createElement('a');
      link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error descargando gráfica:', err);
      alert('Error al descargar la gráfica');
    }
  };

  // Función para descargar reporte completo en PDF
  const downloadFullReportPDF = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Título
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Reporte de Dashboard - Sistema Médico Guatemala', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Fecha: ${new Date().toLocaleDateString('es-GT')}`, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 15;

      // Estadísticas principales
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Estadísticas Generales', 15, yPosition);
      
      yPosition += 8;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const statsText = [
        `Usuarios Totales: ${stats.total_users}`,
        `Usuarios Activos: ${stats.active_users}`,
        `Consultas Hoy: ${stats.consultations_today}`,
        `Alertas Activas: ${stats.active_alerts}`
      ];

      statsText.forEach(text => {
        pdf.text(text, 20, yPosition);
        yPosition += 6;
      });

      yPosition += 10;

      // Capturar gráficas
      const charts = [
        { id: 'activity-chart', title: 'Actividad Mensual' },
        { id: 'roles-chart', title: 'Distribución de Roles' }
      ];

      for (const chart of charts) {
        const element = document.getElementById(chart.id);
        if (element) {
          if (yPosition > pageHeight - 80) {
            pdf.addPage();
            yPosition = 20;
          }

          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text(chart.title, 15, yPosition);
          yPosition += 5;

          const canvas = await html2canvas(element, {
            backgroundColor: '#ffffff',
            scale: 2
          });

          const imgData = canvas.toDataURL('image/png');
          const imgWidth = pageWidth - 30;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          pdf.addImage(imgData, 'PNG', 15, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
        }
      }

      // Actividad reciente
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Actividad Reciente', 15, yPosition);
      yPosition += 8;

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');

      recentActivity.slice(0, 10).forEach((activity, index) => {
        if (yPosition > pageHeight - 15) {
          pdf.addPage();
          yPosition = 20;
        }

        const activityText = `${index + 1}. ${activity.description}`;
        pdf.text(activityText, 20, yPosition);
        yPosition += 5;
      });

      // Guardar PDF
      pdf.save(`reporte_dashboard_${new Date().toISOString().split('T')[0]}.pdf`);
      
      alert('Reporte descargado exitosamente');
    } catch (err) {
      console.error('Error generando PDF:', err);
      alert('Error al generar el reporte PDF');
    }
  };

  // Función para descargar datos como CSV
  const downloadDataCSV = (data, fileName) => {
    try {
      let csvContent = '';

      if (fileName.includes('actividad')) {
        csvContent = 'Mes,Usuarios,Consultas\n';
        data.forEach(row => {
          csvContent += `${row.mes},${row.usuarios},${row.consultas}\n`;
        });
      } else if (fileName.includes('roles')) {
        csvContent = 'Rol,Cantidad,Color\n';
        data.forEach(row => {
          csvContent += `${row.name},${row.value},${row.color}\n`;
        });
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error descargando CSV:', err);
      alert('Error al descargar los datos');
    }
  };

  const inactiveUsers = stats.total_users - stats.active_users;
  const activePercentage = stats.total_users > 0 ? ((stats.active_users / stats.total_users) * 100).toFixed(0) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-700 font-medium">{error}</p>
        <button 
          onClick={loadDashboardData}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Botón de descarga del reporte completo */}
      <div className="flex justify-end">
        <button
          onClick={downloadFullReportPDF}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg"
        >
          <FileText className="w-5 h-5" />
          <span className="font-medium">Descargar Reporte Completo (PDF)</span>
        </button>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Usuarios Totales</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total_users}</p>
            </div>
            <Users className="w-12 h-12 text-blue-600 opacity-80" />
          </div>
          <p className="text-sm text-gray-600 mt-3">Registrados en el sistema</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Usuarios Activos</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.active_users}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-600 opacity-80" />
          </div>
          <p className="text-green-600 text-sm mt-3">{activePercentage}% del total</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-600 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Usuarios Inactivos</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{inactiveUsers}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-orange-600 opacity-80" />
          </div>
          <p className="text-sm text-gray-600 mt-3">Requieren atención</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Consultas Hoy</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.consultations_today}</p>
            </div>
            <Activity className="w-12 h-12 text-purple-600 opacity-80" />
          </div>
          <p className="text-purple-600 text-sm mt-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            Actividad diaria
          </p>
        </div>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfica de línea - Actividad mensual */}
        <div className="bg-white rounded-xl shadow-lg p-6" id="activity-chart">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Actividad Mensual</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => downloadChartAsPNG('activity-chart', 'actividad_mensual')}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                title="Descargar como PNG"
              >
                <Download className="w-4 h-4" />
                <span>PNG</span>
              </button>
              <button
                onClick={() => downloadDataCSV(activityData, 'actividad_mensual')}
                className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                title="Descargar como CSV"
              >
                <Download className="w-4 h-4" />
                <span>CSV</span>
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="usuarios" stroke="#3b82f6" strokeWidth={2} name="Usuarios" />
              <Line type="monotone" dataKey="consultas" stroke="#8b5cf6" strokeWidth={2} name="Consultas" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica de pastel - Distribución de roles */}
        <div className="bg-white rounded-xl shadow-lg p-6" id="roles-chart">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Distribución de Roles</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => downloadChartAsPNG('roles-chart', 'distribucion_roles')}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                title="Descargar como PNG"
              >
                <Download className="w-4 h-4" />
                <span>PNG</span>
              </button>
              <button
                onClick={() => downloadDataCSV(roleDistribution, 'distribucion_roles')}
                className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                title="Descargar como CSV"
              >
                <Download className="w-4 h-4" />
                <span>CSV</span>
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roleDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent, value }) =>
                  value > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {roleDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Leyenda personalizada */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {roleDistribution.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfica de barras - Actividad de usuarios */}
      <div className="bg-white rounded-xl shadow-lg p-6" id="user-activity-chart">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Actividad de Usuarios por Tipo</h3>
          <button
            onClick={() => downloadChartAsPNG('user-activity-chart', 'actividad_usuarios')}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Descargar</span>
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userActivity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="accion" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Actividad reciente del sistema */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Actividad Reciente del Sistema</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay actividad reciente</p>
          ) : (
            recentActivity.map((activity, index) => {
              const getIconByType = (type) => {
                switch(type) {
                  case 'user': return <UserPlus className="w-5 h-5 text-blue-600" />;
                  case 'medical': return <Activity className="w-5 h-5 text-green-600" />;
                  default: return <Activity className="w-5 h-5 text-gray-600" />;
                }
              };

              const getBgByType = (type) => {
                switch(type) {
                  case 'user': return 'bg-blue-50';
                  case 'medical': return 'bg-green-50';
                  default: return 'bg-gray-50';
                }
              };

              const formatTime = (timestamp) => {
                if (!timestamp) return 'Fecha desconocida';
                const date = new Date(timestamp);
                const now = new Date();
                const diffMs = now - date;
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMs / 3600000);
                const diffDays = Math.floor(diffMs / 86400000);

                if (diffMins < 1) return 'Ahora';
                if (diffMins < 60) return `Hace ${diffMins} min`;
                if (diffHours < 24) return `Hace ${diffHours}h`;
                if (diffDays < 7) return `Hace ${diffDays}d`;
                return date.toLocaleDateString('es-GT');
              };

              return (
                <div key={index} className={`flex items-center justify-between p-3 ${getBgByType(activity.type)} rounded-lg hover:shadow transition`}>
                  <div className="flex items-center space-x-3">
                    {getIconByType(activity.type)}
                    <span className="text-gray-700">{activity.description}</span>
                  </div>
                  <span className="text-sm text-gray-500">{formatTime(activity.timestamp)}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 hover:shadow-lg transition">
          <h4 className="font-bold text-gray-800 mb-2">Sistema Actualizado</h4>
          <p className="text-sm text-gray-600">
            Última actualización: {new Date().toLocaleDateString('es-GT')}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 hover:shadow-lg transition">
          <h4 className="font-bold text-gray-800 mb-2">Rendimiento</h4>
          <p className="text-sm text-gray-600">
            Todos los servicios operando normalmente
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 hover:shadow-lg transition">
          <h4 className="font-bold text-gray-800 mb-2">Soporte</h4>
          <p className="text-sm text-gray-600">
            Contacto: soporte@sistemamedico.gt
          </p>
        </div>
      </div>
    </div>
  );
};