import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { getOrders, createOrder } from '@/lib/services/order'
import { OrderQuerySchema, CreateOrderSchema } from '@/lib/validations/order'

// GET /api/orders - Listar órdenes con filtros y paginación
export async function GET(request: NextRequest) {
  try {
    // Verificar permisos de lectura
    const { error, user } = await requirePermission(request, 'orders', 'read')
    if (error) return error

    const tenantId = getTenantId(user!)

    // Obtener y validar parámetros de consulta
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    const validation = OrderQuerySchema.safeParse(queryParams)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Parámetros de consulta inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const query = validation.data

    // Obtener órdenes
    const result = await getOrders(query, tenantId)

    return NextResponse.json({
      success: true,
      data: result.orders,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error('Error en GET /api/orders:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}

// POST /api/orders - Crear nueva orden
export async function POST(request: NextRequest) {
  try {
    // Verificar permisos de escritura
    const { error, user } = await requirePermission(request, 'orders', 'write')
    if (error) return error

    const tenantId = getTenantId(user!)
    const userId = user!.id

    // Obtener y validar datos del cuerpo
    const body = await request.json()
    const validation = CreateOrderSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const orderData = validation.data

    // Crear orden
    const order = await createOrder(orderData, tenantId, userId)

    return NextResponse.json(
      {
        success: true,
        data: order,
        message: 'Orden creada exitosamente',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error en POST /api/orders:', error)

    if (error instanceof Error) {
      if (
        error.message.includes('no encontrado') ||
        error.message.includes('inactivo')
      ) {
        return NextResponse.json(
          {
            error: 'Error de validación',
            message: error.message,
          },
          { status: 404 }
        )
      }

      if (error.message.includes('Errores de stock')) {
        return NextResponse.json(
          {
            error: 'Error de stock',
            message: error.message,
          },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
