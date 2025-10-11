"""
Controlador para operaciones de comunidades
"""

from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.community_service import CommunityService
from app.utils.decorators import role_required


class CommunityController:
    """Controlador para operaciones de comunidades"""
    
    @staticmethod
    @jwt_required()
    def get_communities():
        """
        Obtiene todas las comunidades
        GET /api/communities
        Query params: location, health_center_id
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} solicitando comunidades")
            
            filters = {}
            
            if request.args.get('location'):
                filters['location'] = request.args.get('location')
            if request.args.get('health_center_id'):
                filters['health_center_id'] = request.args.get('health_center_id')
            
            communities = CommunityService.get_all_communities(filters)
            print(f"Comunidades encontradas: {len(communities)}")
            
            return jsonify([community.to_dict() for community in communities]), 200
        except Exception as e:
            print(f"Error en get_communities: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({'message': 'Error al obtener comunidades', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    def get_community(community_id):
        """
        Obtiene una comunidad por ID
        GET /api/communities/:id
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} solicitando comunidad {community_id}")
            
            community = CommunityService.get_community_by_id(community_id)
            
            if not community:
                return jsonify({'message': 'Comunidad no encontrada'}), 404
            
            return jsonify(community.to_dict()), 200
        except Exception as e:
            print(f"Error en get_community: {str(e)}")
            return jsonify({'message': 'Error al obtener comunidad', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    @role_required('admin', 'authority')
    def create_community():
        """
        Crea una nueva comunidad
        POST /api/communities
        Body: {name, description, location, population, health_center_id}
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} creando comunidad")
            
            data = request.get_json()
            
            if not data.get('name'):
                return jsonify({'message': 'El nombre es requerido'}), 400
            
            community, error = CommunityService.create_community(data)
            
            if error:
                print(f"Error creando comunidad: {error}")
                return jsonify({'message': error}), 400
            
            return jsonify({
                'message': 'Comunidad creada exitosamente',
                'community': community.to_dict()
            }), 201
        except Exception as e:
            print(f"Error en create_community: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({'message': 'Error al crear comunidad', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    @role_required('admin', 'authority')
    def update_community(community_id):
        """
        Actualiza una comunidad existente
        PUT /api/communities/:id
        Body: {name, description, location, population, health_center_id}
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} actualizando comunidad {community_id}")
            
            data = request.get_json()
            
            community, error = CommunityService.update_community(community_id, data)
            
            if error:
                print(f"Error actualizando comunidad: {error}")
                return jsonify({'message': error}), 400
            
            return jsonify({
                'message': 'Comunidad actualizada exitosamente',
                'community': community.to_dict()
            }), 200
        except Exception as e:
            print(f"Error en update_community: {str(e)}")
            return jsonify({'message': 'Error al actualizar comunidad', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    @role_required('admin', 'authority')
    def add_member(community_id):
        """
        Añade un miembro a una comunidad
        POST /api/communities/:id/members
        Body: {user_id}
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} añadiendo miembro a comunidad {community_id}")
            
            data = request.get_json()
            user_id = data.get('user_id')
            
            if not user_id:
                return jsonify({'message': 'user_id es requerido'}), 400
            
            success, message = CommunityService.add_member_to_community(community_id, user_id)
            
            if not success:
                print(f"Error añadiendo miembro: {message}")
                return jsonify({'message': message}), 400
            
            return jsonify({'message': message}), 200
        except Exception as e:
            print(f"Error en add_member: {str(e)}")
            return jsonify({'message': 'Error al añadir miembro', 'error': str(e)}), 500