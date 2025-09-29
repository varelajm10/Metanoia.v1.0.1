import { NextRequest, NextResponse } from 'next/server'
import { ElevatorTechnicianService } from '@/lib/services/elevator-technician'

// GET /api/elevators/work-orders/stats - Obtener estadísticas de órdenes de trabajo
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const stats = await ElevatorTechnicianService.getWorkOrderStats(tenantId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching work order stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas de órdenes de trabajo',
      },
      { status: 500 }
    )
  }
}
