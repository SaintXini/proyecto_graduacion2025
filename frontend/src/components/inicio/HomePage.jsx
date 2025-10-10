import React from 'react';
import { Users, Heart, Shield, User } from 'lucide-react';
import StatCard from './StatCard';
import InfoCard from './InfoCard';

export default function HomePage({ onLoginClick }) {
  const statsData = [
    { number: '149 Millones', description: 'Niños muy bajitos para su edad', borderColor: 'border-red-200' },
    { number: '45 Millones', description: 'Niños muy delgados y débiles', borderColor: 'border-orange-200' },
    { number: '39 Millones', description: 'Niños con sobrepeso', borderColor: 'border-yellow-200' }
  ];

  const infoCards = [
    {
      icon: Heart,
      title: '¿Qué causa la desnutrición?',
      items: [
        'No comer suficientes alimentos',
        'Falta de frutas, verduras y proteínas',
        'Enfermedades frecuentes',
        'Agua sucia o contaminada'
      ],
      borderColor: 'border-red-500',
      iconColor: 'text-red-500'
    },
    {
      icon: User,
      title: '¿Cómo saber si un niño está desnutrido?',
      items: [
        'Está muy delgado o muy bajito',
        'Se enferma seguido',
        'Está cansado y sin energía',
        'No crece como otros niños de su edad'
      ],
      borderColor: 'border-blue-500',
      iconColor: 'text-blue-500'
    },
    {
      icon: Users,
      title: '¿Cómo ayudamos?',
      items: [
        'Visitamos las casas y pesamos a los niños',
        'Enseñamos a las familias sobre buena alimentación',
        'Damos vitaminas y suplementos',
        'Llevamos registro de cada niño'
      ],
      borderColor: 'border-green-500',
      iconColor: 'text-green-500'
    },
    {
      icon: Shield,
      title: '¿Quién usa este sistema?',
      items: [
        'Administradores del sistema',
        'Autoridades municipales',
        'Médicos y personal de salud',
        'Pacientes y familias'
      ],
      borderColor: 'border-purple-500',
      iconColor: 'text-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">Sistema Municipal</h1>
          <button
            onClick={onLoginClick}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Entrar al Sistema
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Ayudemos a Nuestros Niños
          </h2>
          <p className="text-2xl text-gray-600 mb-8">
            Prevengamos la desnutrición infantil en nuestra comunidad
          </p>
          <div className="bg-yellow-100 border-4 border-yellow-400 rounded-2xl p-6 max-w-3xl mx-auto">
            <p className="text-xl text-gray-800 font-semibold">
              La desnutrición es cuando un niño no recibe los alimentos necesarios para crecer sano y fuerte
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {infoCards.map((card, index) => (
            <InfoCard key={index} {...card} />
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-12 text-center shadow-2xl">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Juntos Podemos Hacer la Diferencia
          </h3>
          <p className="text-xl text-white mb-6">
            Cada niño sano es un futuro mejor para nuestra comunidad
          </p>
          <button
            onClick={onLoginClick}
            className="bg-white text-blue-700 px-10 py-4 rounded-xl font-bold text-xl hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
          >
            Comenzar a Trabajar
          </button>
        </div>
      </div>
    </div>
  );
}