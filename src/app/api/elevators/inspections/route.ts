import { NextRequest, NextResponse } from 'next/server'
import { ElevatorInspectionService } from '@/lib/services/elevator-inspection'
import { InspectionSchema } from '@/lib/validations/elevator'

// GET /api/elevators/inspections - Obtener inspecciones
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined
    const inspectionType = searchParams.get('inspectionType') || undefined
    const elevatorId = searchParams.get('elevatorId') || undefined
    const result = searchParams.get('result') || undefined

    const result_data = await ElevatorInspectionService.getInspections(
      tenantId,
      {
        page,
        limit,
        search,
        status,
        inspectionType,
        elevatorId,
        result,
      }
    )

    return NextResponse.json({
      success: true,
      data: result_data,
    })
  } catch (error) {
    console.error('Error fetching inspections:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener inspecciones',
      },
      { status: 500 }
    )
  }
}

// POST /api/elevators/inspections - Crear nueva inspección
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = InspectionSchema.parse(body)

    const inspection = await ElevatorInspectionService.createInspection(
      validatedData,
      tenantId
    )

    return NextResponse.json(
      {
        success: true,
        data: inspection,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating inspection:', error)

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
        error: 'Error al crear inspección',
      },
      { status: 500 }
    )
  }
}
