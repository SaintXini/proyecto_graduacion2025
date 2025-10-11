"""
Controlador para autenticación y registro
"""

from flask import jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.services.user_service import UserService


class AuthController:
    """Controlador para autenticación y registro"""
    
    @staticmethod
    def login():
        """
        Inicia sesión de usuario
        POST /api/login
        Body: {username, password}
        """
        try:
            data = request.get_json()
            
            if not data:
                return jsonify({'message': 'No se proporcionaron datos'}), 400
            
            username = data.get('username')
            password = data.get('password')
            
            print(f"Intento de login: {username}")
            
            if not username or not password:
                return jsonify({'message': 'Username y password son requeridos'}), 400
            
            # Autenticar usuario
            user = UserService.authenticate(username, password)
            
            if not user:
                print(f"Credenciales inválidas para: {username}")
                return jsonify({'message': 'Credenciales inválidas'}), 401
            
            # Crear token JWT - ✅ Convertir ID a string
            access_token = create_access_token(identity=str(user.id))
            
            print(f"Login exitoso para usuario: {username} (ID: {user.id}, Role: {user.role})")
            print(f"Token generado: {access_token[:20]}...")
            
            # ✅ CAMBIO: access_token → token
            return jsonify({
                'message': 'Login exitoso',
                'token': access_token,
                'user': user.to_dict()
            }), 200
            
        except Exception as e:
            print(f"Error en login: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({'message': 'Error en el servidor', 'error': str(e)}), 500
    
    @staticmethod
    def register():
        """
        Registra un nuevo usuario
        POST /api/register
        Body: {username, email, password, role, first_name, last_name, phone}
        """
        try:
            data = request.get_json()
            
            if not data:
                return jsonify({'message': 'No se proporcionaron datos'}), 400
            
            # Validar campos requeridos
            required_fields = ['username', 'email', 'password']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({'message': f'{field} es requerido'}), 400
            
            # Por defecto, asignar rol de paciente si no se especifica
            if 'role' not in data:
                data['role'] = 'patient'
            
            # Crear usuario
            user, error = UserService.create_user(data)
            
            if error:
                return jsonify({'message': error}), 400
            
            # Crear token JWT
            access_token = create_access_token(identity=user.id)
            
            # ✅ CAMBIO: access_token → token
            return jsonify({
                'message': 'Usuario registrado exitosamente',
                'token': access_token,
                'user': user.to_dict()
            }), 201
            
        except Exception as e:
            print(f"Error en register: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({'message': 'Error en el servidor', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    def get_current_user():
        """
        Obtiene información del usuario actual
        GET /api/me
        """
        try:
            # ✅ Convertir identity de string a int
            current_user_id = int(get_jwt_identity())
            print(f"Solicitando información del usuario: {current_user_id}")
            
            user = UserService.get_user_by_id(current_user_id)
            
            if not user:
                return jsonify({'message': 'Usuario no encontrado'}), 404
            
            return jsonify(user.to_dict()), 200
            
        except Exception as e:
            print(f"Error en get_current_user: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({'message': 'Error en el servidor', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    def verify_token():
        """
        Verifica si el token es válido
        GET /api/verify
        """
        try:
            # ✅ Convertir identity de string a int
            current_user_id = int(get_jwt_identity())
            print(f"Verificando token para usuario: {current_user_id}")
            
            user = UserService.get_user_by_id(current_user_id)
            
            if not user:
                return jsonify({'valid': False, 'message': 'Usuario no encontrado'}), 404
            
            return jsonify({
                'valid': True,
                'user': user.to_dict()
            }), 200
            
        except Exception as e:
            print(f"Error en verify_token: {str(e)}")
            return jsonify({
                'valid': False,
                'message': 'Token inválido',
                'error': str(e)
            }), 401