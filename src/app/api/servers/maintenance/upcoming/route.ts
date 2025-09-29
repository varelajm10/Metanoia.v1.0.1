import { NextRequest, NextResponse } from 'next/server'
import { ServerMaintenanceService } from '@/lib/services/server-maintenance'

// GET /api/servers/maintenance/upcoming - Obtener mantenimientos próximos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'
    const days = parseInt(searchParams.get('days') || '7')

    const upcomingMaintenances =
      await ServerMaintenanceService.getUpcomingMaintenances(tenantId, days)

    return NextResponse.json({
      success: true,
      data: upcomingMaintenances,
    })
  } catch (error) {
    console.error('Error fetching upcoming maintenances:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener mantenimientos próximos',
      },
      { status: 500 }
    )
  }
}
