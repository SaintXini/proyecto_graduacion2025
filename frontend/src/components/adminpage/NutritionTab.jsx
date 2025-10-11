import React from 'react';
import { Apple, Eye, Edit } from 'lucide-react';

export const NutritionTab = ({ nutritionData }) => {
  const handleViewDetails = (item) => {
    alert(`Detalles de ${item.alimento}:\nCalorías: ${item.calorias} kcal\nProteína: ${item.proteina}g\nCategoría: ${item.categoria}`);
  };

  const handleEdit = (item) => {
    alert(`Editando: ${item.alimento}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <Apple className="w-6 h-6 text-blue-600" />
          <span>Catálogo de Nutrición</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Alimento</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Calorías (100g)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Proteína (g)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Categoría</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {nutritionData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">{item.alimento}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.calorias} kcal</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.proteina}g</td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {item.categoria}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewDetails(item)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition" 
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(item)}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition" 
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};