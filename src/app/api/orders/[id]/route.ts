import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { getOrderById, updateOrder, cancelOrder } from '@/lib/services/order'
import { UpdateOrderSchema } from '@/lib/validations/order'

// GET /api/orders/[id] - Obtener orden por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar permisos de lectura
    const { error, user } = await requirePermission(request, 'orders', 'read')
    if (error) return error

    const tenantId = getTenantId(user!)
    const { id } = params

    // Obtener orden
    const order = await getOrderById(id, tenantId)

    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error('Error en GET /api/orders/[id]:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}

// PUT /api/orders/[id] - Actualizar orden
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar permisos de escritura
    const { error, user } = await requirePermission(request, 'orders', 'write')
    if (error) return error

    const tenantId = getTenantId(user!)
    const { id } = params

    // Obtener y validar datos del cuerpo
    const body = await request.json()
    const validation = UpdateOrderSchema.safeParse(body)

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

    // Actualizar orden
    const order = await updateOrder(id, orderData, tenantId)

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Orden actualizada exitosamente',
    })
  } catch (error) {
    console.error('Error en PUT /api/orders/[id]:', error)

    if (error instanceof Error) {
      if (error.message.includes('no encontrada')) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      if (error.message.includes('entregada o cancelada')) {
        return NextResponse.json(
          {
            error: 'No se puede modificar',
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

// DELETE /api/orders/[id] - Cancelar orden
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar permisos de eliminación
    const { error, user } = await requirePermission(request, 'orders', 'delete')
    if (error) return error

    const tenantId = getTenantId(user!)
    const { id } = params

    // Obtener razón de cancelación del cuerpo (opcional)
    let reason: string | undefined
    try {
      const body = await request.json()
      reason = body.reason
    } catch {
      // Si no hay cuerpo, continuar sin razón
    }

    // Cancelar orden
    const order = await cancelOrder(id, tenantId, reason)

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Orden cancelada exitosamente',
    })
  } catch (error) {
    console.error('Error en DELETE /api/orders/[id]:', error)

    if (error instanceof Error) {
      if (error.message.includes('no encontrada')) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      if (error.message.includes('entregada o ya cancelada')) {
        return NextResponse.json(
          {
            error: 'No se puede cancelar',
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
