# Backend/app/routes/appointment_routes.py
"""
Rutas para gestión de citas médicas
"""
from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers.appointment_controller import AppointmentController

# Crear Blueprint
appointment_bp = Blueprint('appointments', __name__, url_prefix='/api/appointments')

# Definir rutas
@appointment_bp.route('', methods=['GET'])
@jwt_required()
def get_appointments():
    """Obtener todas las citas"""
    return AppointmentController.get_appointments()

@appointment_bp.route('/<int:appointment_id>', methods=['GET'])
@jwt_required()
def get_appointment(appointment_id):
    """Obtener una cita por ID"""
    return AppointmentController.get_appointment(appointment_id)

@appointment_bp.route('', methods=['POST'])
@jwt_required()
def create_appointment():
    """Crear una nueva cita"""
    return AppointmentController.create_appointment()

@appointment_bp.route('/<int:appointment_id>', methods=['PUT'])
@jwt_required()
def update_appointment(appointment_id):
    """Actualizar una cita existente"""
    return AppointmentController.update_appointment(appointment_id)

@appointment_bp.route('/<int:appointment_id>', methods=['DELETE'])
@jwt_required()
def cancel_appointment(appointment_id):
    """Cancelar una cita"""
    return AppointmentController.cancel_appointment(appointment_id)

@appointment_bp.route('/doctors/<int:doctor_id>/availability', methods=['GET'])
@jwt_required()
def get_doctor_availability(doctor_id):
    """Obtener disponibilidad de un doctor"""
    return AppointmentController.get_doctor_availability(doctor_id)