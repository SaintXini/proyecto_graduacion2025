"""
Controlador para operaciones de nutrición
"""

from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.nutrition_service import NutritionService
from app.utils.decorators import role_required


class NutritionController:
    """Controlador para operaciones de nutrición"""
    
    @staticmethod
    @jwt_required()
    def get_nutrition_plans():
        """
        Obtiene planes de nutrición
        GET /api/nutrition
        Query params: patient_id
        """
        patient_id = request.args.get('patient_id')
        plans = NutritionService.get_nutrition_plans(patient_id)
        
        return jsonify([plan.to_dict() for plan in plans]), 200
    
    @staticmethod
    @jwt_required()
    def get_nutrition_plan(plan_id):
        """
        Obtiene un plan de nutrición por ID
        GET /api/nutrition/:id
        """
        plan = NutritionService.get_nutrition_plan_by_id(plan_id)
        
        if not plan:
            return jsonify({'message': 'Plan de nutrición no encontrado'}), 404
        
        return jsonify(plan.to_dict()), 200
    
    @staticmethod
    @jwt_required()
    @role_required('doctor', 'admin')
    def create_nutrition_plan():
        """
        Crea un nuevo plan de nutrición
        POST /api/nutrition
        Body: {patient_id, title, description, calories_target, start_date, end_date}
        """
        data = request.get_json()
        
        required_fields = ['patient_id', 'title']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'message': f'{field} es requerido'}), 400
        
        plan, error = NutritionService.create_nutrition_plan(data)
        
        if error:
            return jsonify({'message': error}), 400
        
        return jsonify({
            'message': 'Plan de nutrición creado exitosamente',
            'plan': plan.to_dict()
        }), 201
    
    @staticmethod
    @jwt_required()
    @role_required('doctor', 'admin')
    def add_meal(plan_id):
        """
        Añade una comida a un plan de nutrición
        POST /api/nutrition/:id/meals
        Body: {meal_type, name, description, calories, proteins, carbohydrates, fats}
        """
        data = request.get_json()
        
        meal, error = NutritionService.add_meal_to_plan(plan_id, data)
        
        if error:
            return jsonify({'message': error}), 400
        
        return jsonify({
            'message': 'Comida añadida exitosamente',
            'meal': meal.to_dict()
        }), 201

