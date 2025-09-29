import { NextRequest, NextResponse } from 'next/server'
import { ServerMonitoringService } from '@/lib/services/server-monitoring'

// GET /api/servers/monitoring/metrics/aggregated - Obtener métricas agregadas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'
    const serverId = searchParams.get('serverId')
    const metricType = searchParams.get('metricType') || 'CPU_USAGE'
    const interval = (searchParams.get('interval') || '5m') as
      | '1m'
      | '5m'
      | '15m'
      | '1h'
      | '1d'
    const hours = parseInt(searchParams.get('hours') || '24')

    if (!serverId) {
      return NextResponse.json(
        {
          success: false,
          error: 'serverId es requerido',
        },
        { status: 400 }
      )
    }

    const metrics = await ServerMonitoringService.getAggregatedMetrics(
      tenantId,
      serverId,
      metricType,
      interval,
      hours
    )

    return NextResponse.json({
      success: true,
      data: metrics,
    })
  } catch (error) {
    console.error('Error fetching aggregated metrics:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener métricas agregadas',
      },
      { status: 500 }
    )
  }
}
