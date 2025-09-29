import { NextRequest, NextResponse } from 'next/server'
import { ServerUserAccessService } from '@/lib/services/server-user'

// GET /api/servers/users/stats - Obtener estadísticas de usuarios de servidores
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const stats = await ServerUserAccessService.getUserAccessStats(tenantId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching server user stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas de usuarios',
      },
      { status: 500 }
    )
  }
}
