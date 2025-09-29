import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { getStockStats, getLowStockProducts } from '@/lib/services/product'

// GET /api/products/stats - Obtener estadísticas de inventario
export async function GET(request: NextRequest) {
  try {
    // Verificar permisos de lectura
    const { error, user } = await requirePermission(request, 'products', 'read')
    if (error) return error

    const tenantId = getTenantId(user!)

    // Obtener estadísticas de stock
    const stats = await getStockStats(tenantId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error en GET /api/products/stats:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
