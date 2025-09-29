import { NextRequest, NextResponse } from 'next/server'
import { ElevatorService } from '@/lib/services/elevator'

// GET /api/elevators/stats - Obtener estadísticas de ascensores
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const stats = await ElevatorService.getElevatorStats(tenantId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching elevator stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas de ascensores',
      },
      { status: 500 }
    )
  }
}
