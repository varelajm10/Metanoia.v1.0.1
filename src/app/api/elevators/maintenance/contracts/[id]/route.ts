import { NextRequest, NextResponse } from 'next/server'
import { ElevatorMaintenanceService } from '@/lib/services/elevator-maintenance'
import { MaintenanceContractSchema } from '@/lib/validations/elevator'

// GET /api/elevators/maintenance/contracts/[id] - Obtener contrato de mantenimiento por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const contract =
      await ElevatorMaintenanceService.getMaintenanceContractById(
        params.id,
        tenantId
      )

    if (!contract) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contrato de mantenimiento no encontrado',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: contract,
    })
  } catch (error) {
    console.error('Error fetching maintenance contract:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener contrato de mantenimiento',
      },
      { status: 500 }
    )
  }
}

// PUT /api/elevators/maintenance/contracts/[id] - Actualizar contrato de mantenimiento
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = MaintenanceContractSchema.partial().parse(body)

    const contract = await ElevatorMaintenanceService.updateMaintenanceContract(
      params.id,
      validatedData,
      tenantId
    )

    return NextResponse.json({
      success: true,
      data: contract,
    })
  } catch (error) {
    console.error('Error updating maintenance contract:', error)

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
        error: 'Error al actualizar contrato de mantenimiento',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/elevators/maintenance/contracts/[id] - Eliminar contrato de mantenimiento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    await ElevatorMaintenanceService.deleteMaintenanceContract(
      params.id,
      tenantId
    )

    return NextResponse.json({
      success: true,
      message: 'Contrato de mantenimiento eliminado correctamente',
    })
  } catch (error) {
    console.error('Error deleting maintenance contract:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar contrato de mantenimiento',
      },
      { status: 500 }
    )
  }
}
