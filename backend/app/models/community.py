from app.extensions import db
from datetime import datetime


# Tabla de asociación many-to-many entre usuarios y comunidades
user_communities = db.Table('user_communities',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('community_id', db.Integer, db.ForeignKey('communities.id'), primary_key=True),
    db.Column('joined_at', db.DateTime, default=datetime.utcnow)
)


class Community(db.Model):
    """
    Modelo de Comunidad
    Representa comunidades o grupos de usuarios
    """
    __tablename__ = 'communities'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    location = db.Column(db.String(200))
    population = db.Column(db.Integer)
    health_center_id = db.Column(db.Integer, db.ForeignKey('health_centers.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    members = db.relationship('User', secondary='user_communities', back_populates='communities')
    health_center = db.relationship('HealthCenter', back_populates='communities')
    reports = db.relationship('Report', back_populates='community')
    
    def to_dict(self):
        """Convertir a diccionario para JSON"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'location': self.location,
            'population': self.population,
            'health_center_id': self.health_center_id,
            'member_count': len(self.members),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class HealthCenter(db.Model):
    """
    Modelo de Centro de Salud
    """
    __tablename__ = 'health_centers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    address = db.Column(db.String(300))
    phone = db.Column(db.String(20))
    capacity = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    communities = db.relationship('Community', back_populates='health_center')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'phone': self.phone,
            'capacity': self.capacity
        }
