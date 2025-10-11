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
        try:
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} solicitando registros médicos")
            
            patient_id = request.args.get('patient_id')
            doctor_id = request.args.get('doctor_id')
            
            records = TraceabilityService.get_medical_records(patient_id, doctor_id)
            print(f"Registros médicos encontrados: {len(records)}")
            
            return jsonify([record.to_dict() for record in records]), 200
        except Exception as e:
            print(f"Error en get_medical_records: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({'message': 'Error al obtener registros médicos', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    def get_medical_record(record_id):
        """
        Obtiene un registro médico por ID
        GET /api/traceability/:id
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} solicitando registro médico {record_id}")
            
            record = TraceabilityService.get_medical_record_by_id(record_id)
            
            if not record:
                return jsonify({'message': 'Registro médico no encontrado'}), 404
            
            return jsonify(record.to_dict()), 200
        except Exception as e:
            print(f"Error en get_medical_record: {str(e)}")
            return jsonify({'message': 'Error al obtener registro médico', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    @role_required('doctor', 'admin')
    def create_medical_record():
        """
        Crea un nuevo registro médico
        POST /api/traceability
        Body: {patient_id, doctor_id, diagnosis, symptoms, treatment, notes}
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} creando registro médico")
            
            data = request.get_json()
            
            required_fields = ['patient_id', 'doctor_id', 'diagnosis']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({'message': f'{field} es requerido'}), 400
            
            record, error = TraceabilityService.create_medical_record(data)
            
            if error:
                print(f"Error creando registro médico: {error}")
                return jsonify({'message': error}), 400
            
            return jsonify({
                'message': 'Registro médico creado exitosamente',
                'record': record.to_dict()
            }), 201
        except Exception as e:
            print(f"Error en create_medical_record: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({'message': 'Error al crear registro médico', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    @role_required('doctor', 'admin')
    def add_prescription(record_id):
        """
        Añade una prescripción a un registro médico
        POST /api/traceability/:id/prescriptions
        Body: {medication_name, dosage, frequency, duration, instructions}
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} añadiendo prescripción al registro {record_id}")
            
            data = request.get_json()
            
            if not data.get('medication_name'):
                return jsonify({'message': 'medication_name es requerido'}), 400
            
            prescription, error = TraceabilityService.add_prescription(record_id, data)
            
            if error:
                print(f"Error añadiendo prescripción: {error}")
                return jsonify({'message': error}), 400
            
            return jsonify({
                'message': 'Prescripción añadida exitosamente',
                'prescription': prescription.to_dict()
            }), 201
        except Exception as e:
            print(f"Error en add_prescription: {str(e)}")
            return jsonify({'message': 'Error al añadir prescripción', 'error': str(e)}), 500