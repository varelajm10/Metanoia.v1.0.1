import { NextRequest, NextResponse } from 'next/server'
import { ServerNetworkService } from '@/lib/services/server-network'
import { UpdateNetworkConfigSchema } from '@/lib/validations/server-network'

// GET /api/servers/network/config/[id] - Obtener configuración de red específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const config = await ServerNetworkService.getNetworkConfigById(
      params.id,
      tenantId
    )

    if (!config) {
      return NextResponse.json(
        {
          success: false,
          error: 'Configuración de red no encontrada',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: config,
    })
  } catch (error) {
    console.error('Error fetching network config:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener configuración de red',
      },
      { status: 500 }
    )
  }
}

// PUT /api/servers/network/config/[id] - Actualizar configuración de red
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = UpdateNetworkConfigSchema.parse(body)

    const config = await ServerNetworkService.updateNetworkConfig(
      params.id,
      validatedData,
      tenantId
    )

    return NextResponse.json({
      success: true,
      data: config,
    })
  } catch (error) {
    console.error('Error updating network config:', error)

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
        error: 'Error al actualizar configuración de red',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/servers/network/config/[id] - Eliminar configuración de red
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    await ServerNetworkService.deleteNetworkConfig(params.id, tenantId)

    return NextResponse.json({
      success: true,
      message: 'Configuración de red eliminada exitosamente',
    })
  } catch (error) {
    console.error('Error deleting network config:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar configuración de red',
      },
      { status: 500 }
    )
  }
}
