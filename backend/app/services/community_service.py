from app.extensions import db
from app.models.community import Community, HealthCenter
from sqlalchemy.exc import IntegrityError

class CommunityService:
    """Servicio para operaciones de comunidades"""
    
    @staticmethod
    def create_community(data):
        """
        Crea una nueva comunidad
        
        Args:
            data (dict): Datos de la comunidad
        
        Returns:
            tuple: (comunidad creada, mensaje de error si existe)
        """
        try:
            community = Community(
                name=data.get('name'),
                description=data.get('description'),
                location=data.get('location'),
                population=data.get('population'),
                health_center_id=data.get('health_center_id')
            )
            
            db.session.add(community)
            db.session.commit()
            
            return community, None
            
        except Exception as e:
            db.session.rollback()
            return None, f"Error al crear comunidad: {str(e)}"
    
    @staticmethod
    def get_all_communities(filters=None):
        """
        Obtiene todas las comunidades con filtros opcionales
        
        Args:
            filters (dict): Filtros opcionales
        
        Returns:
            list: Lista de comunidades
        """
        query = Community.query
        
        if filters:
            if 'location' in filters:
                query = query.filter(Community.location.ilike(f"%{filters['location']}%"))
            if 'health_center_id' in filters:
                query = query.filter_by(health_center_id=filters['health_center_id'])
        
        return query.all()
    
    @staticmethod
    def get_community_by_id(community_id):
        """Obtiene una comunidad por ID"""
        return Community.query.get(community_id)
    
    @staticmethod
    def update_community(community_id, data):
        """
        Actualiza una comunidad existente
        
        Args:
            community_id (int): ID de la comunidad
            data (dict): Datos a actualizar
        
        Returns:
            tuple: (comunidad actualizada, mensaje de error si existe)
        """
        community = Community.query.get(community_id)
        
        if not community:
            return None, "Comunidad no encontrada"
        
        try:
            if 'name' in data:
                community.name = data['name']
            if 'description' in data:
                community.description = data['description']
            if 'location' in data:
                community.location = data['location']
            if 'population' in data:
                community.population = data['population']
            if 'health_center_id' in data:
                community.health_center_id = data['health_center_id']
            
            db.session.commit()
            return community, None
            
        except Exception as e:
            db.session.rollback()
            return None, f"Error al actualizar comunidad: {str(e)}"
    
    @staticmethod
    def add_member_to_community(community_id, user_id):
        """
        Añade un miembro a una comunidad
        
        Args:
            community_id (int): ID de la comunidad
            user_id (int): ID del usuario
        
        Returns:
            tuple: (éxito, mensaje)
        """
        from app.models.user import User
        
        community = Community.query.get(community_id)
        user = User.query.get(user_id)
        
        if not community:
            return False, "Comunidad no encontrada"
        if not user:
            return False, "Usuario no encontrado"
        
        try:
            if user not in community.members:
                community.members.append(user)
                db.session.commit()
                return True, "Usuario añadido a la comunidad exitosamente"
            else:
                return False, "El usuario ya es miembro de esta comunidad"
                
        except Exception as e:
            db.session.rollback()
            return False, f"Error al añadir miembro: {str(e)}"
