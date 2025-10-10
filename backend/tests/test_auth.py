import pytest


class TestAuth:
    """Clase de tests para autenticación"""
    
    def test_register_success(self, client):
        """Test: Registro exitoso de usuario"""
        response = client.post('/api/register', json={
            'username': 'newuser',
            'email': 'newuser@test.com',
            'password': 'Password123',
            'role': 'patient',
            'first_name': 'New',
            'last_name': 'User'
        })
        
        assert response.status_code == 201
        data = response.get_json()
        assert 'access_token' in data
        assert data['user']['username'] == 'newuser'
        assert data['user']['role'] == 'patient'
    
    def test_register_missing_fields(self, client):
        """Test: Registro con campos faltantes"""
        response = client.post('/api/register', json={
            'username': 'newuser'
        })
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'message' in data
    
    def test_register_duplicate_username(self, client, admin_user):
        """Test: Registro con username duplicado"""
        response = client.post('/api/register', json={
            'username': 'admin_test',
            'email': 'another@test.com',
            'password': 'Password123'
        })
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'ya existe' in data['message'].lower()
    
    def test_register_invalid_email(self, client):
        """Test: Registro con email inválido"""
        response = client.post('/api/register', json={
            'username': 'testuser',
            'email': 'invalidemail',
            'password': 'Password123'
        })
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'email' in data['message'].lower()
    
    def test_register_weak_password(self, client):
        """Test: Registro con contraseña débil"""
        response = client.post('/api/register', json={
            'username': 'testuser',
            'email': 'test@test.com',
            'password': 'weak'
        })
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'contraseña' in data['message'].lower()
    
    def test_login_success(self, client, admin_user):
        """Test: Login exitoso"""
        response = client.post('/api/login', json={
            'username': 'admin_test',
            'password': 'Admin123'
        })
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'access_token' in data
        assert data['user']['username'] == 'admin_test'
    
    def test_login_invalid_credentials(self, client, admin_user):
        """Test: Login con credenciales inválidas"""
        response = client.post('/api/login', json={
            'username': 'admin_test',
            'password': 'WrongPassword'
        })
        
        assert response.status_code == 401
        data = response.get_json()
        assert 'credenciales' in data['message'].lower()
    
    def test_login_missing_fields(self, client):
        """Test: Login con campos faltantes"""
        response = client.post('/api/login', json={
            'username': 'admin_test'
        })
        
        assert response.status_code == 400
    
    def test_get_current_user(self, client, auth_token):
        """Test: Obtener información del usuario actual"""
        response = client.get('/api/me', headers={
            'Authorization': f'Bearer {auth_token}'
        })
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['username'] == 'admin_test'
    
    def test_get_current_user_without_token(self, client):
        """Test: Intentar obtener usuario actual sin token"""
        response = client.get('/api/me')
        
        assert response.status_code == 401

