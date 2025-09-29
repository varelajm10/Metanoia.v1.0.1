import { NextRequest, NextResponse } from 'next/server'
import { ServerMaintenanceService } from '@/lib/services/server-maintenance'
import {
  MaintenanceWindowSchema,
  MaintenanceQuerySchema,
} from '@/lib/validations/server-maintenance'

// GET /api/servers/maintenance - Obtener ventanas de mantenimiento
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const queryParams = Object.fromEntries(searchParams.entries())
    const validation = MaintenanceQuerySchema.safeParse(queryParams)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parámetros de consulta inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const query = validation.data
    const result = await ServerMaintenanceService.getMaintenanceWindows(
      tenantId,
      query
    )

    return NextResponse.json({
      success: true,
      data: result.maintenances,
      pagination: {
        page: result.page,
        total: result.total,
        totalPages: result.totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching maintenance windows:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener ventanas de mantenimiento',
      },
      { status: 500 }
    )
  }
}

// POST /api/servers/maintenance - Crear nueva ventana de mantenimiento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = MaintenanceWindowSchema.parse(body)

    // Verificar conflictos de horarios
    const conflicts =
      await ServerMaintenanceService.checkConflictingMaintenances(
        validatedData.serverId,
        new Date(validatedData.startTime),
        new Date(validatedData.endTime)
      )

    if (conflicts.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Conflicto de horarios detectado',
          details: `Ya existe un mantenimiento programado para este servidor en el rango de fechas seleccionado. Conflicto con: ${conflicts[0].title}`,
          conflicts: conflicts.map(c => ({
            id: c.id,
            title: c.title,
            startTime: c.startTime,
            endTime: c.endTime,
          })),
        },
        { status: 409 }
      )
    }

    const maintenanceWindow =
      await ServerMaintenanceService.createMaintenanceWindow(
        validatedData,
        tenantId
      )

    return NextResponse.json(
      {
        success: true,
        data: maintenanceWindow,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating maintenance window:', error)

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
        error: 'Error al crear ventana de mantenimiento',
      },
      { status: 500 }
    )
  }
}
