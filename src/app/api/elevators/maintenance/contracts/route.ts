import { NextRequest, NextResponse } from 'next/server'
import { ElevatorMaintenanceService } from '@/lib/services/elevator-maintenance'
import { MaintenanceContractSchema } from '@/lib/validations/elevator'

// GET /api/elevators/maintenance/contracts - Obtener contratos de mantenimiento
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined
    const contractType = searchParams.get('contractType') || undefined
    const clientId = searchParams.get('clientId') || undefined

    const result = await ElevatorMaintenanceService.getMaintenanceContracts(
      tenantId,
      {
        page,
        limit,
        search,
        status,
        contractType,
        clientId,
      }
    )

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching maintenance contracts:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener contratos de mantenimiento',
      },
      { status: 500 }
    )
  }
}

// POST /api/elevators/maintenance/contracts - Crear nuevo contrato de mantenimiento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = MaintenanceContractSchema.parse(body)

    const contract = await ElevatorMaintenanceService.createMaintenanceContract(
      validatedData,
      tenantId
    )

    return NextResponse.json(
      {
        success: true,
        data: contract,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating maintenance contract:', error)

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
        error: 'Error al crear contrato de mantenimiento',
      },
      { status: 500 }
    )
  }
}
