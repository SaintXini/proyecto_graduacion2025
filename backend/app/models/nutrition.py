from app.extensions import db
from datetime import datetime


class NutritionPlan(db.Model):
    """
    Plan de Nutrición asignado a pacientes
    """
    __tablename__ = 'nutrition_plans'
    
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    calories_target = db.Column(db.Integer)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    status = db.Column(db.String(20), default='active')  # active, completed, cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    patient = db.relationship('User', back_populates='nutrition_plans')
    meals = db.relationship('Meal', back_populates='nutrition_plan', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'title': self.title,
            'description': self.description,
            'calories_target': self.calories_target,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'status': self.status,
            'meals': [meal.to_dict() for meal in self.meals],
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Meal(db.Model):
    """
    Comidas individuales dentro de un plan de nutrición
    """
    __tablename__ = 'meals'
    
    id = db.Column(db.Integer, primary_key=True)
    nutrition_plan_id = db.Column(db.Integer, db.ForeignKey('nutrition_plans.id'), nullable=False)
    meal_type = db.Column(db.String(20))  # breakfast, lunch, dinner, snack
    name = db.Column(db.String(200))
    description = db.Column(db.Text)
    calories = db.Column(db.Integer)
    proteins = db.Column(db.Float)
    carbohydrates = db.Column(db.Float)
    fats = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    nutrition_plan = db.relationship('NutritionPlan', back_populates='meals')
    
    def to_dict(self):
        return {
            'id': self.id,
            'meal_type': self.meal_type,
            'name': self.name,
            'description': self.description,
            'calories': self.calories,
            'proteins': self.proteins,
            'carbohydrates': self.carbohydrates,
            'fats': self.fats
        }
