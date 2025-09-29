import { NextRequest, NextResponse } from 'next/server'
import { ServerMonitoringService } from '@/lib/services/server-monitoring'

// GET /api/servers/monitoring/metrics/latest - Obtener últimas métricas de todos los servidores
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'
    const serverId = searchParams.get('serverId')

    const metrics = await ServerMonitoringService.getLatestMetrics(
      tenantId,
      serverId || undefined
    )

    return NextResponse.json({
      success: true,
      data: metrics,
    })
  } catch (error) {
    console.error('Error fetching latest metrics:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener últimas métricas',
      },
      { status: 500 }
    )
  }
}
