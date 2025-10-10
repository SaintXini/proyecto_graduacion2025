import React, { useState } from 'react';
import { Apple, Eye, Edit, Plus } from 'lucide-react';

export const NutritionTab = ({ nutritionData }) => {
  const [items, setItems] = useState(nutritionData);
  const [formData, setFormData] = useState({ id: null, alimento: '', calorias: '', proteina: '', categoria: '' });
  const [isEditing, setIsEditing] = useState(false);

  const handleViewDetails = (item) => {
    alert(`Detalles de ${item.alimento}:\nCalorías: ${item.calorias} kcal\nProteína: ${item.proteina}g\nCategoría: ${item.categoria}`);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setIsEditing(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setItems(items.map((i) => (i.id === formData.id ? formData : i)));
    } else {
      const newItem = { ...formData, id: Date.now() };
      setItems([...items, newItem]);
    }
    setFormData({ id: null, alimento: '', calorias: '', proteina: '', categoria: '' });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <Apple className="w-6 h-6 text-blue-600" />
          <span>Catálogo de Nutrición</span>
        </h3>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Alimento"
            value={formData.alimento}
            onChange={(e) => setFormData({ ...formData, alimento: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          />
          <input
            type="number"
            placeholder="Calorías"
            value={formData.calorias}
            onChange={(e) => setFormData({ ...formData, calorias: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          />
          <input
            type="number"
            placeholder="Proteína"
            value={formData.proteina}
            onChange={(e) => setFormData({ ...formData, proteina: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Categoría"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          />
          <button
            type="submit"
            className="flex items-center justify-center bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isEditing ? 'Actualizar' : 'Agregar'}
          </button>
        </form>

        {/* Tabla */}
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
              {items.map((item) => (
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

