import { NextRequest, NextResponse } from 'next/server'
import { ServerNetworkService } from '@/lib/services/server-network'

// GET /api/servers/network/analysis - Obtener análisis de conectividad
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'
    const serverId = searchParams.get('serverId')

    const analysis = await ServerNetworkService.getConnectivityAnalysis(
      tenantId,
      serverId || undefined
    )

    return NextResponse.json({
      success: true,
      data: analysis,
    })
  } catch (error) {
    console.error('Error fetching connectivity analysis:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener análisis de conectividad',
      },
      { status: 500 }
    )
  }
}
