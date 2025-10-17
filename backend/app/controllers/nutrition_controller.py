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
        try:
            # Obtener el usuario actual para logging
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} solicitando planes de nutrición")
            
            patient_id = request.args.get('patient_id')
            plans = NutritionService.get_nutrition_plans(patient_id)
            
            print(f"Planes encontrados: {len(plans)}")
            
            return jsonify([plan.to_dict() for plan in plans]), 200
        except Exception as e:
            print(f"Error en get_nutrition_plans: {str(e)}")
            return jsonify({'message': 'Error al obtener planes de nutrición', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    def get_nutrition_plan(plan_id):
        """
        Obtiene un plan de nutrición por ID
        GET /api/nutrition/:id
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} solicitando plan {plan_id}")
            
            plan = NutritionService.get_nutrition_plan_by_id(plan_id)
            
            if not plan:
                return jsonify({'message': 'Plan de nutrición no encontrado'}), 404
            
            return jsonify(plan.to_dict()), 200
        except Exception as e:
            print(f"Error en get_nutrition_plan: {str(e)}")
            return jsonify({'message': 'Error al obtener plan de nutrición', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    @role_required('doctor', 'admin')
    def create_nutrition_plan():
        """
        Crea un nuevo plan de nutrición
        POST /api/nutrition
        Body: {patient_id, title, description, calories_target, start_date, end_date}
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} creando plan de nutrición")
            
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
        except Exception as e:
            print(f"Error en create_nutrition_plan: {str(e)}")
            return jsonify({'message': 'Error al crear plan de nutrición', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    @role_required('doctor', 'admin')
    def add_meal(plan_id):
        """
        Añade una comida a un plan de nutrición
        POST /api/nutrition/:id/meals
        Body: {meal_type, name, description, calories, proteins, carbohydrates, fats}
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} añadiendo comida al plan {plan_id}")
            
            data = request.get_json()
            
            meal, error = NutritionService.add_meal_to_plan(plan_id, data)
            
            if error:
                return jsonify({'message': error}), 400
            
            return jsonify({
                'message': 'Comida añadida exitosamente',
                'meal': meal.to_dict()
            }), 201
        except Exception as e:
            print(f"Error en add_meal: {str(e)}")
            return jsonify({'message': 'Error al añadir comida', 'error': str(e)}), 500
