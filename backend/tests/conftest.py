import pytest
from app import create_app
from app.extensions import db
from app.models.user import User
from app.factories.user_factory import UserFactoryProvider


@pytest.fixture
def app():
    """
    Fixture que crea una aplicación Flask en modo testing
    """
    app = create_app('testing')
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    """
    Fixture que crea un cliente de prueba
    """
    return app.test_client()


@pytest.fixture
def admin_user(app):
    """
    Fixture que crea un usuario administrador de prueba
    """
    with app.app_context():
        user = UserFactoryProvider.create_user(
            role='admin',
            username='admin_test',
            email='admin@test.com',
            password='Admin123',
            first_name='Admin',
            last_name='Test'
        )
        db.session.add(user)
        db.session.commit()
        return user


@pytest.fixture
def doctor_user(app):
    """
    Fixture que crea un usuario doctor de prueba
    """
    with app.app_context():
        user = UserFactoryProvider.create_user(
            role='doctor',
            username='doctor_test',
            email='doctor@test.com',
            password='Doctor123',
            first_name='Doctor',
            last_name='Test'
        )
        db.session.add(user)
        db.session.commit()
        return user


@pytest.fixture
def patient_user(app):
    """
    Fixture que crea un usuario paciente de prueba
    """
    with app.app_context():
        user = UserFactoryProvider.create_user(
            role='patient',
            username='patient_test',
            email='patient@test.com',
            password='Patient123',
            first_name='Patient',
            last_name='Test'
        )
        db.session.add(user)
        db.session.commit()
        return user


@pytest.fixture
def auth_token(client, admin_user):
    """
    Fixture que obtiene un token JWT de autenticación
    """
    response = client.post('/api/login', json={
        'username': 'admin_test',
        'password': 'Admin123'
    })
    data = response.get_json()
    return data['access_token']
