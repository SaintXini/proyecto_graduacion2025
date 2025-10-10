from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.traceability_service import TraceabilityService
from app.utils.decorators import role_required


class TraceabilityController:
    """Controlador para operaciones de trazabilidad médica"""
    
    @staticmethod
    @jwt_required()
    def get_medical_records():
        """
        Obtiene registros médicos
        GET /api/traceability
        Query params: patient_id, doctor_id
        """
        patient_id = request.args.get('patient_id')
        doctor_id = request.args.get('doctor_id')
        
        records = TraceabilityService.get_medical_records(patient_id, doctor_id)
        
        return jsonify([record.to_dict() for record in records]), 200
    
    @staticmethod
    @jwt_required()
    def get_medical_record(record_id):
        """
        Obtiene un registro médico por ID
        GET /api/traceability/:id
        """
        record = TraceabilityService.get_medical_record_by_id(record_id)
        
        if not record:
            return jsonify({'message': 'Registro médico no encontrado'}), 404
        
        return jsonify(record.to_dict()), 200
    
    @staticmethod
    @jwt_required()
    @role_required('doctor', 'admin')
    def create_medical_record():
        """
        Crea un nuevo registro médico
        POST /api/traceability
        Body: {patient_id, doctor_id, diagnosis, symptoms, treatment, notes}
        """
        data = request.get_json()
        
        required_fields = ['patient_id', 'doctor_id', 'diagnosis']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'message': f'{field} es requerido'}), 400
        
        record, error = TraceabilityService.create_medical_record(data)
        
        if error:
            return jsonify({'message': error}), 400
        
        return jsonify({
            'message': 'Registro médico creado exitosamente',
            'record': record.to_dict()
        }), 201
    
    @staticmethod
    @jwt_required()
    @role_required('doctor', 'admin')
    def add_prescription(record_id):
        """
        Añade una prescripción a un registro médico
        POST /api/traceability/:id/prescriptions
        Body: {medication_name, dosage, frequency, duration, instructions}
        """
        data = request.get_json()
        
        if not data.get('medication_name'):
            return jsonify({'message': 'medication_name es requerido'}), 400
        
        prescription, error = TraceabilityService.add_prescription(record_id, data)
        
        if error:
            return jsonify({'message': error}), 400
        
        return jsonify({
            'message': 'Prescripción añadida exitosamente',
            'prescription': prescription.to_dict()
        }), 201

