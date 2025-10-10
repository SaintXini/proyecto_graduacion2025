from app.extensions import db
from datetime import datetime


class MedicalRecord(db.Model):
    """
    Historial médico de pacientes
    """
    __tablename__ = 'medical_records'
    
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    diagnosis = db.Column(db.Text, nullable=False)
    symptoms = db.Column(db.Text)
    treatment = db.Column(db.Text)
    notes = db.Column(db.Text)
    visit_date = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    patient = db.relationship('User', back_populates='medical_records', foreign_keys=[patient_id])
    doctor = db.relationship('User', back_populates='diagnoses_made', foreign_keys=[doctor_id])
    prescriptions = db.relationship('Prescription', back_populates='medical_record', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'doctor_id': self.doctor_id,
            'diagnosis': self.diagnosis,
            'symptoms': self.symptoms,
            'treatment': self.treatment,
            'notes': self.notes,
            'visit_date': self.visit_date.isoformat() if self.visit_date else None,
            'prescriptions': [p.to_dict() for p in self.prescriptions],
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Prescription(db.Model):
    """
    Prescripciones médicas
    """
    __tablename__ = 'prescriptions'
    
    id = db.Column(db.Integer, primary_key=True)
    medical_record_id = db.Column(db.Integer, db.ForeignKey('medical_records.id'), nullable=False)
    medication_name = db.Column(db.String(200), nullable=False)
    dosage = db.Column(db.String(100))
    frequency = db.Column(db.String(100))
    duration = db.Column(db.String(100))
    instructions = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    medical_record = db.relationship('MedicalRecord', back_populates='prescriptions')
    
    def to_dict(self):
        return {
            'id': self.id,
            'medication_name': self.medication_name,
            'dosage': self.dosage,
            'frequency': self.frequency,
            'duration': self.duration,
            'instructions': self.instructions
        }

