import { NextRequest, NextResponse } from 'next/server'
import { EnhancedServerService } from '@/lib/services/server-enhanced'

// GET /api/servers/enhanced/stats - Obtener estadísticas de servidores mejoradas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const stats = await EnhancedServerService.getServerStats(tenantId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching enhanced server stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas de servidores',
      },
      { status: 500 }
    )
  }
}
