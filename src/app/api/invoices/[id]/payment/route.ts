import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { recordPayment } from '@/lib/services/invoice'
import { RecordPaymentSchema } from '@/lib/validations/invoice'

// PATCH /api/invoices/[id]/payment - Registrar pago de factura
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar permisos de escritura
    const { error, user } = await requirePermission(
      request,
      'invoices',
      'write'
    )
    if (error) return error

    const tenantId = getTenantId(user!)
    const { id } = params

    // Obtener y validar datos del cuerpo
    const body = await request.json()
    const validation = RecordPaymentSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const paymentData = validation.data

    // Registrar pago
    const invoice = await recordPayment(id, paymentData, tenantId)

    return NextResponse.json({
      success: true,
      data: invoice,
      message: 'Pago registrado exitosamente',
    })
  } catch (error) {
    console.error('Error en PATCH /api/invoices/[id]/payment:', error)

    if (error instanceof Error) {
      if (error.message.includes('no encontrada')) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      if (
        error.message.includes('No se puede registrar pago') ||
        error.message.includes('El monto del pago')
      ) {
        return NextResponse.json(
          {
            error: 'Error de validación',
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
