import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { updateProductStock } from '@/lib/services/product'
import { UpdateStockSchema } from '@/lib/validations/product'

// PATCH /api/products/[id]/stock - Actualizar stock del producto
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
    const validation = UpdateStockSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const stockUpdate = validation.data

    // Actualizar stock del producto
    const product = await updateProductStock(id, stockUpdate, tenantId)

    return NextResponse.json({
      success: true,
      data: product,
      message: `Stock actualizado exitosamente. Nuevo stock: ${product.stock}`,
    })
  } catch (error) {
    console.error('Error en PATCH /api/products/[id]/stock:', error)

    if (error instanceof Error) {
      if (error.message.includes('no encontrado')) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      if (error.message.includes('suficiente stock')) {
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
