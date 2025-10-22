import os
from datetime import timedelta
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

class Config:
    """Clase base de configuración"""
    
    # Configuración general
    SECRET_KEY = os.getenv('SECRET_KEY', 'jwt-secret-key-change-in-production')
    FLASK_APP = os.getenv('FLASK_APP', 'app.py')
    
    # Configuración de base de datos PostgreSQL
    DB_HOST = os.getenv('DB_HOST', 'dpg-d3s775umcj7s73avqd60-a.oregon-postgres.render.com')
    DB_PORT = os.getenv('DB_PORT', '5432')
    DB_NAME = os.getenv('DB_NAME', 'salud_cosaludcomunitariamunitaria')
    DB_USER = os.getenv('DB_USER', 'saint_x')
    DB_PASSWORD = os.getenv('DB_PASSWORD', 'CFmL6E619TrB5dMBeQbHc8XkLhwWHYbe')
    
    SQLALCHEMY_DATABASE_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configuración JWT - ✅ CORREGIDO
    # Configuración JWT - ✅ AGREGAR ESTAS LÍNEAS
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    try:
        jwt_hours = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', '24'))
    except (ValueError, TypeError):
        jwt_hours = 24
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=jwt_hours)
    JWT_TOKEN_LOCATION = ['headers']  # ✅ AGREGAR ESTA LÍNEA
    JWT_HEADER_NAME = 'Authorization'  # ✅ AGREGAR ESTA LÍNEA
    JWT_HEADER_TYPE = 'Bearer'  # ✅ AGREGAR ESTA LÍNEA
    
    # CORS
    CORS_HEADERS = 'Content-Type'


class DevelopmentConfig(Config):
    """Configuración para desarrollo"""
    DEBUG = True
    TESTING = False
    # ✅ Para desarrollo, tokens de 24 horas
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)


class ProductionConfig(Config):
    """Configuración para producción"""
    DEBUG = False
    TESTING = False


class TestingConfig(Config):
    """Configuración para testing"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'


# Diccionario de configuraciones
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
"tjeaskfjdsalkjfgdsa"