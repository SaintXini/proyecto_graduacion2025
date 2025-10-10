from flask import Blueprint
from app.controllers.community_controller import CommunityController

# Crear Blueprint
community_bp = Blueprint('communities', __name__, url_prefix='/api/communities')


# Definir rutas
@community_bp.route('', methods=['GET'])
def get_communities():
    """Obtener todas las comunidades"""
    return CommunityController.get_communities()


@community_bp.route('/<int:community_id>', methods=['GET'])
def get_community(community_id):
    """Obtener una comunidad por ID"""
    return CommunityController.get_community(community_id)


@community_bp.route('', methods=['POST'])
def create_community():
    """Crear una nueva comunidad"""
    return CommunityController.create_community()


@community_bp.route('/<int:community_id>', methods=['PUT'])
def update_community(community_id):
    """Actualizar una comunidad existente"""
    return CommunityController.update_community(community_id)


@community_bp.route('/<int:community_id>/members', methods=['POST'])
def add_member(community_id):
    """Añadir un miembro a una comunidad"""
    return CommunityController.add_member(community_id)

