# Backend/app/routes/patient_routes.py

from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.controllers.patient_controller import PatientController

# Crear Blueprint
patient_bp = Blueprint('patients', __name__, url_prefix='/api/patients')

# ✅ Añadir manejo de OPTIONS
@patient_bp.before_request
def handle_options():
    """Manejar peticiones OPTIONS (preflight)"""
    if request.method == 'OPTIONS':
        return '', 200

# Definir rutas
@patient_bp.route('', methods=['GET', 'OPTIONS'])
@jwt_required(optional=True)  # ✅ CAMBIAR: optional=True para desarrollo
def get_patients():
    """Obtener todos los pacientes"""
    return PatientController.get_patients()

@patient_bp.route('/<int:patient_id>', methods=['GET', 'OPTIONS'])
@jwt_required(optional=True)  # ✅ CAMBIAR
def get_patient(patient_id):
    """Obtener un paciente por ID"""
    return PatientController.get_patient(patient_id)

@patient_bp.route('', methods=['POST', 'OPTIONS'])
@jwt_required(optional=True)  # ✅ CAMBIAR
def create_patient():
    """Crear un nuevo paciente"""
    return PatientController.create_patient()

@patient_bp.route('/<int:patient_id>', methods=['PUT', 'OPTIONS'])
@jwt_required(optional=True)  # ✅ CAMBIAR
def update_patient(patient_id):
    """Actualizar un paciente existente"""
    return PatientController.update_patient(patient_id)