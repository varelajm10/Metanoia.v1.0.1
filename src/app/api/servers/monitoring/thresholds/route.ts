import { NextRequest, NextResponse } from 'next/server'
import { ServerMonitoringService } from '@/lib/services/server-monitoring'
import { MetricThresholdSchema } from '@/lib/validations/server-monitoring'

// GET /api/servers/monitoring/thresholds - Obtener umbrales de métricas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'
    const serverId = searchParams.get('serverId')

    const thresholds = await ServerMonitoringService.getThresholds(
      tenantId,
      serverId || undefined
    )

    return NextResponse.json({
      success: true,
      data: thresholds,
    })
  } catch (error) {
    console.error('Error fetching thresholds:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener umbrales',
      },
      { status: 500 }
    )
  }
}

// POST /api/servers/monitoring/thresholds - Crear nuevo umbral
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = MetricThresholdSchema.parse(body)

    const threshold = await ServerMonitoringService.createThreshold(
      validatedData,
      tenantId
    )

    return NextResponse.json(
      {
        success: true,
        data: threshold,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating threshold:', error)

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
        error: 'Error al crear umbral',
      },
      { status: 500 }
    )
  }
}
