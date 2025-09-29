import { NextRequest, NextResponse } from 'next/server'
import { ElevatorTechnicianService } from '@/lib/services/elevator-technician'
import { ElevatorTechnicianSchema } from '@/lib/validations/elevator'

// GET /api/elevators/technicians - Obtener técnicos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined
    const skillLevel = searchParams.get('skillLevel') || undefined
    const specialization = searchParams.get('specialization') || undefined
    const availability = searchParams.get('availability') || undefined

    const result = await ElevatorTechnicianService.getTechnicians(tenantId, {
      page,
      limit,
      search,
      status,
      skillLevel,
      specialization,
      availability,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching technicians:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener técnicos',
      },
      { status: 500 }
    )
  }
}

// POST /api/elevators/technicians - Crear nuevo técnico
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = ElevatorTechnicianSchema.parse(body)

    const technician = await ElevatorTechnicianService.createTechnician(
      validatedData,
      tenantId
    )

    return NextResponse.json(
      {
        success: true,
        data: technician,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating technician:', error)

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
        error: 'Error al crear técnico',
      },
      { status: 500 }
    )
  }
}
