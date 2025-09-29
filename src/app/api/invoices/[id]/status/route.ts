import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { updateInvoiceStatus } from '@/lib/services/invoice'
import { UpdateInvoiceStatusSchema } from '@/lib/validations/invoice'

// PATCH /api/invoices/[id]/status - Actualizar estado de la factura
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
    const validation = UpdateInvoiceStatusSchema.safeParse(body)

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

    // Actualizar estado de la factura
    const invoice = await updateInvoiceStatus(id, statusUpdate, tenantId)

    return NextResponse.json({
      success: true,
      data: invoice,
      message: `Estado de la factura actualizado a ${statusUpdate.status}`,
    })
  } catch (error) {
    console.error('Error en PATCH /api/invoices/[id]/status:', error)

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
