import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { getProductBrands } from '@/lib/services/product'

// GET /api/products/brands - Obtener marcas de productos
export async function GET(request: NextRequest) {
  try {
    // Verificar permisos de lectura
    const { error, user } = await requirePermission(request, 'products', 'read')
    if (error) return error

    const tenantId = getTenantId(user!)

    // Obtener marcas
    const brands = await getProductBrands(tenantId)

    return NextResponse.json({
      success: true,
      data: brands,
      count: brands.length,
    })
  } catch (error) {
    console.error('Error en GET /api/products/brands:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
