import React, { useState } from 'react';
import { MapPin, Pencil, Save } from 'lucide-react';

export const CommunitiesTab = () => {
  const [communities, setCommunities] = useState([
    {
      id: 1,
      nombre: 'San Miguel',
      departamento: 'Huehuetenango',
      poblacion: 12000,
      medicos: 3,
    },
    {
      id: 2,
      nombre: 'Santa Rosa',
      departamento: 'Quiché',
      poblacion: 8500,
      medicos: 2,
    },
  ]);

  const [newCommunity, setNewCommunity] = useState({
    nombre: '',
    departamento: '',
    poblacion: '',
    medicos: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [editedCommunity, setEditedCommunity] = useState({});

  const handleViewDetails = (community) => {
    alert(`Ver detalles de: ${community.nombre}\nDepartamento: ${community.departamento}\nPoblación: ${community.poblacion}`);
  };

  const handleAddCommunity = () => {
    const nueva = {
      ...newCommunity,
      id: Date.now(),
      poblacion: parseInt(newCommunity.poblacion),
      medicos: parseInt(newCommunity.medicos),
    };
    setCommunities([...communities, nueva]);
    setNewCommunity({ nombre: '', departamento: '', poblacion: '', medicos: '' });
  };

  const handleEdit = (community) => {
    setEditingId(community.id);
    setEditedCommunity({ ...community });
  };

  const handleSaveEdit = () => {
    const updated = communities.map((c) =>
      c.id === editingId ? editedCommunity : c
    );
    setCommunities(updated);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Formulario para agregar nueva comunidad */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <MapPin className="w-6 h-6 text-green-600" />
          <span>Agregar Nueva Comunidad</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={newCommunity.nombre}
            onChange={(e) => setNewCommunity({ ...newCommunity, nombre: e.target.value })}
            className="border p-2 rounded-lg"
          />
          <input
            type="text"
            placeholder="Departamento"
            value={newCommunity.departamento}
            onChange={(e) => setNewCommunity({ ...newCommunity, departamento: e.target.value })}
            className="border p-2 rounded-lg"
          />
          <input
            type="number"
            placeholder="Población"
            value={newCommunity.poblacion}
            onChange={(e) => setNewCommunity({ ...newCommunity, poblacion: e.target.value })}
            className="border p-2 rounded-lg"
          />
          <input
            type="number"
            placeholder="Médicos"
            value={newCommunity.medicos}
            onChange={(e) => setNewCommunity({ ...newCommunity, medicos: e.target.value })}
            className="border p-2 rounded-lg"
          />
        </div>
        <button
          onClick={handleAddCommunity}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Agregar Comunidad
        </button>
      </div>

      {/* Catálogo de comunidades */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          <span>Catálogo de Comunidades</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <div key={community.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
              {editingId === community.id ? (
                <>
                  <input
                    type="text"
                    value={editedCommunity.nombre}
                    onChange={(e) => setEditedCommunity({ ...editedCommunity, nombre: e.target.value })}
                    className="w-full mb-2 border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={editedCommunity.departamento}
                    onChange={(e) => setEditedCommunity({ ...editedCommunity, departamento: e.target.value })}
                    className="w-full mb-2 border p-2 rounded"
                  />
                  <input
                    type="number"
                    value={editedCommunity.poblacion}
                    onChange={(e) => setEditedCommunity({ ...editedCommunity, poblacion: parseInt(e.target.value) })}
                    className="w-full mb-2 border p-2 rounded"
                  />
                  <input
                    type="number"
                    value={editedCommunity.medicos}
                    onChange={(e) => setEditedCommunity({ ...editedCommunity, medicos: parseInt(e.target.value) })}
                    className="w-full mb-2 border p-2 rounded"
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <Save className="inline-block mr-2 w-4 h-4" />
                    Guardar Cambios
                  </button>
                </>
              ) : (
                <>
                  <h4 className="font-bold text-gray-800 text-lg mb-2">{community.nombre}</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Departamento:</span> {community.departamento}</p>
                    <p><span className="font-medium">Población:</span> {community.poblacion.toLocaleString()} habitantes</p>
                    <p><span className="font-medium">Médicos asignados:</span> {community.medicos}</p>
                  </div>
                  <button
                    onClick={() => handleViewDetails(community)}
                    className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Ver Detalles
                  </button>
                  <button
                    onClick={() => handleEdit(community)}
                    className="mt-2 w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  >
                    <Pencil className="inline-block mr-2 w-4 h-4" />
                    Editar
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
