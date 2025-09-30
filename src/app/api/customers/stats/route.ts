import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { CustomerCacheService } from '@/lib/services/customer-cache'

// GET /api/customers/stats - Obtener estadísticas básicas de clientes
export async function GET(request: NextRequest) {
  try {
    // Verificar permisos de lectura
    const { error, user } = await requirePermission(
      request,
      'customers',
      'read'
    )
    if (error) return error

    const tenantId = getTenantId(user!)

    // Obtener estadísticas con caché
    const stats = await CustomerCacheService.getCachedStats(tenantId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error en GET /api/customers/stats:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}