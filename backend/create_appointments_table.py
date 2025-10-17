# Backend/create_appointments_table.py
"""
Script para crear la tabla de citas médicas
Ejecutar: python create_appointments_table.py
"""

from app import create_app
from app.extensions import db
from app.models.appointment import Appointment

def main():
    app = create_app('development')
    
    with app.app_context():
        print("\n" + "="*60)
        print("🔧 CREACIÓN DE TABLA DE CITAS MÉDICAS")
        print("="*60 + "\n")
        
        try:
            # Verificar si la tabla ya existe
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            
            if 'appointments' in inspector.get_table_names():
                print("⚠️  La tabla 'appointments' ya existe")
                response = input("¿Desea eliminarla y recrearla? (s/n): ").strip().lower()
                
                if response == 's':
                    print("🗑️  Eliminando tabla existente...")
                    Appointment.__table__.drop(db.engine)
                    print("✅ Tabla eliminada")
                else:
                    print("❌ Operación cancelada")
                    return
            
            # Crear la tabla
            print("📝 Creando tabla 'appointments'...")
            Appointment.__table__.create(db.engine)
            print("✅ Tabla 'appointments' creada exitosamente")
            
            # Mostrar estructura de la tabla
            print("\n📊 Estructura de la tabla:")
            print("-" * 60)
            for column in Appointment.__table__.columns:
                print(f"  • {column.name}: {column.type}")
            
            print("\n" + "="*60)
            print("✅ MIGRACIÓN COMPLETADA EXITOSAMENTE")
            print("="*60 + "\n")
            
            print("💡 Próximos pasos:")
            print("   1. Reinicia el servidor Flask")
            print("   2. Reinicia el frontend")
            print("   3. Ve a 'Citas Médicas' en el menú")
            print("   4. Crea tu primera cita")
            print()
            
        except Exception as e:
            print(f"\n❌ Error durante la migración: {str(e)}")
            import traceback
            traceback.print_exc()
            db.session.rollback()

if __name__ == '__main__':
    main()