import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { getLowStockProducts } from '@/lib/services/product'
import { z } from 'zod'

const LowStockQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50),
})

// GET /api/products/low-stock - Obtener productos con stock bajo
export async function GET(request: NextRequest) {
  try {
    // Verificar permisos de lectura
    const { error, user } = await requirePermission(request, 'products', 'read')
    if (error) return error

    const tenantId = getTenantId(user!)

    // Obtener y validar parámetros de consulta
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    const validation = LowStockQuerySchema.safeParse(queryParams)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Parámetros de consulta inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const { limit } = validation.data

    // Obtener productos con stock bajo
    const products = await getLowStockProducts(tenantId, limit)

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    })
  } catch (error) {
    console.error('Error en GET /api/products/low-stock:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
