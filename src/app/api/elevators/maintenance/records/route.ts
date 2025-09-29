import { NextRequest, NextResponse } from 'next/server'
import { ElevatorMaintenanceService } from '@/lib/services/elevator-maintenance'
import { MaintenanceRecordSchema } from '@/lib/validations/elevator'

// GET /api/elevators/maintenance/records - Obtener registros de mantenimiento
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined
    const maintenanceType = searchParams.get('maintenanceType') || undefined
    const elevatorId = searchParams.get('elevatorId') || undefined
    const priority = searchParams.get('priority') || undefined

    const result = await ElevatorMaintenanceService.getMaintenanceRecords(
      tenantId,
      {
        page,
        limit,
        search,
        status,
        maintenanceType,
        elevatorId,
        priority,
      }
    )

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching maintenance records:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener registros de mantenimiento',
      },
      { status: 500 }
    )
  }
}

// POST /api/elevators/maintenance/records - Crear nuevo registro de mantenimiento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = MaintenanceRecordSchema.parse(body)

    const record = await ElevatorMaintenanceService.createMaintenanceRecord(
      validatedData,
      tenantId
    )

    return NextResponse.json(
      {
        success: true,
        data: record,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating maintenance record:', error)

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
        error: 'Error al crear registro de mantenimiento',
      },
      { status: 500 }
    )
  }
}
