import { NextRequest, NextResponse } from 'next/server'
import { ElevatorMaintenanceService } from '@/lib/services/elevator-maintenance'
import { MaintenanceRecordSchema } from '@/lib/validations/elevator'

// GET /api/elevators/maintenance/records/[id] - Obtener registro de mantenimiento por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const record = await ElevatorMaintenanceService.getMaintenanceRecordById(
      params.id,
      tenantId
    )

    if (!record) {
      return NextResponse.json(
        {
          success: false,
          error: 'Registro de mantenimiento no encontrado',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: record,
    })
  } catch (error) {
    console.error('Error fetching maintenance record:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener registro de mantenimiento',
      },
      { status: 500 }
    )
  }
}

// PUT /api/elevators/maintenance/records/[id] - Actualizar registro de mantenimiento
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = MaintenanceRecordSchema.partial().parse(body)

    const record = await ElevatorMaintenanceService.updateMaintenanceRecord(
      params.id,
      validatedData,
      tenantId
    )

    return NextResponse.json({
      success: true,
      data: record,
    })
  } catch (error) {
    console.error('Error updating maintenance record:', error)

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
        error: 'Error al actualizar registro de mantenimiento',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/elevators/maintenance/records/[id] - Eliminar registro de mantenimiento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    await ElevatorMaintenanceService.deleteMaintenanceRecord(
      params.id,
      tenantId
    )

    return NextResponse.json({
      success: true,
      message: 'Registro de mantenimiento eliminado correctamente',
    })
  } catch (error) {
    console.error('Error deleting maintenance record:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar registro de mantenimiento',
      },
      { status: 500 }
    )
  }
}
