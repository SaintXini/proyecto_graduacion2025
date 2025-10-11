from app.extensions import db
from app.models.user import User
from app.factories.user_factory import UserFactoryProvider
from app.utils.validators import validate_email, validate_username, validate_password
from sqlalchemy.exc import IntegrityError


class UserService:
    """Servicio para operaciones de usuarios"""
    
    @staticmethod
    def create_user(data):
        """
        Crea un nuevo usuario usando el patrón Factory
        Args:
            data (dict): Datos del usuario (username, email, password, role, etc.)
        Returns:
            tuple: (usuario creado, mensaje de error si existe)
        """
        # Validaciones
        username = data.get('username') or data.get('cui')  # Permitir 'cui' como username
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'patient')
        
        # Validar username
        is_valid, message = validate_username(username)
        if not is_valid:
            return None, message
        
        # Validar email
        if not validate_email(email):
            return None, "Email inválido"
        
        # Validar password
        is_valid, message = validate_password(password)
        if not is_valid:
            return None, message
        
        try:
            # Usar Factory Method para crear usuario según rol
            user = UserFactoryProvider.create_user(
                role=role,
                username=username,
                email=email,
                password=password,
                first_name=data.get('first_name') or data.get('nombre'),
                last_name=data.get('last_name') or data.get('apellidos'),
                phone=data.get('phone') or data.get('telefono')
            )
            
            db.session.add(user)
            db.session.commit()
            return user, None
            
        except ValueError as e:
            return None, str(e)
        except IntegrityError:
            db.session.rollback()
            return None, "El username o email ya existe"
        except Exception as e:
            db.session.rollback()
            return None, f"Error al crear usuario: {str(e)}"
    
    @staticmethod
    def get_all_users(filters=None):
        """
        Obtiene todos los usuarios con filtros opcionales
        
        Args:
            filters (dict): Filtros opcionales (role, is_active, etc.)
        
        Returns:
            list: Lista de usuarios
        """
        query = User.query
        
        if filters:
            if 'role' in filters:
                query = query.filter_by(role=filters['role'])
            if 'is_active' in filters:
                query = query.filter_by(is_active=filters['is_active'])
        
        return query.all()
    
    @staticmethod
    def get_user_by_id(user_id):
        """Obtiene un usuario por ID"""
        return User.query.get(user_id)
    
    @staticmethod
    def get_user_by_username(username):
        """Obtiene un usuario por username"""
        return User.query.filter_by(username=username).first()
    
    @staticmethod
    def update_user(user_id, data):
        """
        Actualiza un usuario existente
        
        Args:
            user_id (int): ID del usuario
            data (dict): Datos a actualizar
        
        Returns:
            tuple: (usuario actualizado, mensaje de error si existe)
        """
        user = User.query.get(user_id)
        
        if not user:
            return None, "Usuario no encontrado"
        
        try:
            # Actualizar campos permitidos
            if 'first_name' in data:
                user.first_name = data['first_name']
            if 'last_name' in data:
                user.last_name = data['last_name']
            if 'phone' in data:
                user.phone = data['phone']
            if 'is_active' in data:
                user.is_active = data['is_active']
            
            # Actualizar email si es diferente
            if 'email' in data and data['email'] != user.email:
                if not validate_email(data['email']):
                    return None, "Email inválido"
                user.email = data['email']
            
            # Actualizar contraseña si se proporciona
            if 'password' in data:
                is_valid, message = validate_password(data['password'])
                if not is_valid:
                    return None, message
                user.set_password(data['password'])
            
            db.session.commit()
            return user, None
            
        except IntegrityError:
            db.session.rollback()
            return None, "El email ya está en uso"
        except Exception as e:
            db.session.rollback()
            return None, f"Error al actualizar usuario: {str(e)}"
    
    @staticmethod
    def delete_user(user_id):
        """
        Elimina un usuario (soft delete - marca como inactivo)
        
        Args:
            user_id (int): ID del usuario
        
        Returns:
            tuple: (éxito, mensaje de error si existe)
        """
        user = User.query.get(user_id)
        
        if not user:
            return False, "Usuario no encontrado"
        
        try:
            # Soft delete - marcar como inactivo en lugar de eliminar
            user.is_active = False
            db.session.commit()
            return True, None
            
        except Exception as e:
            db.session.rollback()
            return False, f"Error al eliminar usuario: {str(e)}"
    
    @staticmethod
    def authenticate(username, password):
        """
        Autentica un usuario
        
        Args:
            username (str): Nombre de usuario
            password (str): Contraseña
        
        Returns:
            User: Usuario si la autenticación es exitosa, None si no
        """
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password) and user.is_active:
            return user
        
        return None
