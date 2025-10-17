# Backend/app/services/appointment_service.py
"""
Lógica de negocio para gestión de citas médicas
"""
from app.extensions import db
from app.models.appointment import Appointment
from app.models.user import User
from app.models.community import Community
from datetime import datetime, timedelta
from sqlalchemy import and_, or_

class AppointmentService:
    """Servicio para operaciones de citas médicas"""
    
    @staticmethod
    def create_appointment(data):
        """
        Crea una nueva cita médica
        Args:
            data (dict): Datos de la cita
        Returns:
            tuple: (cita creada, mensaje de error si existe)
        """
        try:
            # Validar que el paciente y el doctor existen
            patient = User.query.get(data.get('patient_id'))
            doctor = User.query.get(data.get('doctor_id'))
            
            if not patient or patient.role != 'patient':
                return None, "Paciente no encontrado o inválido"
            
            if not doctor or doctor.role != 'doctor':
                return None, "Médico no encontrado o inválido"
            
            # Parsear la fecha
            appointment_date = datetime.fromisoformat(data.get('appointment_date').replace('Z', '+00:00'))
            
            # Validar que la fecha no sea en el pasado
            if appointment_date < datetime.utcnow():
                return None, "No se pueden crear citas en el pasado"
            
            # Verificar disponibilidad del doctor
            duration = data.get('duration_minutes', 30)
            end_time = appointment_date + timedelta(minutes=duration)
            
            conflicting_appointments = Appointment.query.filter(
                and_(
                    Appointment.doctor_id == data.get('doctor_id'),
                    Appointment.status.in_(['scheduled', 'confirmed']),
                    or_(
                        # La nueva cita comienza durante una cita existente
                        and_(
                            Appointment.appointment_date <= appointment_date,
                            Appointment.appointment_date + timedelta(minutes=Appointment.duration_minutes) > appointment_date
                        ),
                        # La nueva cita termina durante una cita existente
                        and_(
                            Appointment.appointment_date < end_time,
                            Appointment.appointment_date + timedelta(minutes=Appointment.duration_minutes) >= end_time
                        ),
                        # La nueva cita envuelve una cita existente
                        and_(
                            Appointment.appointment_date >= appointment_date,
                            Appointment.appointment_date + timedelta(minutes=Appointment.duration_minutes) <= end_time
                        )
                    )
                )
            ).first()
            
            if conflicting_appointments:
                return None, "El médico ya tiene una cita programada en ese horario"
            
            # Si es visita domiciliaria, obtener la ubicación del paciente
            location = data.get('location')
            is_home_visit = data.get('is_home_visit', False)
            
            if is_home_visit and not location:
                # Intentar obtener la ubicación de la comunidad del paciente
                if patient.communities:
                    community = patient.communities[0]
                    location = f"{community.name} - {community.location}"
            
            # Crear la cita
            appointment = Appointment(
                patient_id=data.get('patient_id'),
                doctor_id=data.get('doctor_id'),
                appointment_date=appointment_date,
                duration_minutes=duration,
                appointment_type=data.get('appointment_type', 'consulta'),
                status='scheduled',
                reason=data.get('reason'),
                notes=data.get('notes'),
                location=location,
                is_home_visit=is_home_visit
            )
            
            db.session.add(appointment)
            db.session.commit()
            
            print(f"✅ Cita creada: ID {appointment.id}")
            return appointment, None
            
        except ValueError as e:
            return None, f"Formato de fecha inválido: {str(e)}"
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error creando cita: {str(e)}")
            return None, f"Error al crear cita: {str(e)}"
    
    @staticmethod
    def get_all_appointments(filters=None):
        """
        Obtiene todas las citas con filtros opcionales
        Args:
            filters (dict): Filtros opcionales
        Returns:
            list: Lista de citas enriquecidas
        """
        query = Appointment.query
        
        if filters:
            if 'patient_id' in filters:
                query = query.filter_by(patient_id=filters['patient_id'])
            
            if 'doctor_id' in filters:
                query = query.filter_by(doctor_id=filters['doctor_id'])
            
            if 'status' in filters:
                query = query.filter_by(status=filters['status'])
            
            if 'appointment_type' in filters:
                query = query.filter_by(appointment_type=filters['appointment_type'])
            
            if 'date_from' in filters:
                date_from = datetime.fromisoformat(filters['date_from'].replace('Z', '+00:00'))
                query = query.filter(Appointment.appointment_date >= date_from)
            
            if 'date_to' in filters:
                date_to = datetime.fromisoformat(filters['date_to'].replace('Z', '+00:00'))
                query = query.filter(Appointment.appointment_date <= date_to)
        
        appointments = query.order_by(Appointment.appointment_date.desc()).all()
        
        # Enriquecer con información del paciente y doctor
        enriched_appointments = []
        for appointment in appointments:
            appointment_dict = appointment.to_dict()
            
            # Información del paciente
            if appointment.patient:
                appointment_dict['patient_name'] = f"{appointment.patient.first_name} {appointment.patient.last_name}"
                appointment_dict['patient_info'] = {
                    'id': appointment.patient.id,
                    'name': f"{appointment.patient.first_name} {appointment.patient.last_name}",
                    'email': appointment.patient.email,
                    'phone': appointment.patient.phone
                }
            
            # Información del doctor
            if appointment.doctor:
                appointment_dict['doctor_name'] = f"Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}"
                appointment_dict['doctor_info'] = {
                    'id': appointment.doctor.id,
                    'name': f"Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}",
                    'email': appointment.doctor.email
                }
            
            enriched_appointments.append(appointment_dict)
        
        return enriched_appointments
    
    @staticmethod
    def get_appointment_by_id(appointment_id):
        """Obtiene una cita por ID con información completa"""
        appointment = Appointment.query.get(appointment_id)
        
        if not appointment:
            return None
        
        appointment_dict = appointment.to_dict()
        
        # Enriquecer con información
        if appointment.patient:
            appointment_dict['patient_name'] = f"{appointment.patient.first_name} {appointment.patient.last_name}"
            appointment_dict['patient_info'] = {
                'id': appointment.patient.id,
                'name': f"{appointment.patient.first_name} {appointment.patient.last_name}",
                'email': appointment.patient.email,
                'phone': appointment.patient.phone
            }
        
        if appointment.doctor:
            appointment_dict['doctor_name'] = f"Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}"
            appointment_dict['doctor_info'] = {
                'id': appointment.doctor.id,
                'name': f"Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}",
                'email': appointment.doctor.email
            }
        
        return appointment_dict
    
    @staticmethod
    def update_appointment(appointment_id, data):
        """
        Actualiza una cita existente
        Args:
            appointment_id (int): ID de la cita
            data (dict): Datos a actualizar
        Returns:
            tuple: (cita actualizada, mensaje de error si existe)
        """
        appointment = Appointment.query.get(appointment_id)
        
        if not appointment:
            return None, "Cita no encontrada"
        
        try:
            # Actualizar fecha si se proporciona
            if 'appointment_date' in data:
                appointment_date = datetime.fromisoformat(data['appointment_date'].replace('Z', '+00:00'))
                appointment.appointment_date = appointment_date
            
            # Actualizar otros campos
            if 'duration_minutes' in data:
                appointment.duration_minutes = data['duration_minutes']
            
            if 'appointment_type' in data:
                appointment.appointment_type = data['appointment_type']
            
            if 'status' in data:
                appointment.status = data['status']
            
            if 'reason' in data:
                appointment.reason = data['reason']
            
            if 'notes' in data:
                appointment.notes = data['notes']
            
            if 'location' in data:
                appointment.location = data['location']
            
            if 'is_home_visit' in data:
                appointment.is_home_visit = data['is_home_visit']
            
            db.session.commit()
            
            print(f"✅ Cita actualizada: ID {appointment.id}")
            return appointment, None
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error actualizando cita: {str(e)}")
            return None, f"Error al actualizar cita: {str(e)}"
    
    @staticmethod
    def cancel_appointment(appointment_id, reason=None):
        """
        Cancela una cita
        Args:
            appointment_id (int): ID de la cita
            reason (str): Motivo de cancelación
        Returns:
            tuple: (éxito, mensaje)
        """
        appointment = Appointment.query.get(appointment_id)
        
        if not appointment:
            return False, "Cita no encontrada"
        
        try:
            appointment.status = 'cancelled'
            if reason:
                appointment.notes = f"Cancelada: {reason}\n{appointment.notes or ''}"
            
            db.session.commit()
            
            print(f"✅ Cita cancelada: ID {appointment.id}")
            return True, "Cita cancelada exitosamente"
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error cancelando cita: {str(e)}")
            return False, f"Error al cancelar cita: {str(e)}"
    
    @staticmethod
    def get_doctor_availability(doctor_id, date):
        """
        Obtiene la disponibilidad de un doctor para una fecha específica
        Args:
            doctor_id (int): ID del doctor
            date (str): Fecha en formato ISO
        Returns:
            list: Lista de horarios disponibles
        """
        try:
            target_date = datetime.fromisoformat(date.replace('Z', '+00:00')).date()
            
            # Obtener todas las citas del doctor para ese día
            appointments = Appointment.query.filter(
                and_(
                    Appointment.doctor_id == doctor_id,
                    Appointment.status.in_(['scheduled', 'confirmed']),
                    db.func.date(Appointment.appointment_date) == target_date
                )
            ).all()
            
            # Horario de trabajo (8:00 AM a 5:00 PM)
            start_hour = 8
            end_hour = 17
            
            # Generar slots de 30 minutos
            available_slots = []
            current_time = datetime.combine(target_date, datetime.min.time()).replace(hour=start_hour)
            end_time = datetime.combine(target_date, datetime.min.time()).replace(hour=end_hour)
            
            while current_time < end_time:
                slot_end = current_time + timedelta(minutes=30)
                
                # Verificar si hay conflicto con citas existentes
                is_available = True
                for appointment in appointments:
                    appointment_end = appointment.appointment_date + timedelta(minutes=appointment.duration_minutes)
                    
                    if (current_time < appointment_end and slot_end > appointment.appointment_date):
                        is_available = False
                        break
                
                if is_available and current_time > datetime.utcnow():
                    available_slots.append(current_time.isoformat())
                
                current_time = slot_end
            
            return available_slots
            
        except Exception as e:
            print(f"❌ Error obteniendo disponibilidad: {str(e)}")
            return []