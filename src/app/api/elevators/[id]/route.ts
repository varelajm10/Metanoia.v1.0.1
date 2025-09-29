import { NextRequest, NextResponse } from 'next/server'
import { ElevatorService } from '@/lib/services/elevator'
import { ElevatorSchema } from '@/lib/validations/elevator'

// GET /api/elevators/[id] - Obtener ascensor por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const elevator = await ElevatorService.getElevatorById(params.id, tenantId)

    if (!elevator) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ascensor no encontrado',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: elevator,
    })
  } catch (error) {
    console.error('Error fetching elevator:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener ascensor',
      },
      { status: 500 }
    )
  }
}

// PUT /api/elevators/[id] - Actualizar ascensor
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = ElevatorSchema.partial().parse(body)

    const elevator = await ElevatorService.updateElevator(
      params.id,
      validatedData,
      tenantId
    )

    return NextResponse.json({
      success: true,
      data: elevator,
    })
  } catch (error) {
    console.error('Error updating elevator:', error)

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
        error: 'Error al actualizar ascensor',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/elevators/[id] - Eliminar ascensor
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    await ElevatorService.deleteElevator(params.id, tenantId)

    return NextResponse.json({
      success: true,
      message: 'Ascensor eliminado correctamente',
    })
  } catch (error) {
    console.error('Error deleting elevator:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar ascensor',
      },
      { status: 500 }
    )
  }
}
