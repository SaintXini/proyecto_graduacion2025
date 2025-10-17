import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          {/* Columna 1 - Información */}
          <div>
            <h4 className="font-bold text-gray-800 mb-2">Sistema Médico Guatemala</h4>
            <p className="text-sm text-gray-600">
              Plataforma integral para la gestión de salud comunitaria y nutrición infantil.
            </p>
          </div>

          {/* Columna 2 - Contacto */}
          <div>
            <h4 className="font-bold text-gray-800 mb-2">Contacto</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>soporte@sistemamedico.gt</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+502 2345-6789</span>
              </p>
              <p className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Guatemala, Guatemala</span>
              </p>
            </div>
          </div>

          {/* Columna 3 - Enlaces */}
          <div>
            <h4 className="font-bold text-gray-800 mb-2">Enlaces Rápidos</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <a href="#" className="block hover:text-blue-600 transition">Documentación</a>
              <a href="#" className="block hover:text-blue-600 transition">Soporte Técnico</a>
              <a href="#" className="block hover:text-blue-600 transition">Política de Privacidad</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
          <p className="flex items-center space-x-1">
            © 2025 Sistema Médico Guatemala. Todos los derechos reservados.
            <Heart className="w-4 h-4 text-red-500 ml-1" />
          </p>
          <p>Versión 2.1.0 - Build {new Date().toISOString().split('T')[0]}</p>
        </div>
      </div>
    </footer>
  );
};