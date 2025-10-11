import os
from app import create_app

# Obtener configuración del entorno
config_name = os.getenv('FLASK_ENV', 'development')
if config_name not in ['development', 'production', 'testing']:
    config_name = 'development'

# Crear aplicación
app = create_app(config_name)

if __name__ == '__main__':
    # Ejecutar servidor en modo debug para desarrollo
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=app.config['DEBUG']
    )