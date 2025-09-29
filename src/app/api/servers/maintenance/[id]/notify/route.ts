import { NextRequest, NextResponse } from 'next/server'
import { ServerMaintenanceService } from '@/lib/services/server-maintenance'

// POST /api/servers/maintenance/[id]/notify - Enviar notificaciones de mantenimiento
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const notifications =
      await ServerMaintenanceService.sendMaintenanceNotifications(
        params.id,
        tenantId
      )

    return NextResponse.json({
      success: true,
      data: notifications,
      message: 'Notificaciones enviadas exitosamente',
    })
  } catch (error) {
    console.error('Error sending maintenance notifications:', error)

    if (
      error instanceof Error &&
      error.message === 'Maintenance window not found'
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ventana de mantenimiento no encontrada',
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Error al enviar notificaciones de mantenimiento',
      },
      { status: 500 }
    )
  }
}
