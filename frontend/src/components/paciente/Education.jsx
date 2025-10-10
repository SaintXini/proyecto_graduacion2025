// components/Education.jsx
import React from 'react';
import { BookOpen, Clock, CheckCircle } from 'lucide-react';

const Education = ({ educationalMaterials }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-2">Educación Nutricional</h2>
      <p className="text-gray-600 mb-6">Materiales educativos para el cuidado de tu hijo</p>
      <div className="grid gap-4">
        {educationalMaterials.map(material => (
          <div key={material.id} className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-md transition cursor-pointer">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">{material.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">{material.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="px-2 py-1 bg-white rounded text-xs font-semibold">{material.category}</span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {material.duration}
                  </span>
                </div>
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">Ver</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-bold text-gray-800 mb-2 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
          Recursos Adicionales
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            Línea de ayuda nutricional: 1500
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            WhatsApp de consultas: +502 5555-0000
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            Talleres presenciales mensuales
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default Education;
