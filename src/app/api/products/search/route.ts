import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { searchProducts } from '@/lib/services/product'
import { z } from 'zod'

const SearchQuerySchema = z.object({
  q: z.string().min(2, 'La búsqueda debe tener al menos 2 caracteres'),
  limit: z.coerce.number().min(1).max(50).default(10),
})

// GET /api/products/search - Buscar productos para autocompletado
export async function GET(request: NextRequest) {
  try {
    // Verificar permisos de lectura
    const { error, user } = await requirePermission(request, 'products', 'read')
    if (error) return error

    const tenantId = getTenantId(user!)

    // Obtener y validar parámetros de consulta
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    const validation = SearchQuerySchema.safeParse(queryParams)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Parámetros de consulta inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const { q: query, limit } = validation.data

    // Buscar productos
    const products = await searchProducts(query, tenantId, limit)

    return NextResponse.json({
      success: true,
      data: products,
      query,
      count: products.length,
    })
  } catch (error) {
    console.error('Error en GET /api/products/search:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
