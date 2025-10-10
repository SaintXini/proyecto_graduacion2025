"""
Controlador para manejo de autenticación (login y registro)
"""

from flask import jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.services.user_service import UserService


class AuthController:
    """Controlador para operaciones de autenticación"""
    
    @staticmethod
    def login():
        """
        Endpoint de login
        POST /api/login
        Body: {username, password}
        """
        data = request.get_json()
        
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'message': 'Username y password son requeridos'}), 400
        
        # Autenticar usuario
        user = UserService.authenticate(username, password)
        
        if not user:
            return jsonify({'message': 'Credenciales inválidas'}), 401
        
        # Crear token JWT
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
    
    @staticmethod
    def register():
        """
        Endpoint de registro
        POST /api/register
        Body: {username, email, password, role, first_name, last_name, phone}
        """
        data = request.get_json()
        
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'message': f'{field} es requerido'}), 400
        
        # Crear usuario
        user, error = UserService.create_user(data)
        
        if error:
            return jsonify({'message': error}), 400
        
        # Crear token JWT
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Usuario registrado exitosamente',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
    
    @staticmethod
    @jwt_required()
    def get_current_user():
        """
        Obtiene información del usuario actual
        GET /api/me
        """
        current_user_id = get_jwt_identity()
        user = UserService.get_user_by_id(current_user_id)
        
        if not user:
            return jsonify({'message': 'Usuario no encontrado'}), 404
        
        return jsonify(user.to_dict()), 200

