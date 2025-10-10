import pytest
from app.factories.user_factory import UserFactoryProvider


class TestUserFactory:
    """Clase de tests para el patrón Factory"""
    
    def test_create_admin_user(self, app):
        """Test: Crear usuario administrador con Factory"""
        with app.app_context():
            user = UserFactoryProvider.create_user(
                role='admin',
                username='test_admin',
                email='test_admin@test.com',
                password='Admin123'
            )
            
            assert user.role == 'admin'
            assert user.username == 'test_admin'
    
    def test_create_doctor_user(self, app):
        """Test: Crear usuario doctor con Factory"""
        with app.app_context():
            user = UserFactoryProvider.create_user(
                role='doctor',
                username='test_doctor',
                email='test_doctor@test.com',
                password='Doctor123'
            )
            
            assert user.role == 'doctor'
    
    def test_create_patient_user(self, app):
        """Test: Crear usuario paciente con Factory"""
        with app.app_context():
            user = UserFactoryProvider.create_user(
                role='patient',
                username='test_patient',
                email='test_patient@test.com',
                password='Patient123'
            )
            
            assert user.role == 'patient'
    
    def test_create_authority_user(self, app):
        """Test: Crear usuario autoridad con Factory"""
        with app.app_context():
            user = UserFactoryProvider.create_user(
                role='authority',
                username='test_authority',
                email='test_authority@test.com',
                password='Authority123'
            )
            
            assert user.role == 'authority'
    
    def test_create_user_invalid_role(self, app):
        """Test: Intentar crear usuario con rol inválido"""
        with app.app_context():
            with pytest.raises(ValueError):
                UserFactoryProvider.create_user(
                    role='invalid_role',
                    username='test_user',
                    email='test@test.com',
                    password='Password123'
                )