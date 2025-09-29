import { NextRequest, NextResponse } from 'next/server'
import { ServerNetworkService } from '@/lib/services/server-network'
import {
  NetworkMetricSchema,
  NetworkQuerySchema,
} from '@/lib/validations/server-network'

// GET /api/servers/network/metrics - Obtener métricas de red
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const queryParams = Object.fromEntries(searchParams.entries())
    const validation = NetworkQuerySchema.safeParse(queryParams)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parámetros de consulta inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const query = validation.data
    const result = await ServerNetworkService.getNetworkMetrics(tenantId, query)

    return NextResponse.json({
      success: true,
      data: result.metrics,
      pagination: {
        page: result.page,
        total: result.total,
        totalPages: result.totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching network metrics:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener métricas de red',
      },
      { status: 500 }
    )
  }
}

// POST /api/servers/network/metrics - Crear nueva métrica de red
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = NetworkMetricSchema.parse(body)

    const metric = await ServerNetworkService.createNetworkMetric(
      validatedData,
      tenantId
    )

    return NextResponse.json(
      {
        success: true,
        data: metric,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating network metric:', error)

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
        error: 'Error al crear métrica de red',
      },
      { status: 500 }
    )
  }
}
