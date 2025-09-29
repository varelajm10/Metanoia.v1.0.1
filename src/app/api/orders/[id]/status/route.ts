import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { updateOrderStatus } from '@/lib/services/order'
import { UpdateOrderStatusSchema } from '@/lib/validations/order'

// PATCH /api/orders/[id]/status - Actualizar estado de la orden
export async function PATCH(
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
    const validation = UpdateOrderStatusSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const statusUpdate = validation.data

    // Actualizar estado de la orden
    const order = await updateOrderStatus(id, statusUpdate, tenantId)

    return NextResponse.json({
      success: true,
      data: order,
      message: `Estado de la orden actualizado a ${statusUpdate.status}`,
    })
  } catch (error) {
    console.error('Error en PATCH /api/orders/[id]/status:', error)

    if (error instanceof Error) {
      if (error.message.includes('no encontrada')) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      if (error.message.includes('No se puede cambiar el estado')) {
        return NextResponse.json(
          {
            error: 'Transición de estado inválida',
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
