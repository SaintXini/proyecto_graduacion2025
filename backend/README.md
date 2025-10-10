## 📋 Requisitos Previos

- Python 3.8 o superior
- PostgreSQL 12 o superior
- pip (gestor de paquetes de Python)

🚀 INSTRUCCIONES DE EJECUCIÓN:

1. Crear entorno virtual:
   python -m venv venv
   venv\\Scripts\\activate  (Windows)
   source venv/bin/activate (Linux/Mac)

2. Instalar dependencias:
   pip install -r requirements.txt

3. Crear base de datos PostgreSQL:
   CREATE DATABASE nutridb;

4. Configurar .env con tus credenciales

5. Crear carpeta app/static/ y archivo swagger.json

6. Ejecutar servidor:
   python run.py