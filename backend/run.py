import os
from app import create_app
from flask_cors import CORS

# Obtener configuración del entorno
config_name = os.getenv('FLASK_ENV', 'development')
if config_name not in ['development', 'production', 'testing']:
    config_name = 'development'

# Crear aplicación
app = create_app(config_name)

# ⚠️ IMPORTANTE: Configurar CORS DESPUÉS de crear la app
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "http://localhost:3000",
            "https://proyecto-graduacion2025-1.onrender.com"  # ✅ AGREGAR ESTE
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

if __name__ == '__main__':
    # Ejecutar servidor en modo debug para desarrollo
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=app.config['DEBUG']
    )