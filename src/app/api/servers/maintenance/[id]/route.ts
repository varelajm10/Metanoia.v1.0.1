import { NextRequest, NextResponse } from 'next/server'
import { ServerMaintenanceService } from '@/lib/services/server-maintenance'
import { UpdateMaintenanceWindowSchema } from '@/lib/validations/server-maintenance'

// GET /api/servers/maintenance/[id] - Obtener ventana de mantenimiento específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const maintenanceWindow =
      await ServerMaintenanceService.getMaintenanceWindowById(
        params.id,
        tenantId
      )

    if (!maintenanceWindow) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ventana de mantenimiento no encontrada',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: maintenanceWindow,
    })
  } catch (error) {
    console.error('Error fetching maintenance window:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener ventana de mantenimiento',
      },
      { status: 500 }
    )
  }
}

// PUT /api/servers/maintenance/[id] - Actualizar ventana de mantenimiento
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = UpdateMaintenanceWindowSchema.parse(body)

    // Si se están actualizando las fechas, verificar conflictos
    if (validatedData.startTime || validatedData.endTime) {
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

      const startTime = validatedData.startTime
        ? new Date(validatedData.startTime)
        : existingMaintenance.startTime
      const endTime = validatedData.endTime
        ? new Date(validatedData.endTime)
        : existingMaintenance.endTime

      const conflicts =
        await ServerMaintenanceService.checkConflictingMaintenances(
          existingMaintenance.serverId,
          startTime,
          endTime,
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
    }

    const maintenanceWindow =
      await ServerMaintenanceService.updateMaintenanceWindow(
        params.id,
        validatedData,
        tenantId
      )

    return NextResponse.json({
      success: true,
      data: maintenanceWindow,
    })
  } catch (error) {
    console.error('Error updating maintenance window:', error)

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
        error: 'Error al actualizar ventana de mantenimiento',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/servers/maintenance/[id] - Eliminar ventana de mantenimiento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    await ServerMaintenanceService.deleteMaintenanceWindow(params.id, tenantId)

    return NextResponse.json({
      success: true,
      message: 'Ventana de mantenimiento eliminada exitosamente',
    })
  } catch (error) {
    console.error('Error deleting maintenance window:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar ventana de mantenimiento',
      },
      { status: 500 }
    )
  }
}
