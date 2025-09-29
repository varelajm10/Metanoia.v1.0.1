import { NextRequest, NextResponse } from 'next/server'
import { ServerNetworkService } from '@/lib/services/server-network'

// POST /api/servers/network/connectivity/check - Verificar conectividad de un servidor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const { serverId } = body

    if (!serverId) {
      return NextResponse.json(
        {
          success: false,
          error: 'serverId es requerido',
        },
        { status: 400 }
      )
    }

    const result = await ServerNetworkService.checkConnectivity(
      serverId,
      tenantId
    )

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error checking connectivity:', error)

    if (error instanceof Error && error.message === 'Servidor no encontrado') {
      return NextResponse.json(
        {
          success: false,
          error: 'Servidor no encontrado',
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Error al verificar conectividad',
      },
      { status: 500 }
    )
  }
}
