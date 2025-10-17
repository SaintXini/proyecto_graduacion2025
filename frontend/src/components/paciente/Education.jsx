import React, { useState } from 'react';
import { BookOpen, Clock, CheckCircle, Phone, MessageCircle, Calendar, ExternalLink, Youtube, FileText } from 'lucide-react';

const Education = ({ educationalMaterials }) => {
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  // Usar los materiales que vienen del backend (que ya incluyen enlaces)
  const allMaterials = educationalMaterials;

  const getCategoryColor = (category) => {
    const colors = {
      'Nutrición': 'bg-green-100 text-green-800',
      'Salud': 'bg-blue-100 text-blue-800',
      'Cocina': 'bg-orange-100 text-orange-800',
      'Prevención': 'bg-purple-100 text-purple-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'video': '🎥',
      'articulo': '📄',
      'receta': '👨‍🍳',
      'guia': '📋'
    };
    return icons[type] || '📚';
  };

  const handleMaterialClick = (material) => {
    if (material.url) {
      // Si tiene URL, abrir en nueva pestaña
      window.open(material.url, '_blank', 'noopener,noreferrer');
    } else {
      // Si no tiene URL, mostrar modal
      setSelectedMaterial(material);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-2">Educación Nutricional</h2>
        <p className="text-gray-600 mb-6">
          Materiales educativos y recursos confiables para el cuidado de tu familia
        </p>

        {/* Indicador de recursos disponibles */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-800">
              <span className="font-semibold">{allMaterials.length} recursos educativos disponibles</span> - 
              Haz clic en cualquier material para acceder al contenido
            </p>
          </div>
        </div>

        {allMaterials.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay materiales disponibles
            </h3>
            <p className="text-gray-600">
              Los materiales educativos aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {allMaterials.map(material => (
              <div 
                key={material.id} 
                className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-lg transition cursor-pointer group"
                onClick={() => handleMaterialClick(material)}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-4xl flex-shrink-0">
                    {material.icon || getTypeIcon(material.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-800 mb-1 group-hover:text-purple-700 transition">
                        {material.title}
                      </h3>
                      {material.url && (
                        <ExternalLink className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      )}
                    </div>
                    {material.description && (
                      <p className="text-sm text-gray-600 mb-2">{material.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getCategoryColor(material.category)}`}>
                        {material.category}
                      </span>
                      <span className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {material.duration}
                      </span>
                      {material.source && (
                        <span className="flex items-center text-gray-500 text-xs">
                          <FileText className="w-3 h-3 mr-1" />
                          Fuente: {material.source}
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition flex-shrink-0 group-hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMaterialClick(material);
                    }}
                  >
                    {material.url ? 'Abrir' : 'Ver'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recursos Adicionales de Guatemala */}
        <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
            Recursos Locales - Guatemala
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Línea de ayuda nutricional</p>
                <a href="tel:1500" className="text-sm text-blue-600 hover:underline flex items-center">
                  <Phone className="w-3 h-3 mr-1" />
                  1500 - Atención 24/7
                </a>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-semibold text-gray-800">WhatsApp de consultas</p>
                <a 
                  href="https://wa.me/50255550000?text=Hola,%20necesito%20información%20sobre%20nutrición%20infantil" 
                  className="text-sm text-blue-600 hover:underline flex items-center" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  +502 5555-0000
                </a>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Talleres presenciales mensuales</p>
                <p className="text-sm text-gray-600 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  Consulta horarios en tu centro de salud
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Ministerio de Salud Pública</p>
                <a 
                  href="https://www.mspas.gob.gt" 
                  className="text-sm text-blue-600 hover:underline flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  www.mspas.gob.gt
                </a>
              </div>
            </li>
          </ul>
        </div>

        {/* Organizaciones Internacionales */}
        <div className="mt-4 p-5 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <ExternalLink className="w-5 h-5 mr-2 text-green-600" />
            Organizaciones Confiables
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a
              href="https://www.unicef.org/guatemala/nutricion"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition"
            >
              <div className="text-2xl mr-3">🌟</div>
              <div>
                <p className="text-sm font-semibold text-gray-800">UNICEF Guatemala</p>
                <p className="text-xs text-gray-600">Programas de nutrición</p>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
            </a>

            <a
              href="https://www.who.int/es"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition"
            >
              <div className="text-2xl mr-3">🏥</div>
              <div>
                <p className="text-sm font-semibold text-gray-800">OMS</p>
                <p className="text-xs text-gray-600">Organización Mundial de la Salud</p>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
            </a>

            <a
              href="https://www.fao.org/guatemala/es/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition"
            >
              <div className="text-2xl mr-3">🌾</div>
              <div>
                <p className="text-sm font-semibold text-gray-800">FAO Guatemala</p>
                <p className="text-xs text-gray-600">Seguridad alimentaria</p>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
            </a>

            <a
              href="https://www.paho.org/es/guatemala"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition"
            >
              <div className="text-2xl mr-3">🏛️</div>
              <div>
                <p className="text-sm font-semibold text-gray-800">OPS Guatemala</p>
                <p className="text-xs text-gray-600">Salud pública</p>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
            </a>
          </div>
        </div>

        {/* Contacto de Emergencia */}
        <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="bg-red-500 rounded-full p-2 flex-shrink-0">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-red-800 mb-1">Emergencias Médicas</h4>
              <p className="text-sm text-red-700 mb-2">
                Si tu hijo presenta síntomas graves (dificultad para respirar, fiebre muy alta, deshidratación severa), llama inmediatamente:
              </p>
              <div className="space-y-1">
                <a href="tel:123" className="block text-lg font-bold text-red-600 hover:underline">
                  🚨 123 - Emergencias Nacionales
                </a>
                <a href="tel:1515" className="block text-md font-semibold text-red-600 hover:underline">
                  🚑 1515 - Bomberos Voluntarios
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Material (para materiales sin URL externa) */}
      {selectedMaterial && !selectedMaterial.url && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMaterial(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-2xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-800">{selectedMaterial.title}</h3>
              <button
                onClick={() => setSelectedMaterial(null)}
                className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">
                {selectedMaterial.icon || getTypeIcon(selectedMaterial.type)}
              </div>
              <p className="text-gray-600 mb-4">{selectedMaterial.description}</p>
              <div className="flex justify-center space-x-4 text-sm text-gray-600 mb-6">
                <span className={`px-3 py-1 rounded ${getCategoryColor(selectedMaterial.category)}`}>
                  {selectedMaterial.category}
                </span>
                <span className="flex items-center px-3 py-1 bg-gray-100 rounded">
                  <Clock className="w-4 h-4 mr-1" />
                  {selectedMaterial.duration}
                </span>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-700">
                  Este contenido estará disponible próximamente. Mientras tanto, puedes consultar los recursos externos disponibles con enlaces a sitios confiables.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Education;