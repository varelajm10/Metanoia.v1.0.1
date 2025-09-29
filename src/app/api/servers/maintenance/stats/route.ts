import { NextRequest, NextResponse } from 'next/server'
import { ServerMaintenanceService } from '@/lib/services/server-maintenance'

// GET /api/servers/maintenance/stats - Obtener estadísticas de mantenimientos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const stats = await ServerMaintenanceService.getMaintenanceStats(tenantId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching maintenance stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas de mantenimientos',
      },
      { status: 500 }
    )
  }
}
