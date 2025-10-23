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
    # ✅ Primero intenta usar DATABASE_URL si existe (para producción/Render)
    DATABASE_URL = os.getenv('DATABASE_URL')
    
    if DATABASE_URL:
        # Si existe DATABASE_URL, úsala directamente
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        # Si no existe, construye la URI desde variables individuales (para desarrollo local)
        DB_HOST = os.getenv('DB_HOST', 'dpg-d3sq91buibrs73agi17g-a.oregon-postgres.render.com')
        DB_PORT = os.getenv('DB_PORT', '5432')
        DB_NAME = os.getenv('DB_NAME', 'saludcomunitaria_pgbm')
        DB_USER = os.getenv('DB_USER', 'martin')
        DB_PASSWORD = os.getenv('DB_PASSWORD', '8mtS9EfGPNLxcydwo94i5VMcLqcxuyHN')
        SQLALCHEMY_DATABASE_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configuración JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    try:
        jwt_hours = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', '24'))
    except (ValueError, TypeError):
        jwt_hours = 24
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=jwt_hours)
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'
    
    # CORS
    CORS_HEADERS = 'Content-Type'


class DevelopmentConfig(Config):
    """Configuración para desarrollo"""
    DEBUG = True
    TESTING = False
    # Para desarrollo, tokens de 24 horas
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