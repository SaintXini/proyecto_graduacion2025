from flask import Blueprint
from app.controllers.user_controller import UserController

# Crear Blueprint
user_bp = Blueprint('users', __name__, url_prefix='/api/users')


# Definir rutas
@user_bp.route('', methods=['GET'])
def get_users():
    """Obtener todos los usuarios"""
    return UserController.get_users()


@user_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Obtener un usuario por ID"""
    return UserController.get_user(user_id)


@user_bp.route('', methods=['POST'])
def create_user():
    """Crear un nuevo usuario"""
    return UserController.create_user()


@user_bp.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Actualizar un usuario existente"""
    return UserController.update_user(user_id)


@user_bp.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Eliminar un usuario"""
    return UserController.delete_user(user_id)
