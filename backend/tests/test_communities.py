import pytest


class TestCommunities:
    """Clase de tests para comunidades"""
    
    def test_get_all_communities(self, client, auth_token):
        """Test: Obtener todas las comunidades"""
        response = client.get('/api/communities', headers={
            'Authorization': f'Bearer {auth_token}'
        })
        
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)
    
    def test_create_community(self, client, auth_token):
        """Test: Crear nueva comunidad"""
        response = client.post('/api/communities',
            headers={'Authorization': f'Bearer {auth_token}'},
            json={
                'name': 'Test Community',
                'description': 'A test community',
                'location': 'Test Location',
                'population': 1000
            }
        )
        
        assert response.status_code == 201
        data = response.get_json()
        assert data['community']['name'] == 'Test Community'
    
    def test_create_community_without_name(self, client, auth_token):
        """Test: Intentar crear comunidad sin nombre"""
        response = client.post('/api/communities',
            headers={'Authorization': f'Bearer {auth_token}'},
            json={
                'description': 'A test community'
            }
        )
        
        assert response.status_code == 400
