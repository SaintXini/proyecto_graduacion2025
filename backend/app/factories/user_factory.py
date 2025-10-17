"""
Implementación del patrón Factory Method para crear usuarios
según su rol (administrador, autoridad, médico, paciente)
"""

from app.models.user import User
from abc import ABC, abstractmethod

class UserFactory(ABC):
    """
    Clase abstracta Factory para crear usuarios
    """
    
    @abstractmethod
    def create_user(self, **kwargs):
        """Método abstracto que debe ser implementado por subclases"""
        pass
    
    def _create_base_user(self, **kwargs):
        """Método auxiliar para crear usuario base"""
        user = User(
            username=kwargs.get('username'),
            email=kwargs.get('email'),
            first_name=kwargs.get('first_name'),
            last_name=kwargs.get('last_name'),
            phone=kwargs.get('phone')
        )
        user.set_password(kwargs.get('password'))
        return user

class AdminFactory(UserFactory):
    """Factory para crear usuarios administradores"""
    
    def create_user(self, **kwargs):
        user = self._create_base_user(**kwargs)
        user.role = 'admin'
        return user

class AuthorityFactory(UserFactory):
    """Factory para crear usuarios autoridades"""
    
    def create_user(self, **kwargs):
        user = self._create_base_user(**kwargs)
        user.role = 'authority'
        return user

class DoctorFactory(UserFactory):
    """Factory para crear usuarios médicos"""
    
    def create_user(self, **kwargs):
        user = self._create_base_user(**kwargs)
        user.role = 'doctor'
        return user

class PatientFactory(UserFactory):
    """Factory para crear usuarios pacientes"""
    
    def create_user(self, **kwargs):
        user = self._create_base_user(**kwargs)
        user.role = 'patient'
        return user

class UserFactoryProvider:
    """
    Proveedor de factories según el rol
    Implementa el patrón Factory Method
    """
    
    _factories = {
        'admin': AdminFactory(),
        'authority': AuthorityFactory(),
        'doctor': DoctorFactory(),
        'patient': PatientFactory()
    }
    
    @classmethod
    def get_factory(cls, role):
        """Obtiene el factory apropiado según el rol"""
        factory = cls._factories.get(role.lower())
        if not factory:
            raise ValueError(f"Rol inválido: {role}")
        return factory
    
    @classmethod
    def create_user(cls, role, **kwargs):
        """
        Método de conveniencia para crear usuario directamente
        sin obtener el factory explícitamente
        """
        factory = cls.get_factory(role)
        return factory.create_user(**kwargs)
