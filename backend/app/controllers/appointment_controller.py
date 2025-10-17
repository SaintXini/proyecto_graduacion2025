# Backend/app/controllers/appointment_controller.py
"""
Controlador para operaciones de citas médicas
"""
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.appointment_service import AppointmentService
from app.utils.decorators import role_required

class AppointmentController:
    """Controlador para operaciones de citas médicas"""
    
    @staticmethod
    @jwt_required()
    def get_appointments():
        """
        Obtiene todas las citas médicas
        GET /api/appointments
        Query params: patient_id, doctor_id, status, appointment_type, date_from, date_to
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"🔵 Usuario {current_user_id} solicitando citas")
            
            filters = {}
            
            # Filtros opcionales
            if request.args.get('patient_id'):
                filters['patient_id'] = request.args.get('patient_id')
            
            if request.args.get('doctor_id'):
                filters['doctor_id'] = request.args.get('doctor_id')
            
            if request.args.get('status'):
                filters['status'] = request.args.get('status')
            
            if request.args.get('appointment_type'):
                filters['appointment_type'] = request.args.get('appointment_type')
            
            if request.args.get('date_from'):
                filters['date_from'] = request.args.get('date_from')
            
            if request.args.get('date_to'):
                filters['date_to'] = request.args.get('date_to')
            
            appointments = AppointmentService.get_all_appointments(filters)
            print(f"✅ Citas encontradas: {len(appointments)}")
            
            return jsonify(appointments), 200
            
        except Exception as e:
            print(f"❌ Error en get_appointments: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({'message': 'Error al obtener citas', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    def get_appointment(appointment_id):
        """
        Obtiene una cita por ID
        GET /api/appointments/:id
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"🔵 Usuario {current_user_id} solicitando cita {appointment_id}")
            
            appointment = AppointmentService.get_appointment_by_id(appointment_id)
            
            if not appointment:
                return jsonify({'message': 'Cita no encontrada'}), 404
            
            return jsonify(appointment), 200
            
        except Exception as e:
            print(f"❌ Error en get_appointment: {str(e)}")
            return jsonify({'message': 'Error al obtener cita', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    @role_required('doctor', 'admin')
    def create_appointment():
        """
        Crea una nueva cita médica
        POST /api/appointments
        Body: {patient_id, doctor_id, appointment_date, duration_minutes, appointment_type, reason, notes, location, is_home_visit}
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"🔵 Usuario {current_user_id} creando cita")
            
            data = request.get_json()
            print(f"🔵 Datos recibidos: {data}")
            
            # Validar campos obligatorios
            required_fields = ['patient_id', 'doctor_id', 'appointment_date']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({'message': f'{field} es requerido'}), 400
            
            appointment, error = AppointmentService.create_appointment(data)
            
            if error:
                print(f"❌ Error creando cita: {error}")
                return jsonify({'message': error}), 400
            
            print(f"✅ Cita creada exitosamente: ID {appointment.id}")
            return jsonify({
                'message': 'Cita creada exitosamente',
                'appointment': appointment.to_dict()
            }), 201
            
        except Exception as e:
            print(f"❌ Error en create_appointment: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({'message': 'Error al crear cita', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    @role_required('doctor', 'admin')
    def update_appointment(appointment_id):
        """
        Actualiza una cita existente
        PUT /api/appointments/:id
        Body: {appointment_date, duration_minutes, appointment_type, status, reason, notes, location, is_home_visit}
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"🔵 Usuario {current_user_id} actualizando cita {appointment_id}")
            
            data = request.get_json()
            
            appointment, error = AppointmentService.update_appointment(appointment_id, data)
            
            if error:
                print(f"❌ Error actualizando cita: {error}")
                return jsonify({'message': error}), 400
            
            print(f"✅ Cita actualizada exitosamente")
            return jsonify({
                'message': 'Cita actualizada exitosamente',
                'appointment': appointment.to_dict()
            }), 200
            
        except Exception as e:
            print(f"❌ Error en update_appointment: {str(e)}")
            return jsonify({'message': 'Error al actualizar cita', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    @role_required('doctor', 'admin', 'patient')
    def cancel_appointment(appointment_id):
        """
        Cancela una cita
        DELETE /api/appointments/:id
        Body: {reason} (opcional)
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"🔵 Usuario {current_user_id} cancelando cita {appointment_id}")
            
            data = request.get_json() or {}
            reason = data.get('reason')
            
            success, message = AppointmentService.cancel_appointment(appointment_id, reason)
            
            if not success:
                return jsonify({'message': message}), 400
            
            print(f"✅ Cita cancelada exitosamente")
            return jsonify({'message': message}), 200
            
        except Exception as e:
            print(f"❌ Error en cancel_appointment: {str(e)}")
            return jsonify({'message': 'Error al cancelar cita', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    def get_doctor_availability(doctor_id):
        """
        Obtiene la disponibilidad de un doctor para una fecha específica
        GET /api/appointments/doctors/:doctor_id/availability
        Query params: date (ISO format)
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"🔵 Usuario {current_user_id} consultando disponibilidad del doctor {doctor_id}")
            
            date = request.args.get('date')
            
            if not date:
                return jsonify({'message': 'La fecha es requerida'}), 400
            
            available_slots = AppointmentService.get_doctor_availability(doctor_id, date)
            
            return jsonify({
                'doctor_id': doctor_id,
                'date': date,
                'available_slots': available_slots
            }), 200
            
        except Exception as e:
            print(f"❌ Error en get_doctor_availability: {str(e)}")
            return jsonify({'message': 'Error al obtener disponibilidad', 'error': str(e)}), 500