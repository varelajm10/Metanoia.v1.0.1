import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { toggleCustomerStatus } from '@/lib/services/customer'
import { z } from 'zod'

const ToggleStatusSchema = z.object({
  isActive: z.boolean(),
})

// POST /api/customers/[id]/toggle - Activar/desactivar cliente
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar permisos de escritura
    const { error, user } = await requirePermission(
      request,
      'customers',
      'write'
    )
    if (error) return error

    const tenantId = getTenantId(user!)

    // Obtener y validar datos del cuerpo
    const body = await request.json()
    const validation = ToggleStatusSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const { isActive } = validation.data

    // Cambiar estado del cliente
    const customer = await toggleCustomerStatus(params.id, tenantId, isActive)

    return NextResponse.json({
      success: true,
      data: customer,
      message: `Cliente ${isActive ? 'activado' : 'desactivado'} exitosamente`,
    })
  } catch (error) {
    console.error('Error en POST /api/customers/[id]/toggle:', error)

    if (error instanceof Error && error.message.includes('no encontrado')) {
      return NextResponse.json(
        {
          error: 'Error de validación',
          message: error.message,
        },
        { status: 404 }
      )
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
