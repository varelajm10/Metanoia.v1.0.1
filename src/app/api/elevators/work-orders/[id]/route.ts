import { NextRequest, NextResponse } from 'next/server'
import { ElevatorTechnicianService } from '@/lib/services/elevator-technician'
import { WorkOrderSchema } from '@/lib/validations/elevator'

// GET /api/elevators/work-orders/[id] - Obtener orden de trabajo por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const workOrder = await ElevatorTechnicianService.getWorkOrderById(
      params.id,
      tenantId
    )

    if (!workOrder) {
      return NextResponse.json(
        {
          success: false,
          error: 'Orden de trabajo no encontrada',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: workOrder,
    })
  } catch (error) {
    console.error('Error fetching work order:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener orden de trabajo',
      },
      { status: 500 }
    )
  }
}

// PUT /api/elevators/work-orders/[id] - Actualizar orden de trabajo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = WorkOrderSchema.partial().parse(body)

    const workOrder = await ElevatorTechnicianService.updateWorkOrder(
      params.id,
      validatedData,
      tenantId
    )

    return NextResponse.json({
      success: true,
      data: workOrder,
    })
  } catch (error) {
    console.error('Error updating work order:', error)

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
        error: 'Error al actualizar orden de trabajo',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/elevators/work-orders/[id] - Eliminar orden de trabajo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    await ElevatorTechnicianService.deleteWorkOrder(params.id, tenantId)

    return NextResponse.json({
      success: true,
      message: 'Orden de trabajo eliminada correctamente',
    })
  } catch (error) {
    console.error('Error deleting work order:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar orden de trabajo',
      },
      { status: 500 }
    )
  }
}
