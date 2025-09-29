import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import {
  getInvoiceById,
  updateInvoice,
  cancelInvoice,
} from '@/lib/services/invoice'
import { UpdateInvoiceSchema } from '@/lib/validations/invoice'

// GET /api/invoices/[id] - Obtener factura por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar permisos de lectura
    const { error, user } = await requirePermission(request, 'invoices', 'read')
    if (error) return error

    const tenantId = getTenantId(user!)
    const { id } = params

    // Obtener factura
    const invoice = await getInvoiceById(id, tenantId)

    if (!invoice) {
      return NextResponse.json(
        { error: 'Factura no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: invoice,
    })
  } catch (error) {
    console.error('Error en GET /api/invoices/[id]:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}

// PUT /api/invoices/[id] - Actualizar factura
export async function PUT(
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
    const validation = UpdateInvoiceSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const invoiceData = validation.data

    // Actualizar factura
    const invoice = await updateInvoice(id, invoiceData, tenantId)

    return NextResponse.json({
      success: true,
      data: invoice,
      message: 'Factura actualizada exitosamente',
    })
  } catch (error) {
    console.error('Error en PUT /api/invoices/[id]:', error)

    if (error instanceof Error) {
      if (error.message.includes('no encontrada')) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      if (error.message.includes('No se puede modificar')) {
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

// DELETE /api/invoices/[id] - Cancelar factura
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar permisos de eliminación
    const { error, user } = await requirePermission(
      request,
      'invoices',
      'delete'
    )
    if (error) return error

    const tenantId = getTenantId(user!)
    const { id } = params

    // Obtener razón de cancelación del cuerpo (opcional)
    let reason: string | undefined
    try {
      const body = await request.json()
      reason = body.reason
    } catch {
      // No hay cuerpo o está vacío
    }

    // Cancelar factura
    const invoice = await cancelInvoice(id, tenantId, reason)

    return NextResponse.json({
      success: true,
      data: invoice,
      message: 'Factura cancelada exitosamente',
    })
  } catch (error) {
    console.error('Error en DELETE /api/invoices/[id]:', error)

    if (error instanceof Error) {
      if (error.message.includes('no encontrada')) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      if (error.message.includes('No se puede cancelar')) {
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
