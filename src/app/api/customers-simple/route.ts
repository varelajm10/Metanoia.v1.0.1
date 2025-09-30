import { NextResponse } from 'next/server'

export async function GET() {
  try {

    // Datos mock para que el dashboard funcione
    const mockCustomers = [
      {
        id: '1',
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@ejemplo.com',
        phone: '+54 11 1234-5678',
        company: 'Empresa Demo',
        status: 'ACTIVE',
      },
      {
        id: '2',
        firstName: 'María',
        lastName: 'González',
        email: 'maria@ejemplo.com',
        phone: '+54 11 8765-4321',
        company: 'Corporación ABC',
        status: 'ACTIVE',
      },
    ]


    return NextResponse.json({
      success: true,
      customers: mockCustomers,
      total: mockCustomers.length,
      message: 'Clientes cargados exitosamente',
    })
  } catch (error) {
    console.error('❌ [CUSTOMERS-SIMPLE] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        customers: [],
        total: 0,
      },
      { status: 500 }
    )
  }
}
