import { NextRequest, NextResponse } from 'next/server'
import { ElevatorService } from '@/lib/services/elevator'
import { ElevatorSchema } from '@/lib/validations/elevator'

// GET /api/elevators - Obtener ascensores
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined
    const clientId = searchParams.get('clientId') || undefined
    const brand = searchParams.get('brand') || undefined

    const result = await ElevatorService.getElevators(tenantId, {
      page,
      limit,
      search,
      status,
      clientId,
      brand,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching elevators:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener ascensores',
      },
      { status: 500 }
    )
  }
}

// POST /api/elevators - Crear nuevo ascensor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = ElevatorSchema.parse(body)

    const elevator = await ElevatorService.createElevator(
      validatedData,
      tenantId
    )

    return NextResponse.json(
      {
        success: true,
        data: elevator,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating elevator:', error)

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
        error: 'Error al crear ascensor',
      },
      { status: 500 }
    )
  }
}
