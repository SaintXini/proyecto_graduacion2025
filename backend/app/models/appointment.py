# Backend/app/models/appointment.py
"""
Modelo de Citas Médicas
"""
from app.extensions import db
from datetime import datetime

class Appointment(db.Model):
    """
    Modelo de Citas Médicas
    """
    __tablename__ = 'appointments'
    
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Fecha y hora de la cita
    appointment_date = db.Column(db.DateTime, nullable=False)
    
    # Duración estimada en minutos
    duration_minutes = db.Column(db.Integer, default=30)
    
    # Tipo de cita
    appointment_type = db.Column(db.String(50))  # consulta, seguimiento, urgencia, preventiva
    
    # Estado de la cita
    status = db.Column(db.String(20), default='scheduled')  # scheduled, confirmed, completed, cancelled, no_show
    
    # Motivo de la cita
    reason = db.Column(db.Text)
    
    # Notas adicionales
    notes = db.Column(db.Text)
    
    # Ubicación (si es domiciliaria)
    location = db.Column(db.String(200))
    is_home_visit = db.Column(db.Boolean, default=False)
    
    # Recordatorios
    reminder_sent = db.Column(db.Boolean, default=False)
    reminder_sent_at = db.Column(db.DateTime)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    patient = db.relationship('User', foreign_keys=[patient_id], backref='patient_appointments')
    doctor = db.relationship('User', foreign_keys=[doctor_id], backref='doctor_appointments')
    
    def to_dict(self):
        """Convertir a diccionario para JSON"""
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'doctor_id': self.doctor_id,
            'appointment_date': self.appointment_date.isoformat() if self.appointment_date else None,
            'duration_minutes': self.duration_minutes,
            'appointment_type': self.appointment_type,
            'status': self.status,
            'reason': self.reason,
            'notes': self.notes,
            'location': self.location,
            'is_home_visit': self.is_home_visit,
            'reminder_sent': self.reminder_sent,
            'reminder_sent_at': self.reminder_sent_at.isoformat() if self.reminder_sent_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Appointment {self.id} - Patient: {self.patient_id}, Doctor: {self.doctor_id}, Date: {self.appointment_date}>'