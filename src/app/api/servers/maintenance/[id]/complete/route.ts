import { NextRequest, NextResponse } from 'next/server'
import { ServerMaintenanceService } from '@/lib/services/server-maintenance'
import { CompleteMaintenanceSchema } from '@/lib/validations/server-maintenance'

// POST /api/servers/maintenance/[id]/complete - Completar ventana de mantenimiento
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = CompleteMaintenanceSchema.parse(body)

    const maintenanceWindow =
      await ServerMaintenanceService.completeMaintenanceWindow(
        params.id,
        validatedData,
        tenantId
      )

    return NextResponse.json({
      success: true,
      data: maintenanceWindow,
      message: 'Ventana de mantenimiento completada exitosamente',
    })
  } catch (error) {
    console.error('Error completing maintenance window:', error)

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
        error: 'Error al completar ventana de mantenimiento',
      },
      { status: 500 }
    )
  }
}
