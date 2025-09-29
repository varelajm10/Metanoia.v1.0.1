import { NextRequest, NextResponse } from 'next/server'
import { ElevatorTechnicianService } from '@/lib/services/elevator-technician'
import { WorkOrderSchema } from '@/lib/validations/elevator'

// GET /api/elevators/work-orders - Obtener órdenes de trabajo
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined
    const orderType = searchParams.get('orderType') || undefined
    const priority = searchParams.get('priority') || undefined
    const technicianId = searchParams.get('technicianId') || undefined
    const elevatorId = searchParams.get('elevatorId') || undefined

    const result = await ElevatorTechnicianService.getWorkOrders(tenantId, {
      page,
      limit,
      search,
      status,
      orderType,
      priority,
      technicianId,
      elevatorId,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching work orders:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener órdenes de trabajo',
      },
      { status: 500 }
    )
  }
}

// POST /api/elevators/work-orders - Crear nueva orden de trabajo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = WorkOrderSchema.parse(body)

    const workOrder = await ElevatorTechnicianService.createWorkOrder(
      validatedData,
      tenantId
    )

    return NextResponse.json(
      {
        success: true,
        data: workOrder,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating work order:', error)

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
        error: 'Error al crear orden de trabajo',
      },
      { status: 500 }
    )
  }
}
