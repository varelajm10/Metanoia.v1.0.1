import { NextRequest, NextResponse } from 'next/server'
import { ServerMonitoringService } from '@/lib/services/server-monitoring'
import { UpdateMetricThresholdSchema } from '@/lib/validations/server-monitoring'

// PUT /api/servers/monitoring/thresholds/[id] - Actualizar umbral
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = UpdateMetricThresholdSchema.parse(body)

    const threshold = await ServerMonitoringService.updateThreshold(
      params.id,
      validatedData,
      tenantId
    )

    return NextResponse.json({
      success: true,
      data: threshold,
    })
  } catch (error) {
    console.error('Error updating threshold:', error)

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
        error: 'Error al actualizar umbral',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/servers/monitoring/thresholds/[id] - Eliminar umbral
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    await ServerMonitoringService.deleteThreshold(params.id, tenantId)

    return NextResponse.json({
      success: true,
      message: 'Umbral eliminado exitosamente',
    })
  } catch (error) {
    console.error('Error deleting threshold:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar umbral',
      },
      { status: 500 }
    )
  }
}
