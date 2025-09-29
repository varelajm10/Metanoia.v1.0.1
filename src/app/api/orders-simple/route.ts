import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 [ORDERS-SIMPLE] Fetching orders...')

    // Datos mock para que el dashboard funcione
    const mockOrders = [
      {
        id: '1',
        customerId: '1',
        customerName: 'Juan Pérez',
        total: 1500,
        status: 'COMPLETED',
        createdAt: new Date().toISOString(),
        items: [
          { productId: '1', quantity: 2, price: 100 },
          { productId: '2', quantity: 1, price: 200 },
        ],
      },
      {
        id: '2',
        customerId: '2',
        customerName: 'María González',
        total: 800,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        items: [{ productId: '3', quantity: 1, price: 150 }],
      },
      {
        id: '3',
        customerId: '1',
        customerName: 'Juan Pérez',
        total: 300,
        status: 'PROCESSING',
        createdAt: new Date().toISOString(),
        items: [{ productId: '1', quantity: 1, price: 100 }],
      },
    ]

    console.log('✅ [ORDERS-SIMPLE] Returning mock orders')

    return NextResponse.json({
      success: true,
      orders: mockOrders,
      total: mockOrders.length,
      message: 'Órdenes cargadas exitosamente',
    })
  } catch (error) {
    console.error('❌ [ORDERS-SIMPLE] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        orders: [],
        total: 0,
      },
      { status: 500 }
    )
  }
}
