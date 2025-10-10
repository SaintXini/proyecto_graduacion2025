# app/routes/dashboard_routes.py
"""
Rutas para el dashboard de administración
Proporciona estadísticas y datos agregados para visualización
"""
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.community import Community
from app.extensions import db
from sqlalchemy import func, extract
from datetime import datetime, timedelta

# Crear blueprint
dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')


@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    """
    Obtener estadísticas generales del dashboard
    
    Returns:
        JSON: Estadísticas del sistema
    """
    try:
        # Contar usuarios totales
        total_users = User.query.count()
        
        # Contar usuarios activos
        active_users = User.query.filter_by(active=True).count()
        
        # Placeholder para consultas del día (ajustar según tu modelo)
        consultations_today = 234
        
        # Placeholder para alertas activas
        active_alerts = 5
        
        return jsonify({
            'total_users': total_users,
            'active_users': active_users,
            'consultations_today': consultations_today,
            'active_alerts': active_alerts
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@dashboard_bp.route('/activity', methods=['GET'])
@jwt_required()
def get_monthly_activity():
    """
    Obtener actividad mensual (usuarios y consultas por mes)
    
    Returns:
        JSON: Lista de actividad mensual
    """
    try:
        # Retornar datos de ejemplo (puedes ajustar según tus modelos)
        activity_data = [
            {'mes': 'Mayo', 'usuarios': 45, 'consultas': 120},
            {'mes': 'Junio', 'usuarios': 52, 'consultas': 145},
            {'mes': 'Julio', 'usuarios': 48, 'consultas': 134},
            {'mes': 'Agosto', 'usuarios': 61, 'consultas': 167},
            {'mes': 'Septiembre', 'usuarios': 55, 'consultas': 156},
            {'mes': 'Octubre', 'usuarios': 58, 'consultas': 178}
        ]
        
        return jsonify(activity_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@dashboard_bp.route('/roles', methods=['GET'])
@jwt_required()
def get_role_distribution():
    """
    Obtener distribución de usuarios por rol
    
    Returns:
        JSON: Distribución de roles con colores
    """
    try:
        # Contar usuarios por rol
        role_counts = db.session.query(
            User.role,
            func.count(User.id).label('count')
        ).group_by(User.role).all()
        
        # Mapeo de colores por rol
        role_colors = {
            'admin': '#ec4899',       # Pink
            'authority': '#3b82f6',   # Blue
            'doctor': '#ef4444',      # Red
            'patient': '#10b981'      # Green
        }
        
        # Mapeo de nombres en español
        role_names = {
            'admin': 'Administradores',
            'authority': 'Autoridades',
            'doctor': 'Médicos',
            'patient': 'Pacientes'
        }
        
        distribution = []
        for role, count in role_counts:
            distribution.append({
                'name': role_names.get(role, role.capitalize()),
                'value': count,
                'color': role_colors.get(role, '#6b7280')
            })
        
        return jsonify(distribution), 200
        
    except Exception as e:
        # Si hay error, retornar datos de ejemplo
        return jsonify([
            {'name': 'Administradores', 'value': 3, 'color': '#ec4899'},
            {'name': 'Autoridades', 'value': 12, 'color': '#3b82f6'},
            {'name': 'Médicos', 'value': 28, 'color': '#ef4444'},
            {'name': 'Pacientes', 'value': 35, 'color': '#10b981'}
        ]), 200


@dashboard_bp.route('/user-activity', methods=['GET'])
@jwt_required()
def get_user_activity():
    """
    Obtener actividad de usuarios por tipo de acción
    
    Returns:
        JSON: Lista de acciones y cantidad
    """
    try:
        # Datos de ejemplo (ajustar según tus modelos)
        activity = [
            {'accion': 'Consultas Creadas', 'cantidad': 156},
            {'accion': 'Usuarios Registrados', 'cantidad': 23},
            {'accion': 'Reportes Generados', 'cantidad': 45},
            {'accion': 'Comunidades Visitadas', 'cantidad': 78}
        ]
        
        return jsonify(activity), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@dashboard_bp.route('/recent-activity', methods=['GET'])
@jwt_required()
def get_recent_activity():
    """
    Obtener actividad reciente del sistema
    
    Returns:
        JSON: Lista de actividades recientes
    """
    try:
        # Últimos usuarios registrados
        recent_users = User.query\
            .order_by(User.created_at.desc())\
            .limit(5)\
            .all()
        
        activities = []
        for user in recent_users:
            activities.append({
                'type': 'user',
                'description': f'Nuevo usuario: {user.first_name} {user.last_name}',
                'timestamp': user.created_at.isoformat() if user.created_at else None,
                'icon': 'user-plus'
            })
        
        return jsonify(activities), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500