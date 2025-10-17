# Backend/app/services/traceability_service.py

"""
Lógica de negocio para trazabilidad médica
"""
from app.extensions import db
from app.models.traceability import MedicalRecord, Prescription
from app.models.user import User

class TraceabilityService:
    """Servicio para operaciones de trazabilidad médica"""
    
    @staticmethod
    def create_medical_record(data):
        """
        Crea un nuevo registro médico
        Args:
            data (dict): Datos del registro médico
        Returns:
            tuple: (registro creado, mensaje de error si existe)
        """
        try:
            record = MedicalRecord(
                patient_id=data.get('patient_id'),
                doctor_id=data.get('doctor_id'),
                diagnosis=data.get('diagnosis'),
                symptoms=data.get('symptoms'),
                treatment=data.get('treatment'),
                notes=data.get('notes')
            )
            db.session.add(record)
            db.session.commit()
            return record, None
        except Exception as e:
            db.session.rollback()
            return None, f"Error al crear registro médico: {str(e)}"
    
    @staticmethod
    def get_medical_records(patient_id=None, doctor_id=None):
        """
        Obtiene registros médicos con filtros opcionales
        Args:
            patient_id (int): ID del paciente (opcional)
            doctor_id (int): ID del doctor (opcional)
        Returns:
            list: Lista de registros médicos
        """
        query = MedicalRecord.query
        
        if patient_id:
            query = query.filter_by(patient_id=patient_id)
        if doctor_id:
            query = query.filter_by(doctor_id=doctor_id)
        
        records = query.order_by(MedicalRecord.visit_date.desc()).all()
        
        # Enriquecer los registros con información de doctor y paciente
        enriched_records = []
        for record in records:
            record_dict = record.to_dict()
            
            # Obtener información del doctor
            doctor = User.query.get(record.doctor_id)
            if doctor:
                record_dict['doctor_name'] = f"{doctor.first_name} {doctor.last_name}" if doctor.first_name else doctor.username
                record_dict['doctor_info'] = {
                    'id': doctor.id,
                    'name': f"{doctor.first_name} {doctor.last_name}" if doctor.first_name else doctor.username,
                    'email': doctor.email
                }
            else:
                record_dict['doctor_name'] = f"Doctor ID: {record.doctor_id}"
                record_dict['doctor_info'] = None
            
            # Obtener información del paciente
            patient = User.query.get(record.patient_id)
            if patient:
                record_dict['patient_name'] = f"{patient.first_name} {patient.last_name}" if patient.first_name else patient.username
                record_dict['patient_info'] = {
                    'id': patient.id,
                    'name': f"{patient.first_name} {patient.last_name}" if patient.first_name else patient.username,
                    'email': patient.email,
                    'phone': patient.phone
                }
            else:
                record_dict['patient_name'] = f"Paciente ID: {record.patient_id}"
                record_dict['patient_info'] = None
            
            enriched_records.append(record_dict)
        
        return enriched_records
    
    @staticmethod
    def get_medical_record_by_id(record_id):
        """Obtiene un registro médico por ID con información completa"""
        record = MedicalRecord.query.get(record_id)
        if not record:
            return None
        
        record_dict = record.to_dict()
        
        # Obtener información del doctor
        doctor = User.query.get(record.doctor_id)
        if doctor:
            record_dict['doctor_name'] = f"{doctor.first_name} {doctor.last_name}" if doctor.first_name else doctor.username
            record_dict['doctor_info'] = {
                'id': doctor.id,
                'name': f"{doctor.first_name} {doctor.last_name}" if doctor.first_name else doctor.username,
                'email': doctor.email,
                'role': doctor.role
            }
        
        # Obtener información del paciente
        patient = User.query.get(record.patient_id)
        if patient:
            record_dict['patient_name'] = f"{patient.first_name} {patient.last_name}" if patient.first_name else patient.username
            record_dict['patient_info'] = {
                'id': patient.id,
                'name': f"{patient.first_name} {patient.last_name}" if patient.first_name else patient.username,
                'email': patient.email,
                'phone': patient.phone
            }
        
        return record_dict
    
    @staticmethod
    def add_prescription(record_id, prescription_data):
        """
        Añade una prescripción a un registro médico
        Args:
            record_id (int): ID del registro médico
            prescription_data (dict): Datos de la prescripción
        Returns:
            tuple: (prescripción creada, mensaje de error si existe)
        """
        record = MedicalRecord.query.get(record_id)
        if not record:
            return None, "Registro médico no encontrado"
        
        try:
            prescription = Prescription(
                medical_record_id=record_id,
                medication_name=prescription_data.get('medication_name'),
                dosage=prescription_data.get('dosage'),
                frequency=prescription_data.get('frequency'),
                duration=prescription_data.get('duration'),
                instructions=prescription_data.get('instructions')
            )
            
            db.session.add(prescription)
            db.session.commit()
            return prescription, None
        except Exception as e:
            db.session.rollback()
            return None, f"Error al añadir prescripción: {str(e)}"
