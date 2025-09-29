import { NextRequest, NextResponse } from 'next/server'
import { ElevatorTechnicianService } from '@/lib/services/elevator-technician'
import { ElevatorTechnicianSchema } from '@/lib/validations/elevator'

// GET /api/elevators/technicians/[id] - Obtener técnico por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const technician = await ElevatorTechnicianService.getTechnicianById(
      params.id,
      tenantId
    )

    if (!technician) {
      return NextResponse.json(
        {
          success: false,
          error: 'Técnico no encontrado',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: technician,
    })
  } catch (error) {
    console.error('Error fetching technician:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener técnico',
      },
      { status: 500 }
    )
  }
}

// PUT /api/elevators/technicians/[id] - Actualizar técnico
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = ElevatorTechnicianSchema.partial().parse(body)

    const technician = await ElevatorTechnicianService.updateTechnician(
      params.id,
      validatedData,
      tenantId
    )

    return NextResponse.json({
      success: true,
      data: technician,
    })
  } catch (error) {
    console.error('Error updating technician:', error)

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
        error: 'Error al actualizar técnico',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/elevators/technicians/[id] - Eliminar técnico
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    await ElevatorTechnicianService.deleteTechnician(params.id, tenantId)

    return NextResponse.json({
      success: true,
      message: 'Técnico eliminado correctamente',
    })
  } catch (error) {
    console.error('Error deleting technician:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar técnico',
      },
      { status: 500 }
    )
  }
}
