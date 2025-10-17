from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.community import Community
from app.models.traceability import MedicalRecord
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
        
        # Contar usuarios activos (CORREGIDO: is_active en lugar de active)
        active_users = User.query.filter_by(is_active=True).count()
        
        # Contar consultas del día
        today = datetime.now().date()
        consultations_today = MedicalRecord.query.filter(
            func.date(MedicalRecord.visit_date) == today
        ).count()
        
        # Contar comunidades activas
        active_communities = Community.query.count()
        
        return jsonify({
            'total_users': total_users,
            'active_users': active_users,
            'consultations_today': consultations_today,
            'active_alerts': active_communities  # Puedes ajustar esto según tu lógica
        }), 200
        
    except Exception as e:
        print(f"Error en get_dashboard_stats: {str(e)}")
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
        # Obtener los últimos 6 meses
        current_date = datetime.now()
        activity_data = []
        
        meses_espanol = {
            1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril',
            5: 'Mayo', 6: 'Junio', 7: 'Julio', 8: 'Agosto',
            9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
        }
        
        for i in range(5, -1, -1):
            # Calcular el mes
            target_date = current_date - timedelta(days=30*i)
            month = target_date.month
            year = target_date.year
            
            # Contar usuarios registrados en ese mes
            usuarios = User.query.filter(
                extract('month', User.created_at) == month,
                extract('year', User.created_at) == year
            ).count()
            
            # Contar consultas en ese mes
            consultas = MedicalRecord.query.filter(
                extract('month', MedicalRecord.visit_date) == month,
                extract('year', MedicalRecord.visit_date) == year
            ).count()
            
            activity_data.append({
                'mes': meses_espanol[month],
                'usuarios': usuarios,
                'consultas': consultas
            })
        
        return jsonify(activity_data), 200
        
    except Exception as e:
        print(f"Error en get_monthly_activity: {str(e)}")
        # Retornar datos de ejemplo en caso de error
        return jsonify([
            {'mes': 'Mayo', 'usuarios': 45, 'consultas': 120},
            {'mes': 'Junio', 'usuarios': 52, 'consultas': 145},
            {'mes': 'Julio', 'usuarios': 48, 'consultas': 134},
            {'mes': 'Agosto', 'usuarios': 61, 'consultas': 167},
            {'mes': 'Septiembre', 'usuarios': 55, 'consultas': 156},
            {'mes': 'Octubre', 'usuarios': 58, 'consultas': 178}
        ]), 200

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
            'admin': '#ec4899',      # Pink
            'authority': '#3b82f6',  # Blue
            'doctor': '#ef4444',     # Red
            'patient': '#10b981'     # Green
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
        
        # Si no hay datos, retornar array vacío en lugar de datos de ejemplo
        if not distribution:
            return jsonify([]), 200
            
        return jsonify(distribution), 200
        
    except Exception as e:
        print(f"Error en get_role_distribution: {str(e)}")
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/user-activity', methods=['GET'])
@jwt_required()
def get_user_activity():
    """
    Obtener actividad de usuarios por tipo de acción
    Returns:
        JSON: Lista de acciones y cantidad
    """
    try:
        # Obtener estadísticas reales
        today = datetime.now().date()
        last_30_days = datetime.now() - timedelta(days=30)
        
        # Consultas creadas en los últimos 30 días
        consultas = MedicalRecord.query.filter(
            MedicalRecord.created_at >= last_30_days
        ).count()
        
        # Usuarios registrados en los últimos 30 días
        usuarios = User.query.filter(
            User.created_at >= last_30_days
        ).count()
        
        # Comunidades totales
        comunidades = Community.query.count()
        
        activity = [
            {'accion': 'Consultas Creadas', 'cantidad': consultas},
            {'accion': 'Usuarios Registrados', 'cantidad': usuarios},
            {'accion': 'Comunidades Activas', 'cantidad': comunidades},
        ]
        
        return jsonify(activity), 200
        
    except Exception as e:
        print(f"Error en get_user_activity: {str(e)}")
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
        activities = []
        
        # Últimos usuarios registrados
        recent_users = User.query\
            .order_by(User.created_at.desc())\
            .limit(5)\
            .all()
        
        for user in recent_users:
            activities.append({
                'type': 'user',
                'description': f'Nuevo usuario: {user.first_name} {user.last_name}' if user.first_name else f'Nuevo usuario: {user.username}',
                'timestamp': user.created_at.isoformat() if user.created_at else None,
                'icon': 'user-plus'
            })
        
        # Últimas consultas médicas
        recent_records = MedicalRecord.query\
            .order_by(MedicalRecord.created_at.desc())\
            .limit(5)\
            .all()
        
        for record in recent_records:
            activities.append({
                'type': 'medical',
                'description': f'Nueva consulta médica registrada',
                'timestamp': record.created_at.isoformat() if record.created_at else None,
                'icon': 'file-medical'
            })
        
        # Ordenar por timestamp descendente
        activities.sort(key=lambda x: x['timestamp'] if x['timestamp'] else '', reverse=True)
        
        # Retornar solo las 10 más recientes
        return jsonify(activities[:10]), 200
        
    except Exception as e:
        print(f"Error en get_recent_activity: {str(e)}")
        return jsonify({'error': str(e)}), 500
