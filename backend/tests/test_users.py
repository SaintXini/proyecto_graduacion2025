import pytest


class TestUsers:
    """Clase de tests para usuarios"""
    
    def test_get_all_users_as_admin(self, client, auth_token):
        """Test: Obtener todos los usuarios como admin"""
        response = client.get('/api/users', headers={
            'Authorization': f'Bearer {auth_token}'
        })
        
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)
    
    def test_get_all_users_without_auth(self, client):
        """Test: Intentar obtener usuarios sin autenticación"""
        response = client.get('/api/users')
        
        assert response.status_code == 401
    
    def test_get_user_by_id(self, client, auth_token, admin_user):
        """Test: Obtener usuario por ID"""
        response = client.get(f'/api/users/{admin_user.id}', headers={
            'Authorization': f'Bearer {auth_token}'
        })
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['id'] == admin_user.id
        assert data['username'] == admin_user.username
    
    def test_get_nonexistent_user(self, client, auth_token):
        """Test: Intentar obtener usuario que no existe"""
        response = client.get('/api/users/99999', headers={
            'Authorization': f'Bearer {auth_token}'
        })
        
        assert response.status_code == 404
    
    def test_create_user_as_admin(self, client, auth_token):
        """Test: Crear usuario como admin"""
        response = client.post('/api/users', 
            headers={'Authorization': f'Bearer {auth_token}'},
            json={
                'username': 'created_user',
                'email': 'created@test.com',
                'password': 'Password123',
                'role': 'doctor',
                'first_name': 'Created',
                'last_name': 'User'
            }
        )
        
        assert response.status_code == 201
        data = response.get_json()
        assert data['user']['username'] == 'created_user'
        assert data['user']['role'] == 'doctor'
    
    def test_update_user(self, client, auth_token, patient_user):
        """Test: Actualizar usuario"""
        response = client.put(f'/api/users/{patient_user.id}',
            headers={'Authorization': f'Bearer {auth_token}'},
            json={
                'first_name': 'Updated',
                'last_name': 'Name'
            }
        )
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['user']['first_name'] == 'Updated'
    
    def test_delete_user(self, client, auth_token, patient_user):
        """Test: Eliminar usuario (soft delete)"""
        response = client.delete(f'/api/users/{patient_user.id}',
            headers={'Authorization': f'Bearer {auth_token}'}
        )
        
        assert response.status_code == 200
        
        # Verificar que el usuario fue desactivado
        check_response = client.get(f'/api/users/{patient_user.id}',
            headers={'Authorization': f'Bearer {auth_token}'}
        )
        data = check_response.get_json()
        assert data['is_active'] is False

