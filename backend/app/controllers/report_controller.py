from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.report_service import ReportService
from app.utils.decorators import role_required

class ReportController:
    """Controlador para operaciones de reportes"""
    
    @staticmethod
    @jwt_required()
    @role_required('admin', 'authority', 'doctor')
    def get_reports():
        """
        Obtiene todos los reportes
        GET /api/reports
        Query params: report_type, community_id
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} solicitando reportes")
            
            filters = {}
            
            if request.args.get('report_type'):
                filters['report_type'] = request.args.get('report_type')
            if request.args.get('community_id'):
                filters['community_id'] = request.args.get('community_id')
            
            reports = ReportService.get_all_reports(filters)
            print(f"Reportes encontrados: {len(reports)}")
            
            return jsonify([report.to_dict() for report in reports]), 200
        except Exception as e:
            print(f"Error en get_reports: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({'message': 'Error al obtener reportes', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    @role_required('admin', 'authority', 'doctor')
    def create_report():
        """
        Crea un nuevo reporte
        POST /api/reports
        Body: {title, report_type, description, data, community_id, period_start, period_end}
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} creando reporte")
            
            data = request.get_json()
            
            required_fields = ['title', 'report_type']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({'message': f'{field} es requerido'}), 400
            
            # Añadir el ID del usuario actual como creador
            data['created_by'] = current_user_id
            
            report, error = ReportService.create_report(data)
            
            if error:
                print(f"Error creando reporte: {error}")
                return jsonify({'message': error}), 400
            
            return jsonify({
                'message': 'Reporte creado exitosamente',
                'report': report.to_dict()
            }), 201
        except Exception as e:
            print(f"Error en create_report: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({'message': 'Error al crear reporte', 'error': str(e)}), 500
    
    @staticmethod
    @jwt_required()
    @role_required('admin', 'authority', 'doctor')
    def get_community_stats(community_id):
        """
        Obtiene estadísticas de salud de una comunidad
        GET /api/reports/communities/:id/stats
        """
        try:
            current_user_id = get_jwt_identity()
            print(f"Usuario {current_user_id} solicitando estadísticas de comunidad {community_id}")
            
            stats = ReportService.get_community_health_stats(community_id)
            
            if not stats:
                return jsonify({'message': 'Comunidad no encontrada'}), 404
            
            return jsonify(stats), 200
        except Exception as e:
            print(f"Error en get_community_stats: {str(e)}")
            return jsonify({'message': 'Error al obtener estadísticas', 'error': str(e)}), 500
