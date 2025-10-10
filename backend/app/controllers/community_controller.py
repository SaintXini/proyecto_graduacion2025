"""
Controlador para operaciones de comunidades
"""

from flask import jsonify, request
from flask_jwt_extended import jwt_required
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
        filters = {}
        
        if request.args.get('location'):
            filters['location'] = request.args.get('location')
        if request.args.get('health_center_id'):
            filters['health_center_id'] = request.args.get('health_center_id')
        
        communities = CommunityService.get_all_communities(filters)
        
        return jsonify([community.to_dict() for community in communities]), 200
    
    @staticmethod
    @jwt_required()
    def get_community(community_id):
        """
        Obtiene una comunidad por ID
        GET /api/communities/:id
        """
        community = CommunityService.get_community_by_id(community_id)
        
        if not community:
            return jsonify({'message': 'Comunidad no encontrada'}), 404
        
        return jsonify(community.to_dict()), 200
    
    @staticmethod
    @jwt_required()
    @role_required('admin', 'authority')
    def create_community():
        """
        Crea una nueva comunidad
        POST /api/communities
        Body: {name, description, location, population, health_center_id}
        """
        data = request.get_json()
        
        if not data.get('name'):
            return jsonify({'message': 'El nombre es requerido'}), 400
        
        community, error = CommunityService.create_community(data)
        
        if error:
            return jsonify({'message': error}), 400
        
        return jsonify({
            'message': 'Comunidad creada exitosamente',
            'community': community.to_dict()
        }), 201
    
    @staticmethod
    @jwt_required()
    @role_required('admin', 'authority')
    def update_community(community_id):
        """
        Actualiza una comunidad existente
        PUT /api/communities/:id
        Body: {name, description, location, population, health_center_id}
        """
        data = request.get_json()
        
        community, error = CommunityService.update_community(community_id, data)
        
        if error:
            return jsonify({'message': error}), 400
        
        return jsonify({
            'message': 'Comunidad actualizada exitosamente',
            'community': community.to_dict()
        }), 200
    
    @staticmethod
    @jwt_required()
    @role_required('admin', 'authority')
    def add_member(community_id):
        """
        Añade un miembro a una comunidad
        POST /api/communities/:id/members
        Body: {user_id}
        """
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'message': 'user_id es requerido'}), 400
        
        success, message = CommunityService.add_member_to_community(community_id, user_id)
        
        if not success:
            return jsonify({'message': message}), 400
        
        return jsonify({'message': message}), 200

