import { NextResponse } from 'next/server'

export async function GET() {
  try {

    // Datos mock para que el dashboard funcione
    const mockModules = [
      {
        id: 'customers',
        name: 'customers',
        displayName: 'Gestión de Clientes',
        description: 'Gestiona clientes y contactos',
        icon: 'Users',
        color: '#3B82F6',
        isActive: true,
      },
      {
        id: 'servers',
        name: 'servers',
        displayName: 'Gestión de Servidores',
        description: 'Administra servidores y infraestructura',
        icon: 'Server',
        color: '#10B981',
        isActive: true,
      },
      {
        id: 'inventory',
        name: 'inventory',
        displayName: 'Inventario',
        description: 'Control de productos y stock',
        icon: 'Package',
        color: '#F59E0B',
        isActive: true,
      },
      {
        id: 'analytics',
        name: 'analytics',
        displayName: 'Reportes',
        description: 'Análisis y estadísticas',
        icon: 'BarChart3',
        color: '#8B5CF6',
        isActive: true,
      },
      {
        id: 'elevators',
        name: 'elevators',
        displayName: 'Gestión de Ascensores',
        description:
          'Módulo especializado para gestión de ascensores, mantenimiento e inspecciones',
        icon: 'Building2',
        color: '#8B5CF6',
        isActive: true,
      },
      {
        id: 'schools',
        name: 'schools',
        displayName: 'Gestión de Colegios',
        description:
          'Módulo completo para gestión integral de colegios, estudiantes, docentes, académico y finanzas',
        icon: 'GraduationCap',
        color: '#10B981',
        isActive: true,
      },
    ]


    return NextResponse.json({
      success: true,
      data: mockModules,
      message: 'Módulos cargados exitosamente',
    })
  } catch (error) {
    console.error('❌ [MODULES-SIMPLE] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        data: [],
      },
      { status: 500 }
    )
  }
}
