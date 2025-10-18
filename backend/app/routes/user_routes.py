# Backend/app/routes/user_routes.py

from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.controllers.user_controller import UserController

# Crear Blueprint
user_bp = Blueprint('users', __name__, url_prefix='/api/users')

# ✅ Añadir manejo de OPTIONS
@user_bp.before_request
def handle_options():
    """Manejar peticiones OPTIONS (preflight)"""
    if request.method == 'OPTIONS':
        return '', 200

# Definir rutas
@user_bp.route('', methods=['GET', 'OPTIONS'])
@jwt_required(optional=True)  # ✅ CAMBIAR
def get_users():
    """Obtener todos los usuarios"""
    return UserController.get_users()

@user_bp.route('/<int:user_id>', methods=['GET', 'OPTIONS'])
@jwt_required(optional=True)  # ✅ CAMBIAR
def get_user(user_id):
    """Obtener un usuario por ID"""
    return UserController.get_user(user_id)

@user_bp.route('', methods=['POST', 'OPTIONS'])
@jwt_required(optional=True)  # ✅ CAMBIAR
def create_user():
    """Crear un nuevo usuario"""
    return UserController.create_user()

@user_bp.route('/<int:user_id>', methods=['PUT', 'OPTIONS'])
@jwt_required(optional=True)  # ✅ CAMBIAR
def update_user(user_id):
    """Actualizar un usuario existente"""
    return UserController.update_user(user_id)

@user_bp.route('/<int:user_id>', methods=['DELETE', 'OPTIONS'])
@jwt_required(optional=True)  # ✅ CAMBIAR
def delete_user(user_id):
    """Eliminar un usuario"""
    return UserController.delete_user(user_id)