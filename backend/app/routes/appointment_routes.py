# Backend/app/routes/appointment_routes.py
"""
Rutas para gestión de citas médicas
"""
from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.appointment_controller import AppointmentController

# Crear Blueprint
appointment_bp = Blueprint('appointments', __name__, url_prefix='/api/appointments')

# TEMPORAL: Sin autenticación para testing
@appointment_bp.route('', methods=['GET'])
# @jwt_required()  # Comentado temporalmente
def get_appointments():
    """Obtener todas las citas"""
    return AppointmentController.get_appointments()

@appointment_bp.route('/<int:appointment_id>', methods=['GET'])
# @jwt_required()  # Comentado temporalmente
def get_appointment(appointment_id):
    """Obtener una cita por ID"""
    return AppointmentController.get_appointment(appointment_id)

@appointment_bp.route('', methods=['POST'])
# @jwt_required()  # Comentado temporalmente
def create_appointment():
    """Crear una nueva cita"""
    return AppointmentController.create_appointment()

@appointment_bp.route('/<int:appointment_id>', methods=['PUT'])
# @jwt_required()  # Comentado temporalmente
def update_appointment(appointment_id):
    """Actualizar una cita existente"""
    return AppointmentController.update_appointment(appointment_id)

@appointment_bp.route('/<int:appointment_id>', methods=['DELETE'])
# @jwt_required()  # Comentado temporalmente
def cancel_appointment(appointment_id):
    """Cancelar una cita"""
    return AppointmentController.cancel_appointment(appointment_id)

@appointment_bp.route('/doctors/<int:doctor_id>/availability', methods=['GET'])
# @jwt_required()  # Comentado temporalmente
def get_doctor_availability(doctor_id):
    """Obtener disponibilidad de un doctor"""
    return AppointmentController.get_doctor_availability(doctor_id)