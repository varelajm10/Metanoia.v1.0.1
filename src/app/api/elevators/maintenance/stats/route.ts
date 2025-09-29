import { NextRequest, NextResponse } from 'next/server'
import { ElevatorMaintenanceService } from '@/lib/services/elevator-maintenance'

// GET /api/elevators/maintenance/stats - Obtener estadísticas de mantenimiento
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const stats = await ElevatorMaintenanceService.getMaintenanceStats(tenantId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching maintenance stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas de mantenimiento',
      },
      { status: 500 }
    )
  }
}
