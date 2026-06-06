# app/extensions.py
"""
Extensiones de Flask para la aplicación
Inicializa SQLAlchemy, JWT, CORS, etc.
"""
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Inicializar extensiones
db = SQLAlchemy()
jwt = JWTManager()

# Configurar CORS con los orígenes permitidos
cors = CORS(
    resources={
        r"/*": {
            "origins": [
                "http://localhost:3000",    # Create React App
                "http://localhost:5173",    # Vite
                "http://localhost:5174",    # Vite (puerto alternativo)
                "http://127.0.0.1:3000",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174",
                "https://proyecto-graduacion2025-1.onrender.com"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": [
                "Content-Type",
                "Authorization",
                "Access-Control-Allow-Credentials"
            ],
            "supports_credentials": True,
            "expose_headers": ["Content-Type", "Authorization"],
            "max_age": 3600
        }
    }
)
