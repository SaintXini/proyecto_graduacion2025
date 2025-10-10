"""
Controlador para operaciones CRUD de usuarios
"""

from flask import jsonify, request
from flask_jwt_extended import jwt_required
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
        filters = {}
        
        if request.args.get('role'):
            filters['role'] = request.args.get('role')
        if request.args.get('is_active'):
            filters['is_active'] = request.args.get('is_active').lower() == 'true'
        
        users = UserService.get_all_users(filters)
        
        return jsonify([user.to_dict() for user in users]), 200
    
    @staticmethod
    @jwt_required()
    def get_user(user_id):
        """
        Obtiene un usuario por ID
        GET /api/users/:id
        """
        user = UserService.get_user_by_id(user_id)
        
        if not user:
            return jsonify({'message': 'Usuario no encontrado'}), 404
        
        return jsonify(user.to_dict()), 200
    
    @staticmethod
    @jwt_required()
    @role_required('admin')
    def create_user():
        """
        Crea un nuevo usuario
        POST /api/users
        Body: {username, email, password, role, first_name, last_name, phone}
        """
        data = request.get_json()
        
        user, error = UserService.create_user(data)
        
        if error:
            return jsonify({'message': error}), 400
        
        return jsonify({
            'message': 'Usuario creado exitosamente',
            'user': user.to_dict()
        }), 201
    
    @staticmethod
    @jwt_required()
    def update_user(user_id):
        """
        Actualiza un usuario existente
        PUT /api/users/:id
        Body: {first_name, last_name, phone, email, password, is_active}
        """
        data = request.get_json()
        
        user, error = UserService.update_user(user_id, data)
        
        if error:
            return jsonify({'message': error}), 400
        
        return jsonify({
            'message': 'Usuario actualizado exitosamente',
            'user': user.to_dict()
        }), 200
    
    @staticmethod
    @jwt_required()
    @role_required('admin')
    def delete_user(user_id):
        """
        Elimina un usuario (soft delete)
        DELETE /api/users/:id
        """
        success, error = UserService.delete_user(user_id)
        
        if not success:
            return jsonify({'message': error}), 400
        
        return jsonify({'message': 'Usuario eliminado exitosamente'}), 200

