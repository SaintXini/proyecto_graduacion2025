from app.extensions import db
from datetime import datetime

class Report(db.Model):
    """
    Reportes generados por el sistema
    """
    __tablename__ = 'reports'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    report_type = db.Column(db.String(50), nullable=False)  # health, nutrition, community, etc.
    description = db.Column(db.Text)
    data = db.Column(db.JSON)  # Datos del reporte en formato JSON
    community_id = db.Column(db.Integer, db.ForeignKey('communities.id'))
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    period_start = db.Column(db.Date)
    period_end = db.Column(db.Date)
    
    # Relaciones
    community = db.relationship('Community', back_populates='reports')
    created_by_user = db.relationship('User', back_populates='reports_created')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'report_type': self.report_type,
            'description': self.description,
            'data': self.data,
            'community_id': self.community_id,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'period_start': self.period_start.isoformat() if self.period_start else None,
            'period_end': self.period_end.isoformat() if self.period_end else None
        }
