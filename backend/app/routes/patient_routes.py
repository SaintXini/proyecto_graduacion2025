from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers.patient_controller import PatientController

# Crear Blueprint
patient_bp = Blueprint('patients', __name__, url_prefix='/api/patients')

# Definir rutas
@patient_bp.route('', methods=['GET'])
@jwt_required()
def get_patients():
    """Obtener todos los pacientes"""
    return PatientController.get_patients()

@patient_bp.route('/<int:patient_id>', methods=['GET'])
@jwt_required()
def get_patient(patient_id):
    """Obtener un paciente por ID"""
    return PatientController.get_patient(patient_id)

@patient_bp.route('', methods=['POST'])
@jwt_required()
def create_patient():
    """Crear un nuevo paciente"""
    return PatientController.create_patient()

@patient_bp.route('/<int:patient_id>', methods=['PUT'])
@jwt_required()
def update_patient(patient_id):
    """Actualizar un paciente existente"""
    return PatientController.update_patient(patient_id)
