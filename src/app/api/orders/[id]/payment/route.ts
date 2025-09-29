import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { updatePaymentStatus } from '@/lib/services/order'
import { UpdatePaymentStatusSchema } from '@/lib/validations/order'

// PATCH /api/orders/[id]/payment - Actualizar estado de pago
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
    const validation = UpdatePaymentStatusSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const paymentUpdate = validation.data

    // Actualizar estado de pago
    const order = await updatePaymentStatus(id, paymentUpdate, tenantId)

    return NextResponse.json({
      success: true,
      data: order,
      message: `Estado de pago actualizado a ${paymentUpdate.paymentStatus}`,
    })
  } catch (error) {
    console.error('Error en PATCH /api/orders/[id]/payment:', error)

    if (error instanceof Error && error.message.includes('no encontrada')) {
      return NextResponse.json({ error: error.message }, { status: 404 })
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
