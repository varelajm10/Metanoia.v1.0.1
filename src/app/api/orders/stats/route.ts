import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { getOrderStats } from '@/lib/services/order'

// GET /api/orders/stats - Obtener estadísticas de órdenes
export async function GET(request: NextRequest) {
  try {
    // Verificar permisos de lectura
    const { error, user } = await requirePermission(request, 'orders', 'read')
    if (error) return error

    const tenantId = getTenantId(user!)

    // Obtener estadísticas de órdenes
    const stats = await getOrderStats(tenantId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error en GET /api/orders/stats:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
