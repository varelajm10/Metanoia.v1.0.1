import { NextRequest, NextResponse } from 'next/server'
import { ElevatorTechnicianService } from '@/lib/services/elevator-technician'

// GET /api/elevators/technicians/stats - Obtener estadísticas de técnicos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const stats = await ElevatorTechnicianService.getTechnicianStats(tenantId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching technician stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas de técnicos',
      },
      { status: 500 }
    )
  }
}
