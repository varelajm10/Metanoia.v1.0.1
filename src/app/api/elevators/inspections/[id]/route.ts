import { NextRequest, NextResponse } from 'next/server'
import { ElevatorInspectionService } from '@/lib/services/elevator-inspection'
import { InspectionSchema } from '@/lib/validations/elevator'

// GET /api/elevators/inspections/[id] - Obtener inspección por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const inspection = await ElevatorInspectionService.getInspectionById(
      params.id,
      tenantId
    )

    if (!inspection) {
      return NextResponse.json(
        {
          success: false,
          error: 'Inspección no encontrada',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: inspection,
    })
  } catch (error) {
    console.error('Error fetching inspection:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener inspección',
      },
      { status: 500 }
    )
  }
}

// PUT /api/elevators/inspections/[id] - Actualizar inspección
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = InspectionSchema.partial().parse(body)

    const inspection = await ElevatorInspectionService.updateInspection(
      params.id,
      validatedData,
      tenantId
    )

    return NextResponse.json({
      success: true,
      data: inspection,
    })
  } catch (error) {
    console.error('Error updating inspection:', error)

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
        error: 'Error al actualizar inspección',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/elevators/inspections/[id] - Eliminar inspección
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    await ElevatorInspectionService.deleteInspection(params.id, tenantId)

    return NextResponse.json({
      success: true,
      message: 'Inspección eliminada correctamente',
    })
  } catch (error) {
    console.error('Error deleting inspection:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar inspección',
      },
      { status: 500 }
    )
  }
}
