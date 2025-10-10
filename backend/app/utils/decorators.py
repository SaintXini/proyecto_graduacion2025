"""
Decoradores para manejo de autenticación y autorización
"""

from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models.user import User


def role_required(*roles):
    """
    Decorador para verificar que el usuario tenga uno de los roles especificados
    Uso: @role_required('admin', 'doctor')
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            
            if not user:
                return jsonify({'message': 'Usuario no encontrado'}), 404
            
            if user.role not in roles:
                return jsonify({
                    'message': 'No tienes permisos para acceder a este recurso'
                }), 403
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator
