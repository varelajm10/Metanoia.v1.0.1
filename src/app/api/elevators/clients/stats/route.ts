import { NextRequest, NextResponse } from 'next/server'
import { ElevatorClientService } from '@/lib/services/elevator-client'

// GET /api/elevators/clients/stats - Obtener estadísticas de clientes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const stats = await ElevatorClientService.getClientStats(tenantId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching client stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas de clientes',
      },
      { status: 500 }
    )
  }
}
