from flask import Blueprint
from app.controllers.auth_controller import AuthController

# Crear Blueprint
auth_bp = Blueprint('auth', __name__, url_prefix='/api')


# Definir rutas
@auth_bp.route('/login', methods=['POST'])
def login():
    """Endpoint de login"""
    return AuthController.login()


@auth_bp.route('/register', methods=['POST'])
def register():
    """Endpoint de registro"""
    return AuthController.register()


@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Obtener información del usuario actual"""
    return AuthController.get_current_user()
