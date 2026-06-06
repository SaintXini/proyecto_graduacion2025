from flask import Flask, jsonify
from config import config
from app.extensions import db, jwt, cors
from flask_migrate import Migrate
from flask_cors import CORS


def create_app(config_name='development'):
    """
    Factory function para crear la aplicación Flask
    
    Args:
        config_name (str): Nombre de la configuración ('development', 'production', 'testing')
    
    Returns:
        Flask: Instancia de la aplicación Flask configurada
    """
    
    # Crear instancia de Flask
    app = Flask(__name__)
    
    # Cargar configuración
    app.config.from_object(config[config_name])
    
    # Inicializar extensiones
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    
    
    # Inicializar Flask-Migrate para migraciones de base de datos
    migrate = Migrate(app, db)
    
    # Registrar blueprints (rutas)
    register_blueprints(app)
    
    # Registrar manejadores de errores
    register_error_handlers(app)
    
    # Configurar Swagger UI
    setup_swagger(app)
    
    # Crear tablas en modo desarrollo (solo para pruebas rápidas)
    with app.app_context():
        # Importar todos los modelos para que SQLAlchemy los reconozca
        from app.models import user, community, nutrition, traceability, report
        
        # En producción, usar migraciones de Flask-Migrate en su lugar
        if config_name == 'development':
            db.create_all()
    
    return app


def register_blueprints(app):
    """
    Registra todos los blueprints de la aplicación
    
    Args:
        app (Flask): Instancia de la aplicación Flask
    """
    from app.routes.auth_routes import auth_bp
    from app.routes.user_routes import user_bp
    from app.routes.patient_routes import patient_bp
    from app.routes.community_routes import community_bp
    from app.routes.nutrition_routes import nutrition_bp
    from app.routes.traceability_routes import traceability_bp
    from app.routes.report_routes import report_bp
    from app.routes.dashboard_routes import dashboard_bp
    
    # Registrar blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(patient_bp)
    app.register_blueprint(community_bp)
    app.register_blueprint(nutrition_bp)
    app.register_blueprint(traceability_bp)
    app.register_blueprint(report_bp)
    app.register_blueprint(dashboard_bp)


def register_error_handlers(app):
    """
    Registra manejadores de errores personalizados
    
    Args:
        app (Flask): Instancia de la aplicación Flask
    """
    
    @app.errorhandler(404)
    def not_found(error):
        """Maneja errores 404 (No encontrado)"""
        return jsonify({'message': 'Recurso no encontrado'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        """Maneja errores 500 (Error interno del servidor)"""
        db.session.rollback()
        return jsonify({'message': 'Error interno del servidor'}), 500
    
    @app.errorhandler(400)
    def bad_request(error):
        """Maneja errores 400 (Solicitud incorrecta)"""
        return jsonify({'message': 'Solicitud incorrecta'}), 400
    
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        """Maneja tokens JWT expirados"""
        return jsonify({
            'message': 'El token ha expirado',
            'error': 'token_expired'
        }), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        """Maneja tokens JWT inválidos"""
        return jsonify({
            'message': 'Token inválido',
            'error': 'invalid_token'
        }), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        """Maneja solicitudes sin token JWT"""
        return jsonify({
            'message': 'Token de autorización no encontrado',
            'error': 'authorization_required'
        }), 401


def setup_swagger(app):
    """
    Configura Swagger UI para documentación de la API
    
    Args:
        app (Flask): Instancia de la aplicación Flask
    """
    from flask_swagger_ui import get_swaggerui_blueprint
    
    # URL donde se servirá Swagger UI
    SWAGGER_URL = '/api/docs'
    # URL del archivo de especificación OpenAPI
    API_URL = '/static/swagger.json'
    
    # Crear blueprint de Swagger UI
    swaggerui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={
            'app_name': "Sistema de Salud Comunitaria API"
        }
    )
    
    # Registrar blueprint de Swagger
    app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)
    
    # Ruta para servir la especificación OpenAPI
    @app.route('/static/swagger.json')
    def swagger_spec():
        """Retorna la especificación OpenAPI en formato JSON"""
        return jsonify(get_swagger_spec())


def get_swagger_spec():
    """
    Retorna la especificación OpenAPI/Swagger de la API
    
    Returns:
        dict: Especificación OpenAPI
    """
    return {
        "openapi": "3.0.0",
        "info": {
            "title": "Sistema de Salud Comunitaria API",
            "description": "API REST para gestión de salud comunitaria con módulos de usuarios, comunidades, nutrición, trazabilidad y reportes",
            "version": "1.0.0"
        },
        "servers": [
            {
                "url": "http://localhost:5000",
                "description": "Servidor de desarrollo"
            }
        ],
        "components": {
            "securitySchemes": {
                "bearerAuth": {
                    "type": "http",
                    "scheme": "bearer",
                    "bearerFormat": "JWT"
                }
            }
        },
        "paths": {
            "/api/login": {
                "post": {
                    "tags": ["Autenticación"],
                    "summary": "Iniciar sesión",
                    "requestBody": {
                        "required": True,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "username": {"type": "string"},
                                        "password": {"type": "string"}
                                    },
                                    "required": ["username", "password"]
                                }
                            }
                        }
                    },
                    "responses": {
                        "200": {"description": "Login exitoso"},
                        "401": {"description": "Credenciales inválidas"}
                    }
                }
            },
            "/api/register": {
                "post": {
                    "tags": ["Autenticación"],
                    "summary": "Registrar nuevo usuario",
                    "requestBody": {
                        "required": True,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "username": {"type": "string"},
                                        "email": {"type": "string"},
                                        "password": {"type": "string"},
                                        "role": {"type": "string", "enum": ["admin", "authority", "doctor", "patient"]},
                                        "first_name": {"type": "string"},
                                        "last_name": {"type": "string"},
                                        "phone": {"type": "string"}
                                    },
                                    "required": ["username", "email", "password"]
                                }
                            }
                        }
                    },
                    "responses": {
                        "201": {"description": "Usuario registrado exitosamente"},
                        "400": {"description": "Datos inválidos"}
                    }
                }
            },
            "/api/users": {
                "get": {
                    "tags": ["Usuarios"],
                    "summary": "Obtener todos los usuarios",
                    "security": [{"bearerAuth": []}],
                    "parameters": [
                        {
                            "name": "role",
                            "in": "query",
                            "schema": {"type": "string"}
                        }
                    ],
                    "responses": {
                        "200": {"description": "Lista de usuarios"},
                        "401": {"description": "No autorizado"}
                    }
                },
                "post": {
                    "tags": ["Usuarios"],
                    "summary": "Crear nuevo usuario",
                    "security": [{"bearerAuth": []}],
                    "responses": {
                        "201": {"description": "Usuario creado"},
                        "400": {"description": "Datos inválidos"}
                    }
                }
            },
            "/api/users/{id}": {
                "get": {
                    "tags": ["Usuarios"],
                    "summary": "Obtener usuario por ID",
                    "security": [{"bearerAuth": []}],
                    "parameters": [
                        {
                            "name": "id",
                            "in": "path",
                            "required": True,
                            "schema": {"type": "integer"}
                        }
                    ],
                    "responses": {
                        "200": {"description": "Datos del usuario"},
                        "404": {"description": "Usuario no encontrado"}
                    }
                },
                "put": {
                    "tags": ["Usuarios"],
                    "summary": "Actualizar usuario",
                    "security": [{"bearerAuth": []}],
                    "parameters": [
                        {
                            "name": "id",
                            "in": "path",
                            "required": True,
                            "schema": {"type": "integer"}
                        }
                    ],
                    "responses": {
                        "200": {"description": "Usuario actualizado"},
                        "404": {"description": "Usuario no encontrado"}
                    }
                },
                "delete": {
                    "tags": ["Usuarios"],
                    "summary": "Eliminar usuario",
                    "security": [{"bearerAuth": []}],
                    "parameters": [
                        {
                            "name": "id",
                            "in": "path",
                            "required": True,
                            "schema": {"type": "integer"}
                        }
                    ],
                    "responses": {
                        "200": {"description": "Usuario eliminado"},
                        "404": {"description": "Usuario no encontrado"}
                    }
                }
            },
            "/api/communities": {
                "get": {
                    "tags": ["Comunidades"],
                    "summary": "Obtener todas las comunidades",
                    "security": [{"bearerAuth": []}],
                    "responses": {
                        "200": {"description": "Lista de comunidades"}
                    }
                },
                "post": {
                    "tags": ["Comunidades"],
                    "summary": "Crear nueva comunidad",
                    "security": [{"bearerAuth": []}],
                    "responses": {
                        "201": {"description": "Comunidad creada"}
                    }
                }
            },
            "/api/nutrition": {
                "get": {
                    "tags": ["Nutrición"],
                    "summary": "Obtener planes de nutrición",
                    "security": [{"bearerAuth": []}],
                    "responses": {
                        "200": {"description": "Lista de planes de nutrición"}
                    }
                },
                "post": {
                    "tags": ["Nutrición"],
                    "summary": "Crear plan de nutrición",
                    "security": [{"bearerAuth": []}],
                    "responses": {
                        "201": {"description": "Plan creado"}
                    }
                }
            },
            "/api/traceability": {
                "get": {
                    "tags": ["Trazabilidad"],
                    "summary": "Obtener registros médicos",
                    "security": [{"bearerAuth": []}],
                    "responses": {
                        "200": {"description": "Lista de registros médicos"}
                    }
                },
                "post": {
                    "tags": ["Trazabilidad"],
                    "summary": "Crear registro médico",
                    "security": [{"bearerAuth": []}],
                    "responses": {
                        "201": {"description": "Registro creado"}
                    }
                }
            },
            "/api/reports": {
                "get": {
                    "tags": ["Reportes"],
                    "summary": "Obtener reportes",
                    "security": [{"bearerAuth": []}],
                    "responses": {
                        "200": {"description": "Lista de reportes"}
                    }
                },
                "post": {
                    "tags": ["Reportes"],
                    "summary": "Crear reporte",
                    "security": [{"bearerAuth": []}],
                    "responses": {
                        "201": {"description": "Reporte creado"}
                    }
                }
            }
        }
    }
