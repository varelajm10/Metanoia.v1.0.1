import { NextRequest, NextResponse } from 'next/server'
import { ServerMonitoringService } from '@/lib/services/server-monitoring'

// GET /api/servers/monitoring/stats - Obtener estadísticas de monitoreo
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const stats = await ServerMonitoringService.getMonitoringStats(tenantId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching monitoring stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas de monitoreo',
      },
      { status: 500 }
    )
  }
}
