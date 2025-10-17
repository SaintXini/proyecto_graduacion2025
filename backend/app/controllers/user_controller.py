"""
Controlador para operaciones CRUD de usuarios
"""

from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.user_service import UserService
from app.utils.decorators import role_required

class UserController:
    """Controlador para operaciones de usuarios"""
    
    @staticmethod
    @jwt_required()
    @role_required('admin', 'authority')
    def get_users():
        """
        Obtiene todos los usuarios
        GET /api/users
        Query params: role, is_active
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} solicitando lista de usuarios")
            
            filters = {}
            
            if request.args.get('role'):
                filters['role'] = request.args.get('role')
            if request.args.get('is_active'):
                filters['is_active'] = request.args.get('is_active').lower() == 'true'
            
            users = UserService.get_all_users(filters)
            print(f"Usuarios encontrados: {len(users)}")
            
            return jsonify([user.to_dict() for user in users]), 200
        except Exception as e:
            print(f"Error en get_users: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({'message': 'Error al obtener usuarios', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    def get_user(user_id):
        """
        Obtiene un usuario por ID
        GET /api/users/:id
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} solicitando usuario {user_id}")
            
            user = UserService.get_user_by_id(user_id)
            
            if not user:
                return jsonify({'message': 'Usuario no encontrado'}), 404
            
            return jsonify(user.to_dict()), 200
        except Exception as e:
            print(f"Error en get_user: {str(e)}")
            return jsonify({'message': 'Error al obtener usuario', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    @role_required('admin', 'doctor')
    def create_user():
        """
        Crea un nuevo usuario
        POST /api/users
        Body: {username, email, password, role, first_name, last_name, phone}
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} creando nuevo usuario")
            
            data = request.get_json()
            print(f"Datos recibidos: {data}")
            
            user, error = UserService.create_user(data)
            
            if error:
                print(f"Error creando usuario: {error}")
                return jsonify({'message': error}), 400
            
            print(f"Usuario creado exitosamente: {user.id}")
            return jsonify({
                'message': 'Usuario creado exitosamente',
                'user': user.to_dict()
            }), 201
        except Exception as e:
            print(f"Error en create_user: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({'message': 'Error al crear usuario', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    def update_user(user_id):
        """
        Actualiza un usuario existente
        PUT /api/users/:id
        Body: {first_name, last_name, phone, email, password, is_active}
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} actualizando usuario {user_id}")
            
            data = request.get_json()
            
            user, error = UserService.update_user(user_id, data)
            
            if error:
                print(f"Error actualizando usuario: {error}")
                return jsonify({'message': error}), 400
            
            return jsonify({
                'message': 'Usuario actualizado exitosamente',
                'user': user.to_dict()
            }), 200
        except Exception as e:
            print(f"Error en update_user: {str(e)}")
            return jsonify({'message': 'Error al actualizar usuario', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    @role_required('admin')
    def delete_user(user_id):
        """
        Elimina un usuario (soft delete)
        DELETE /api/users/:id
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} eliminando usuario {user_id}")
            
            success, error = UserService.delete_user(user_id)
            
            if not success:
                print(f"Error eliminando usuario: {error}")
                return jsonify({'message': error}), 400
            
            return jsonify({'message': 'Usuario eliminado exitosamente'}), 200
        except Exception as e:
            print(f"Error en delete_user: {str(e)}")
            return jsonify({'message': 'Error al eliminar usuario', 'error': str(e)}), 500
