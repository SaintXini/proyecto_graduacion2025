"""
Lógica de negocio para manejo de planes de nutrición
"""

from app.extensions import db
from app.models.nutrition import NutritionPlan, Meal
from datetime import datetime


class NutritionService:
    """Servicio para operaciones de nutrición"""
    
    @staticmethod
    def create_nutrition_plan(data):
        """
        Crea un nuevo plan de nutrición
        
        Args:
            data (dict): Datos del plan de nutrición
        
        Returns:
            tuple: (plan creado, mensaje de error si existe)
        """
        try:
            plan = NutritionPlan(
                patient_id=data.get('patient_id'),
                title=data.get('title'),
                description=data.get('description'),
                calories_target=data.get('calories_target'),
                start_date=datetime.strptime(data.get('start_date'), '%Y-%m-%d').date() if data.get('start_date') else None,
                end_date=datetime.strptime(data.get('end_date'), '%Y-%m-%d').date() if data.get('end_date') else None,
                status=data.get('status', 'active')
            )
            
            db.session.add(plan)
            db.session.commit()
            
            return plan, None
            
        except Exception as e:
            db.session.rollback()
            return None, f"Error al crear plan de nutrición: {str(e)}"
    
    @staticmethod
    def get_nutrition_plans(patient_id=None):
        """
        Obtiene planes de nutrición, opcionalmente filtrados por paciente
        
        Args:
            patient_id (int): ID del paciente (opcional)
        
        Returns:
            list: Lista de planes de nutrición
        """
        query = NutritionPlan.query
        
        if patient_id:
            query = query.filter_by(patient_id=patient_id)
        
        return query.all()
    
    @staticmethod
    def get_nutrition_plan_by_id(plan_id):
        """Obtiene un plan de nutrición por ID"""
        return NutritionPlan.query.get(plan_id)
    
    @staticmethod
    def add_meal_to_plan(plan_id, meal_data):
        """
        Añade una comida a un plan de nutrición
        
        Args:
            plan_id (int): ID del plan
            meal_data (dict): Datos de la comida
        
        Returns:
            tuple: (comida creada, mensaje de error si existe)
        """
        plan = NutritionPlan.query.get(plan_id)
        
        if not plan:
            return None, "Plan de nutrición no encontrado"
        
        try:
            meal = Meal(
                nutrition_plan_id=plan_id,
                meal_type=meal_data.get('meal_type'),
                name=meal_data.get('name'),
                description=meal_data.get('description'),
                calories=meal_data.get('calories'),
                proteins=meal_data.get('proteins'),
                carbohydrates=meal_data.get('carbohydrates'),
                fats=meal_data.get('fats')
            )
            
            db.session.add(meal)
            db.session.commit()
            
            return meal, None
            
        except Exception as e:
            db.session.rollback()
            return None, f"Error al añadir comida: {str(e)}"

