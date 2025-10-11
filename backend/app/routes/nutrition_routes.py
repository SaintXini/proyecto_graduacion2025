from flask import Blueprint
from flask_jwt_extended import jwt_required  # ✅ IMPORTAR
from app.controllers.nutrition_controller import NutritionController

# Crear Blueprint
nutrition_bp = Blueprint('nutrition', __name__, url_prefix='/api/nutrition')

# Definir rutas
@nutrition_bp.route('', methods=['GET'])
@jwt_required()  # ✅ AGREGAR
def get_nutrition_plans():
    """Obtener planes de nutrición"""
    return NutritionController.get_nutrition_plans()

@nutrition_bp.route('/<int:plan_id>', methods=['GET'])
@jwt_required()  # ✅ AGREGAR
def get_nutrition_plan(plan_id):
    """Obtener un plan de nutrición por ID"""
    return NutritionController.get_nutrition_plan(plan_id)

@nutrition_bp.route('', methods=['POST'])
@jwt_required()  # ✅ AGREGAR
def create_nutrition_plan():
    """Crear un nuevo plan de nutrición"""
    return NutritionController.create_nutrition_plan()

@nutrition_bp.route('/<int:plan_id>/meals', methods=['POST'])
@jwt_required()  # ✅ AGREGAR
def add_meal(plan_id):
    """Añadir una comida a un plan de nutrición"""
    return NutritionController.add_meal(plan_id)