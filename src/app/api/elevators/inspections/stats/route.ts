import { NextRequest, NextResponse } from 'next/server'
import { ElevatorInspectionService } from '@/lib/services/elevator-inspection'

// GET /api/elevators/inspections/stats - Obtener estadísticas de inspecciones
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const stats = await ElevatorInspectionService.getInspectionStats(tenantId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching inspection stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas de inspecciones',
      },
      { status: 500 }
    )
  }
}
