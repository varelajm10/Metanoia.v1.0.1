import { NextRequest, NextResponse } from 'next/server'
import { ElevatorTechnicianService } from '@/lib/services/elevator-technician'

// GET /api/elevators/spare-parts/stats - Obtener estadísticas de repuestos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const stats = await ElevatorTechnicianService.getSparePartStats(tenantId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching spare part stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas de repuestos',
      },
      { status: 500 }
    )
  }
}
