import { NextRequest, NextResponse } from 'next/server'
import { ServerNetworkService } from '@/lib/services/server-network'

// GET /api/servers/network/connectivity - Obtener estado de conectividad en tiempo real
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const connectivity =
      await ServerNetworkService.getRealTimeConnectivity(tenantId)

    return NextResponse.json({
      success: true,
      data: connectivity,
    })
  } catch (error) {
    console.error('Error fetching connectivity status:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estado de conectividad',
      },
      { status: 500 }
    )
  }
}
