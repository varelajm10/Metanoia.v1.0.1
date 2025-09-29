import { NextRequest, NextResponse } from 'next/server'
import { ServerService } from '@/lib/services/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const stats = await ServerService.getServerStats(tenantId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching server stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas de servidores',
      },
      { status: 500 }
    )
  }
}
