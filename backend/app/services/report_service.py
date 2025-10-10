from app.extensions import db
from app.models.report import Report
from app.models.user import User
from app.models.community import Community
from app.models.nutrition import NutritionPlan
from app.models.traceability import MedicalRecord
from datetime import datetime
from sqlalchemy import func


class ReportService:
    """Servicio para generación de reportes y estadísticas"""
    
    @staticmethod
    def create_report(data):
        """
        Crea un nuevo reporte
        
        Args:
            data (dict): Datos del reporte
        
        Returns:
            tuple: (reporte creado, mensaje de error si existe)
        """
        try:
            report = Report(
                title=data.get('title'),
                report_type=data.get('report_type'),
                description=data.get('description'),
                data=data.get('data'),
                community_id=data.get('community_id'),
                created_by=data.get('created_by'),
                period_start=datetime.strptime(data.get('period_start'), '%Y-%m-%d').date() if data.get('period_start') else None,
                period_end=datetime.strptime(data.get('period_end'), '%Y-%m-%d').date() if data.get('period_end') else None
            )
            
            db.session.add(report)
            db.session.commit()
            
            return report, None
            
        except Exception as e:
            db.session.rollback()
            return None, f"Error al crear reporte: {str(e)}"
    
    @staticmethod
    def get_community_health_stats(community_id):
        """
        Genera estadísticas de salud de una comunidad
        
        Args:
            community_id (int): ID de la comunidad
        
        Returns:
            dict: Estadísticas de salud
        """
        community = Community.query.get(community_id)
        
        if not community:
            return None
        
        # Contar miembros por rol
        member_stats = db.session.query(
            User.role,
            func.count(User.id)
        ).join(
            Community.members
        ).filter(
            Community.id == community_id
        ).group_by(User.role).all()
        
        # Contar diagnósticos recientes
        recent_diagnoses = db.session.query(
            func.count(MedicalRecord.id)
        ).join(
            User, MedicalRecord.patient_id == User.id
        ).join(
            User.communities
        ).filter(
            Community.id == community_id
        ).scalar()
        
        return {
            'community_name': community.name,
            'total_members': len(community.members),
            'member_by_role': dict(member_stats),
            'recent_diagnoses': recent_diagnoses or 0,
            'population': community.population
        }
    
    @staticmethod
    def get_all_reports(filters=None):
        """
        Obtiene todos los reportes con filtros opcionales
        
        Args:
            filters (dict): Filtros opcionales
        
        Returns:
            list: Lista de reportes
        """
        query = Report.query
        
        if filters:
            if 'report_type' in filters:
                query = query.filter_by(report_type=filters['report_type'])
            if 'community_id' in filters:
                query = query.filter_by(community_id=filters['community_id'])
        
        return query.order_by(Report.created_at.desc()).all()