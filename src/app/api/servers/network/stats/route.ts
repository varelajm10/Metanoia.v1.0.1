import { NextRequest, NextResponse } from 'next/server'
import { ServerNetworkService } from '@/lib/services/server-network'

// GET /api/servers/network/stats - Obtener estadísticas de red
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const stats = await ServerNetworkService.getNetworkStats(tenantId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching network stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas de red',
      },
      { status: 500 }
    )
  }
}
