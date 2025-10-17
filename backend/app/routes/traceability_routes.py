from flask import Blueprint
from flask_jwt_extended import jwt_required  # ✅ IMPORTAR
from app.controllers.traceability_controller import TraceabilityController

# Crear Blueprint
traceability_bp = Blueprint('traceability', __name__, url_prefix='/api/traceability')

# Definir rutas
@traceability_bp.route('', methods=['GET'])
@jwt_required()  # ✅ AGREGAR
def get_medical_records():
    """Obtener registros médicos"""
    return TraceabilityController.get_medical_records()

@traceability_bp.route('/<int:record_id>', methods=['GET'])
@jwt_required()  # ✅ AGREGAR
def get_medical_record(record_id):
    """Obtener un registro médico por ID"""
    return TraceabilityController.get_medical_record(record_id)

@traceability_bp.route('', methods=['POST'])
@jwt_required()  # ✅ AGREGAR
def create_medical_record():
    """Crear un nuevo registro médico"""
    return TraceabilityController.create_medical_record()

@traceability_bp.route('/<int:record_id>/prescriptions', methods=['POST'])
@jwt_required()  # ✅ AGREGAR
def add_prescription(record_id):
    """Añadir una prescripción a un registro médico"""
    return TraceabilityController.add_prescription(record_id)

