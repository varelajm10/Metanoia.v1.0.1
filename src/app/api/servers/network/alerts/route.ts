import { NextRequest, NextResponse } from 'next/server'
import { ServerNetworkService } from '@/lib/services/server-network'
import { ConnectivityAlertSchema } from '@/lib/validations/server-network'

// GET /api/servers/network/alerts - Obtener alertas de conectividad
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'
    const serverId = searchParams.get('serverId')

    const alerts = await ServerNetworkService.getConnectivityAlerts(
      tenantId,
      serverId || undefined
    )

    return NextResponse.json({
      success: true,
      data: alerts,
    })
  } catch (error) {
    console.error('Error fetching connectivity alerts:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener alertas de conectividad',
      },
      { status: 500 }
    )
  }
}

// POST /api/servers/network/alerts - Crear nueva alerta de conectividad
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = ConnectivityAlertSchema.parse(body)

    const alert = await ServerNetworkService.createConnectivityAlert(
      validatedData,
      tenantId
    )

    return NextResponse.json(
      {
        success: true,
        data: alert,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating connectivity alert:', error)

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
        error: 'Error al crear alerta de conectividad',
      },
      { status: 500 }
    )
  }
}
