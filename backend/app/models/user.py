from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime


class User(db.Model):
    """
    Modelo de Usuario
    Representa a todos los usuarios del sistema con diferentes roles
    """
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # admin, authority, doctor, patient
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    communities = db.relationship('Community', secondary='user_communities', back_populates='members')
    medical_records = db.relationship('MedicalRecord', back_populates='patient', foreign_keys='MedicalRecord.patient_id')
    diagnoses_made = db.relationship('MedicalRecord', back_populates='doctor', foreign_keys='MedicalRecord.doctor_id')
    nutrition_plans = db.relationship('NutritionPlan', back_populates='patient')
    reports_created = db.relationship('Report', back_populates='created_by_user')
    
    def set_password(self, password):
        """Hashear contraseña antes de guardar"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verificar contraseña"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convertir a diccionario para JSON"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }