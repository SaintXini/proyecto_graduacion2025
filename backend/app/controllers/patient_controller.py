# Backend/app/controllers/patient_controller.py
"""
Controlador para operaciones específicas de pacientes
"""
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.user_service import UserService
from app.utils.decorators import role_required
from app.models.community import Community
from app.extensions import db

class PatientController:
    """Controlador para operaciones de pacientes"""
    
    @staticmethod
    @jwt_required()
    @role_required('admin', 'authority', 'doctor')
    def get_patients():
        """
        Obtiene todos los pacientes (usuarios con rol 'patient')
        GET /api/patients
        Query params: is_active
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} solicitando lista de pacientes")
            
            filters = {'role': 'patient'}
            
            if request.args.get('is_active'):
                filters['is_active'] = request.args.get('is_active').lower() == 'true'
            
            patients = UserService.get_all_users(filters)
            print(f"Pacientes encontrados: {len(patients)}")
            
            return jsonify([patient.to_dict() for patient in patients]), 200
            
        except Exception as e:
            print(f"Error en get_patients: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({'message': 'Error al obtener pacientes', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    @role_required('admin', 'authority', 'doctor')
    def get_patient(patient_id):
        """
        Obtiene un paciente por ID
        GET /api/patients/:id
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} solicitando paciente {patient_id}")
            
            patient = UserService.get_user_by_id(patient_id)
            
            if not patient:
                return jsonify({'message': 'Paciente no encontrado'}), 404
            
            if patient.role != 'patient':
                return jsonify({'message': 'El usuario no es un paciente'}), 400
            
            return jsonify(patient.to_dict()), 200
            
        except Exception as e:
            print(f"Error en get_patient: {str(e)}")
            return jsonify({'message': 'Error al obtener paciente', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    @role_required('admin', 'doctor')
    def create_patient():
        """
        Crea un nuevo paciente
        POST /api/patients
        Body: {username/cui, email, password, first_name, last_name, phone, community_id}
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"🔵 Usuario {current_user_id} creando paciente")
            
            data = request.get_json()
            print(f"🔵 Datos recibidos: {data}")
            
            # Forzar el rol a 'patient'
            data['role'] = 'patient'
            
            # IMPORTANTE: Extraer community_id ANTES de crear el usuario
            community_id = data.pop('community_id', None)
            print(f"🔵 Community ID extraído: {community_id}")
            
            # Crear el usuario
            patient, error = UserService.create_user(data)
            
            if error:
                print(f"❌ Error creando paciente: {error}")
                return jsonify({'message': error}), 400
            
            print(f"✅ Paciente creado: ID {patient.id}")
            
            # CRÍTICO: Si se proporcionó una comunidad, agregarla
            if community_id:
                print(f"🔵 Buscando comunidad {community_id}...")
                community = Community.query.get(community_id)
                
                if community:
                    # Agregar el paciente a la comunidad
                    if patient not in community.members:
                        community.members.append(patient)
                        db.session.commit()
                        print(f"✅ Paciente agregado a la comunidad: {community.name}")
                    else:
                        print(f"⚠️ Paciente ya pertenecía a la comunidad")
                else:
                    print(f"⚠️ Comunidad {community_id} no encontrada")
            else:
                print(f"⚠️ No se proporcionó community_id")
            
            # Recargar el paciente para obtener las comunidades actualizadas
            db.session.refresh(patient)
            
            print(f"✅ Paciente creado exitosamente con comunidades: {[c.id for c in patient.communities]}")
            
            return jsonify({
                'message': 'Paciente creado exitosamente',
                'user': patient.to_dict()
            }), 201
            
        except Exception as e:
            print(f"❌ Error en create_patient: {str(e)}")
            import traceback
            traceback.print_exc()
            db.session.rollback()
            return jsonify({'message': 'Error al crear paciente', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    @role_required('admin', 'doctor')
    def update_patient(patient_id):
        """
        Actualiza un paciente existente
        PUT /api/patients/:id
        Body: {first_name, last_name, phone, email, community_id}
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"🔵 Usuario {current_user_id} actualizando paciente {patient_id}")
            
            data = request.get_json()
            
            # Verificar que es un paciente
            patient = UserService.get_user_by_id(patient_id)
            if not patient or patient.role != 'patient':
                return jsonify({'message': 'Paciente no encontrado'}), 404
            
            # Extraer community_id si existe
            community_id = data.pop('community_id', None)
            
            # Actualizar datos básicos del paciente
            updated_patient, error = UserService.update_user(patient_id, data)
            
            if error:
                print(f"❌ Error actualizando paciente: {error}")
                return jsonify({'message': error}), 400
            
            # Actualizar comunidad si se proporcionó
            if community_id is not None:
                # Limpiar comunidades anteriores
                updated_patient.communities = []
                
                # Agregar nueva comunidad
                community = Community.query.get(community_id)
                if community:
                    updated_patient.communities.append(community)
                    db.session.commit()
                    print(f"✅ Comunidad actualizada: {community.name}")
            
            # Recargar el paciente
            db.session.refresh(updated_patient)
            
            return jsonify({
                'message': 'Paciente actualizado exitosamente',
                'user': updated_patient.to_dict()
            }), 200
            
        except Exception as e:
            print(f"❌ Error en update_patient: {str(e)}")
            db.session.rollback()
            return jsonify({'message': 'Error al actualizar paciente', 'error': str(e)}), 500