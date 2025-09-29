import { NextRequest, NextResponse } from 'next/server'
import { ElevatorTechnicianService } from '@/lib/services/elevator-technician'
import { ElevatorSparePartSchema } from '@/lib/validations/elevator'

// GET /api/elevators/spare-parts - Obtener repuestos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || undefined
    const category = searchParams.get('category') || undefined
    const manufacturer = searchParams.get('manufacturer') || undefined
    const stockStatus = searchParams.get('stockStatus') || undefined

    const result = await ElevatorTechnicianService.getSpareParts(tenantId, {
      page,
      limit,
      search,
      category,
      manufacturer,
      stockStatus,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching spare parts:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener repuestos',
      },
      { status: 500 }
    )
  }
}

// POST /api/elevators/spare-parts - Crear nuevo repuesto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = ElevatorSparePartSchema.parse(body)

    const sparePart = await ElevatorTechnicianService.createSparePart(
      validatedData,
      tenantId
    )

    return NextResponse.json(
      {
        success: true,
        data: sparePart,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating spare part:', error)

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
        error: 'Error al crear repuesto',
      },
      { status: 500 }
    )
  }
}
