from app import create_app
from flask_jwt_extended import create_access_token, decode_token
from datetime import timedelta

# Crear app
app = create_app('development')

with app.app_context():
    # 1. Verificar configuración JWT
    print("=" * 60)
    print("CONFIGURACIÓN JWT")
    print("=" * 60)
    print(f"JWT_SECRET_KEY: {app.config.get('JWT_SECRET_KEY')}")
    print(f"JWT_ACCESS_TOKEN_EXPIRES: {app.config.get('JWT_ACCESS_TOKEN_EXPIRES')}")
    print(f"JWT_TOKEN_LOCATION: {app.config.get('JWT_TOKEN_LOCATION', ['headers'])}")
    print()
    
    # 2. Generar un token de prueba
    print("=" * 60)
    print("GENERANDO TOKEN DE PRUEBA")
    print("=" * 60)
    test_token = create_access_token(identity=1)
    print(f"Token generado: {test_token[:50]}...")
    print()
    
    # 3. Decodificar el token
    print("=" * 60)
    print("DECODIFICANDO TOKEN")
    print("=" * 60)
    try:
        decoded = decode_token(test_token)
        print(f"✅ Token decodificado exitosamente:")
        print(f"   - Identity (sub): {decoded.get('sub')}")
        print(f"   - Type: {decoded.get('type')}")
        print(f"   - Expires (exp): {decoded.get('exp')}")
        print(f"   - JTI: {decoded.get('jti')}")
    except Exception as e:
        print(f"❌ Error al decodificar token: {e}")
    print()
    
    # 4. Verificar que el token sea válido
    print("=" * 60)
    print("VERIFICACIÓN DE TOKEN EN RUTA PROTEGIDA")
    print("=" * 60)
    
    # Simular una petición con el token
    with app.test_client() as client:
        # Login para obtener un token real
        login_response = client.post('/api/login', json={
            'username': 'admin',
            'password': 'Admin123'
        })
        
        if login_response.status_code == 200:
            real_token = login_response.json.get('token')
            print(f"✅ Login exitoso, token obtenido")
            print(f"   Token: {real_token[:50]}...")
            print()
            
            # Intentar acceder a una ruta protegida
            print("Intentando acceder a /api/users con el token...")
            users_response = client.get('/api/users', headers={
                'Authorization': f'Bearer {real_token}',
                'Content-Type': 'application/json'
            })
            
            print(f"Status Code: {users_response.status_code}")
            print(f"Response: {users_response.json}")
            
            if users_response.status_code == 401:
                print("\n❌ ERROR: Token rechazado con 401")
                print("Esto indica que @jwt_required() no está funcionando correctamente")
            else:
                print("\n✅ Token aceptado correctamente")
        else:
            print(f"❌ Login falló: {login_response.json}")