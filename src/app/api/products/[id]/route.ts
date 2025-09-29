import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from '@/lib/services/product'
import { UpdateProductSchema } from '@/lib/validations/product'

// GET /api/products/[id] - Obtener producto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar permisos de lectura
    const { error, user } = await requirePermission(request, 'products', 'read')
    if (error) return error

    const tenantId = getTenantId(user!)
    const { id } = params

    // Obtener producto
    const product = await getProductById(id, tenantId)

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('Error en GET /api/products/[id]:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Actualizar producto
export async function PUT(
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
    const validation = UpdateProductSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const productData = validation.data

    // Actualizar producto
    const product = await updateProduct(id, productData, tenantId)

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Producto actualizado exitosamente',
    })
  } catch (error) {
    console.error('Error en PUT /api/products/[id]:', error)

    if (error instanceof Error) {
      if (error.message.includes('no encontrado')) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      if (
        error.message.includes('Ya existe') ||
        error.message.includes('stock máximo')
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

// DELETE /api/products/[id] - Eliminar producto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar permisos de eliminación
    const { error, user } = await requirePermission(
      request,
      'products',
      'delete'
    )
    if (error) return error

    const tenantId = getTenantId(user!)
    const { id } = params

    // Eliminar producto
    await deleteProduct(id, tenantId)

    return NextResponse.json({
      success: true,
      message: 'Producto eliminado exitosamente',
    })
  } catch (error) {
    console.error('Error en DELETE /api/products/[id]:', error)

    if (error instanceof Error) {
      if (error.message.includes('no encontrado')) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      if (error.message.includes('órdenes asociadas')) {
        return NextResponse.json(
          {
            error: 'No se puede eliminar',
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
