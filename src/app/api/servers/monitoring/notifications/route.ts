import { NextRequest, NextResponse } from 'next/server'
import { ServerMonitoringService } from '@/lib/services/server-monitoring'
import {
  NotificationSchema,
  NotificationQuerySchema,
} from '@/lib/validations/server-monitoring'

// GET /api/servers/monitoring/notifications - Obtener notificaciones
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const queryParams = Object.fromEntries(searchParams.entries())
    const validation = NotificationQuerySchema.safeParse(queryParams)

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
    const result = await ServerMonitoringService.getNotifications(
      tenantId,
      query
    )

    return NextResponse.json({
      success: true,
      data: result.notifications,
      pagination: {
        page: result.page,
        total: result.total,
        totalPages: result.totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener notificaciones',
      },
      { status: 500 }
    )
  }
}

// POST /api/servers/monitoring/notifications - Crear nueva notificación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = NotificationSchema.parse(body)

    const notification = await ServerMonitoringService.createNotification(
      validatedData,
      tenantId
    )

    return NextResponse.json(
      {
        success: true,
        data: notification,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating notification:', error)

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
        error: 'Error al crear notificación',
      },
      { status: 500 }
    )
  }
}
