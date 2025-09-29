import { NextRequest, NextResponse } from 'next/server'
import { ServerMonitoringService } from '@/lib/services/server-monitoring'
import { ServerHealthSchema } from '@/lib/validations/server-monitoring'

// GET /api/servers/monitoring/health - Obtener estado de salud de servidores
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'
    const serverId = searchParams.get('serverId')

    const health = await ServerMonitoringService.getServerHealth(
      tenantId,
      serverId || undefined
    )

    return NextResponse.json({
      success: true,
      data: health,
    })
  } catch (error) {
    console.error('Error fetching server health:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estado de salud',
      },
      { status: 500 }
    )
  }
}

// POST /api/servers/monitoring/health - Actualizar estado de salud
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = ServerHealthSchema.parse(body)

    const health = await ServerMonitoringService.updateServerHealth(
      validatedData,
      tenantId
    )

    return NextResponse.json(
      {
        success: true,
        data: health,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error updating server health:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos de entrada inválidos',
          details: error.message,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Error al actualizar estado de salud',
      },
      { status: 500 }
    )
  }
}
