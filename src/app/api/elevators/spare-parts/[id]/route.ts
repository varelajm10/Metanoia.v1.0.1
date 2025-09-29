import { NextRequest, NextResponse } from 'next/server'
import { ElevatorTechnicianService } from '@/lib/services/elevator-technician'
import { ElevatorSparePartSchema } from '@/lib/validations/elevator'

// GET /api/elevators/spare-parts/[id] - Obtener repuesto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const sparePart = await ElevatorTechnicianService.getSparePartById(
      params.id,
      tenantId
    )

    if (!sparePart) {
      return NextResponse.json(
        {
          success: false,
          error: 'Repuesto no encontrado',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: sparePart,
    })
  } catch (error) {
    console.error('Error fetching spare part:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener repuesto',
      },
      { status: 500 }
    )
  }
}

// PUT /api/elevators/spare-parts/[id] - Actualizar repuesto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = ElevatorSparePartSchema.partial().parse(body)

    const sparePart = await ElevatorTechnicianService.updateSparePart(
      params.id,
      validatedData,
      tenantId
    )

    return NextResponse.json({
      success: true,
      data: sparePart,
    })
  } catch (error) {
    console.error('Error updating spare part:', error)

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
        error: 'Error al actualizar repuesto',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/elevators/spare-parts/[id] - Eliminar repuesto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    await ElevatorTechnicianService.deleteSparePart(params.id, tenantId)

    return NextResponse.json({
      success: true,
      message: 'Repuesto eliminado correctamente',
    })
  } catch (error) {
    console.error('Error deleting spare part:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar repuesto',
      },
      { status: 500 }
    )
  }
}
