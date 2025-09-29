import { NextRequest, NextResponse } from 'next/server'
import { ServerMonitoringService } from '@/lib/services/server-monitoring'
import {
  ServerMetricSchema,
  MetricQuerySchema,
} from '@/lib/validations/server-monitoring'

// GET /api/servers/monitoring/metrics - Obtener métricas de servidores
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const queryParams = Object.fromEntries(searchParams.entries())
    const validation = MetricQuerySchema.safeParse(queryParams)

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
    const metrics = await ServerMonitoringService.getMetrics(tenantId, query)

    return NextResponse.json({
      success: true,
      data: metrics,
    })
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener métricas',
      },
      { status: 500 }
    )
  }
}

// POST /api/servers/monitoring/metrics - Crear nueva métrica
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = ServerMetricSchema.parse(body)

    // Crear métrica
    const metric = await ServerMonitoringService.createMetric(
      validatedData,
      tenantId
    )

    // Verificar umbrales y crear alertas si es necesario
    await ServerMonitoringService.checkThresholds(
      tenantId,
      validatedData.serverId,
      validatedData.metricType,
      validatedData.value
    )

    return NextResponse.json(
      {
        success: true,
        data: metric,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating metric:', error)

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
        error: 'Error al crear métrica',
      },
      { status: 500 }
    )
  }
}
