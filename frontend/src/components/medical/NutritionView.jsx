import React, { useContext, useState } from 'react';
import { Plus, Calendar, Target, ChefHat, TrendingUp } from 'lucide-react';
import { AppContext } from './context/AppContext';
export const NutritionView = () => {
const {
nutritionPlans,
patients,
createNutritionPlan,
loading
} = useContext(AppContext);
const [showCreateModal, setShowCreateModal] = useState(false);
const [newPlan, setNewPlan] = useState({
patient_id: '',
title: '',
description: '',
calories_target: '',
start_date: '',
end_date: ''
});
const handleCreatePlan = async (e) => {
e.preventDefault();
if (!newPlan.patient_id || !newPlan.title) {
alert('Por favor complete los campos obligatorios');
return;
}
try {
await createNutritionPlan(newPlan);
alert('Plan de nutrición creado exitosamente');
setShowCreateModal(false);
setNewPlan({
patient_id: '',
title: '',
description: '',
calories_target: '',
start_date: '',
end_date: ''
});
} catch (error) {
console.error('Error creando plan:', error);
alert('Error al crear plan de nutrición: ' + (error.response?.data?.message || error.message));
}
};
const getStatusColor = (status) => {
switch(status) {
case 'active': return 'bg-green-100 text-green-800';
case 'completed': return 'bg-blue-100 text-blue-800';
case 'cancelled': return 'bg-red-100 text-red-800';
default: return 'bg-gray-100 text-gray-800';
}
};
const getStatusText = (status) => {
switch(status) {
case 'active': return 'Activo';
case 'completed': return 'Completado';
case 'cancelled': return 'Cancelado';
default: return status;
}
};
return (
<div>
<div className="flex justify-between items-center mb-6">
<div>
<h2 className="text-2xl font-bold text-gray-800">Planes de Nutrición</h2>
<p className="text-gray-600 text-sm mt-1">Gestión de planes nutricionales personalizados</p>
</div>
<button
onClick={() => setShowCreateModal(true)}
className="bg-purple-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-purple-700 transition shadow-lg"
>
<Plus className="w-5 h-5 mr-2" />
Nuevo Plan
</button>
</div>
{loading ? (
<div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
<div className="text-center">
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
<p className="mt-4 text-gray-600">Cargando planes...</p>
</div>
</div>
) : (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{nutritionPlans.length === 0 ? (
<div className="col-span-full bg-white rounded-lg shadow p-8 text-center">
<ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
<p className="text-gray-500 text-lg font-medium">No hay planes de nutrición</p>
<p className="text-gray-400 text-sm mt-2">
Los planes de nutrición creados aparecerán aquí
</p>
<button
onClick={() => setShowCreateModal(true)}
className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
>
Crear primer plan
</button>
</div>
) : (
nutritionPlans.map(plan => {
const patient = patients.find(p => p.id === plan.patient_id);
return (
<div key={plan.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
<div className="flex items-start justify-between mb-4">
<div className="flex items-center">
<ChefHat className="w-6 h-6 text-purple-600 mr-2" />
<h3 className="text-lg font-bold text-gray-800">{plan.title}</h3>
</div>
<span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
{getStatusText(plan.status)}
</span>
</div>
<div className="mb-4">
<p className="text-sm text-gray-600 mb-2">
<strong>Paciente:</strong>{' '}
{patient ? `${patient.first_name} ${patient.last_name}` : `ID: ${plan.patient_id}`}
</p>
{plan.description && (
<p className="text-sm text-gray-600">{plan.description}</p>
)}
</div>
{plan.calories_target && (
<div className="flex items-center mb-3 text-sm bg-purple-50 rounded-lg p-3">
<Target className="w-4 h-4 mr-2 text-purple-600" />
<span className="font-medium">Meta: {plan.calories_target} calorías/día</span>
</div>
)}
<div className="border-t pt-3 mt-3">
<div className="space-y-2 text-sm text-gray-600">
{plan.start_date && (
<div className="flex items-center">
<Calendar className="w-4 h-4 mr-2 text-gray-400" />
<span>Inicio: {new Date(plan.start_date).toLocaleDateString('es-GT')}</span>
</div>
)}
{plan.end_date && (
<div className="flex items-center">
<Calendar className="w-4 h-4 mr-2 text-gray-400" />
<span>Fin: {new Date(plan.end_date).toLocaleDateString('es-GT')}</span>
</div>
)}
</div>
</div>
{plan.meals && plan.meals.length > 0 && (
<div className="mt-4 bg-purple-50 rounded-lg p-3">
<p className="text-sm font-medium text-purple-800 mb-2 flex items-center">
<TrendingUp className="w-4 h-4 mr-1" />
Comidas: {plan.meals.length}
</p>
<div className="text-xs text-gray-700 space-y-1">
{plan.meals.slice(0, 3).map((meal, idx) => (
<div key={idx} className="flex items-center">
<span className="inline-block w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
{meal.name}
</div>
))}
{plan.meals.length > 3 && (
<div className="text-purple-600 font-medium text-center mt-2">
+ {plan.meals.length - 3} más
</div>
)}
</div>
</div>
)}
</div>
);
})
)}
</div>
)}
{/* Modal crear plan */}
{showCreateModal && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
<h3 className="text-2xl font-bold text-gray-800 mb-6">Crear Plan de Nutrición</h3>
<form onSubmit={handleCreatePlan}>
<div className="space-y-4">
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">
Paciente *
</label>
<select
value={newPlan.patient_id}
onChange={(e) => setNewPlan({...newPlan, patient_id: e.target.value})}
className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
required
>
<option value="">Seleccione un paciente</option>
{patients.map(patient => (
<option key={patient.id} value={patient.id}>
{patient.first_name} {patient.last_name} - {patient.username}
</option>
))}
</select>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">
Título del Plan *
</label>
<input
type="text"
value={newPlan.title}
onChange={(e) => setNewPlan({...newPlan, title: e.target.value})}
className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
required
placeholder="Ej: Plan de Nutrición Básico"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">
Descripción
</label>
<textarea
value={newPlan.description}
onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
rows="3"
placeholder="Descripción del plan de nutrición"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">
Calorías Objetivo (diarias)
</label>
<input
type="number"
value={newPlan.calories_target}
onChange={(e) => setNewPlan({...newPlan, calories_target: e.target.value})}
className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
placeholder="Ej: 2000"
/>
</div>
<div className="grid grid-cols-2 gap-4">
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">
Fecha de Inicio
</label>
<input
type="date"
value={newPlan.start_date}
onChange={(e) => setNewPlan({...newPlan, start_date: e.target.value})}
className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">
Fecha de Fin
</label>
<input
type="date"
value={newPlan.end_date}
onChange={(e) => setNewPlan({...newPlan, end_date: e.target.value})}
className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
/>
</div>
</div>
</div>
<div className="flex justify-end space-x-4 mt-6">
<button
type="button"
onClick={() => setShowCreateModal(false)}
className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
>
Cancelar
</button>
<button
type="submit"
className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
>
Crear Plan
</button>
</div>
</form>
</div>
</div>
)}
</div>
);
};