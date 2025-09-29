import { NextRequest, NextResponse } from 'next/server'
import { ElevatorInstallationService } from '@/lib/services/elevator-installation'

// GET /api/elevators/installations/stats - Obtener estadísticas de instalaciones
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const stats =
      await ElevatorInstallationService.getInstallationStats(tenantId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching installation stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas de instalaciones',
      },
      { status: 500 }
    )
  }
}
