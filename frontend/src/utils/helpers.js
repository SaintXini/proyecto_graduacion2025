/**
 * Funciones de utilidad para el frontend
 */

/**
 * Formatea errores de la API
 * @param {Error} error - Error capturado
 * @returns {string} Mensaje de error formateado
 */
export const formatApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'Ha ocurrido un error inesperado';
};

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida un CUI guatemalteco (DPI)
 * @param {string} cui - CUI a validar
 * @returns {boolean} True si es válido
 */
export const isValidCUI = (cui) => {
  // El CUI guatemalteco tiene 13 dígitos
  const cuiRegex = /^\d{13}$/;
  return cuiRegex.test(cui);
};

/**
 * Valida una contraseña
 * @param {string} password - Contraseña a validar
 * @param {number} minLength - Longitud mínima (default: 6)
 * @returns {object} { valid: boolean, message: string }
 */
export const validatePassword = (password, minLength = 6) => {
  if (!password || password.length < minLength) {
    return {
      valid: false,
      message: `La contraseña debe tener al menos ${minLength} caracteres`
    };
  }
  
  return { valid: true, message: '' };
};

/**
 * Formatea un nombre completo
 * @param {string} nombre - Nombre
 * @param {string} apellidos - Apellidos
 * @returns {string} Nombre completo formateado
 */
export const formatFullName = (nombre, apellidos) => {
  const parts = [];
  if (nombre) parts.push(nombre);
  if (apellidos) parts.push(apellidos);
  return parts.join(' ').trim();
};

/**
 * Obtiene las iniciales de un nombre
 * @param {string} nombre - Nombre completo
 * @returns {string} Iniciales (máximo 2 letras)
 */
export const getInitials = (nombre) => {
  if (!nombre) return 'NN';
  
  const words = nombre.trim().split(' ').filter(w => w.length > 0);
  
  if (words.length === 0) return 'NN';
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  
  return (words[0][0] + words[1][0]).toUpperCase();
};

/**
 * Formatea una fecha a formato local
 * @param {string|Date} date - Fecha a formatear
 * @param {boolean} includeTime - Incluir hora
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, includeTime = false) => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  return dateObj.toLocaleDateString('es-GT', options);
};

/**
 * Descarga un archivo CSV
 * @param {string} filename - Nombre del archivo
 * @param {Array} data - Datos a exportar
 * @param {Array} headers - Encabezados de las columnas
 */
export const downloadCSV = (filename, data, headers) => {
  if (!data || data.length === 0) {
    alert('No hay datos para exportar');
    return;
  }
  
  // Crear el contenido CSV
  const csvRows = [];
  
  // Agregar encabezados
  csvRows.push(headers.join(','));
  
  // Agregar datos
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header] || '';
      // Escapar comas y comillas
      const escaped = ('' + value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  // Crear el blob y descargar
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Trunca un texto a una longitud máxima
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncate = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Debounce function para optimizar búsquedas
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función con debounce
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Formatea un número de teléfono guatemalteco
 * @param {string} phone - Número de teléfono
 * @returns {string} Teléfono formateado
 */
export const formatPhone = (phone) => {
  if (!phone) return 'N/A';
  
  // Eliminar caracteres no numéricos
  const cleaned = ('' + phone).replace(/\D/g, '');
  
  // Formato: +502 1234-5678
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('502')) {
    return `+502 ${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
};

/**
 * Mapea roles del backend al frontend
 * @param {string} role - Rol del backend
 * @returns {string} Rol en español
 */
export const mapRoleToSpanish = (role) => {
  const roleMap = {
    'admin': 'Administrador',
    'doctor': 'Médico',
    'authority': 'Autoridad Municipal',
    'patient': 'Paciente',
    'medico': 'Médico',
    'autoridad': 'Autoridad Municipal',
    'paciente': 'Paciente'
  };
  
  return roleMap[role] || role;
};

/**
 * Obtiene el color de un rol
 * @param {string} role - Rol del usuario
 * @returns {string} Clases de Tailwind para el color
 */
export const getRoleColor = (role) => {
  const colorMap = {
    'admin': 'bg-pink-100 text-pink-700',
    'doctor': 'bg-blue-100 text-blue-700',
    'medico': 'bg-blue-100 text-blue-700',
    'authority': 'bg-purple-100 text-purple-700',
    'autoridad': 'bg-purple-100 text-purple-700',
    'patient': 'bg-green-100 text-green-700',
    'paciente': 'bg-green-100 text-green-700'
  };
  
  return colorMap[role] || 'bg-gray-100 text-gray-700';
};

/**
 * Calcula el porcentaje
 * @param {number} value - Valor actual
 * @param {number} total - Valor total
 * @param {number} decimals - Decimales a mostrar
 * @returns {string} Porcentaje formateado
 */
export const calculatePercentage = (value, total, decimals = 0) => {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Valida los campos requeridos de un formulario
 * @param {object} data - Datos del formulario
 * @param {Array} requiredFields - Campos requeridos
 * @returns {object} { valid: boolean, message: string }
 */
export const validateRequiredFields = (data, requiredFields) => {
  const missingFields = [];
  
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      missingFields.push(field);
    }
  }
  
  if (missingFields.length > 0) {
    return {
      valid: false,
      message: `Los siguientes campos son obligatorios: ${missingFields.join(', ')}`
    };
  }
  
  return { valid: true, message: '' };
};