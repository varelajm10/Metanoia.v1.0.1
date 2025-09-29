import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { toggleProductStatus } from '@/lib/services/product'
import { z } from 'zod'

const ToggleStatusSchema = z.object({
  isActive: z.boolean(),
})

// PATCH /api/products/[id]/toggle - Activar/desactivar producto
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar permisos de escritura
    const { error, user } = await requirePermission(
      request,
      'products',
      'write'
    )
    if (error) return error

    const tenantId = getTenantId(user!)
    const { id } = params

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

    // Cambiar estado del producto
    const product = await toggleProductStatus(id, tenantId, isActive)

    return NextResponse.json({
      success: true,
      data: product,
      message: `Producto ${isActive ? 'activado' : 'desactivado'} exitosamente`,
    })
  } catch (error) {
    console.error('Error en PATCH /api/products/[id]/toggle:', error)

    if (error instanceof Error && error.message.includes('no encontrado')) {
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
