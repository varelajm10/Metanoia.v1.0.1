import { NextRequest, NextResponse } from 'next/server'
import { ServerMaintenanceService } from '@/lib/services/server-maintenance'
import { RescheduleMaintenanceSchema } from '@/lib/validations/server-maintenance'

// POST /api/servers/maintenance/[id]/reschedule - Reprogramar ventana de mantenimiento
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = RescheduleMaintenanceSchema.parse(body)

    // Verificar conflictos con las nuevas fechas
    const existingMaintenance =
      await ServerMaintenanceService.getMaintenanceWindowById(
        params.id,
        tenantId
      )
    if (!existingMaintenance) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ventana de mantenimiento no encontrada',
        },
        { status: 404 }
      )
    }

    const conflicts =
      await ServerMaintenanceService.checkConflictingMaintenances(
        existingMaintenance.serverId,
        new Date(validatedData.newStartTime),
        new Date(validatedData.newEndTime),
        params.id
      )

    if (conflicts.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Conflicto de horarios detectado',
          details: `Ya existe un mantenimiento programado para este servidor en el rango de fechas seleccionado.`,
          conflicts: conflicts.map(c => ({
            id: c.id,
            title: c.title,
            startTime: c.startTime,
            endTime: c.endTime,
          })),
        },
        { status: 409 }
      )
    }

    const maintenanceWindow =
      await ServerMaintenanceService.rescheduleMaintenanceWindow(
        params.id,
        validatedData,
        tenantId
      )

    return NextResponse.json({
      success: true,
      data: maintenanceWindow,
      message: 'Ventana de mantenimiento reprogramada exitosamente',
    })
  } catch (error) {
    console.error('Error rescheduling maintenance window:', error)

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
        error: 'Error al reprogramar ventana de mantenimiento',
      },
      { status: 500 }
    )
  }
}
