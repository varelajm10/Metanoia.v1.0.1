import { NextRequest, NextResponse } from 'next/server'
import { ServerNetworkService } from '@/lib/services/server-network'
import { NetworkConfigSchema } from '@/lib/validations/server-network'

// GET /api/servers/network/config - Obtener configuraciones de red
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'
    const serverId = searchParams.get('serverId')

    const configs = await ServerNetworkService.getNetworkConfigs(
      tenantId,
      serverId || undefined
    )

    return NextResponse.json({
      success: true,
      data: configs,
    })
  } catch (error) {
    console.error('Error fetching network configs:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener configuraciones de red',
      },
      { status: 500 }
    )
  }
}

// POST /api/servers/network/config - Crear nueva configuración de red
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = NetworkConfigSchema.parse(body)

    const config = await ServerNetworkService.createNetworkConfig(
      validatedData,
      tenantId
    )

    return NextResponse.json(
      {
        success: true,
        data: config,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating network config:', error)

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
        error: 'Error al crear configuración de red',
      },
      { status: 500 }
    )
  }
}
