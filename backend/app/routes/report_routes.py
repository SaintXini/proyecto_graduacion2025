from flask import Blueprint
from app.controllers.report_controller import ReportController

# Crear Blueprint
report_bp = Blueprint('reports', __name__, url_prefix='/api/reports')


# Definir rutas
@report_bp.route('', methods=['GET'])
def get_reports():
    """Obtener todos los reportes"""
    return ReportController.get_reports()


@report_bp.route('', methods=['POST'])
def create_report():
    """Crear un nuevo reporte"""
    return ReportController.create_report()


@report_bp.route('/communities/<int:community_id>/stats', methods=['GET'])
def get_community_stats(community_id):
    """Obtener estadísticas de salud de una comunidad"""
    return ReportController.get_community_stats(community_id)

