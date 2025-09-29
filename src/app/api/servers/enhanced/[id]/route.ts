import { NextRequest, NextResponse } from 'next/server'
import { EnhancedServerService } from '@/lib/services/server-enhanced'
import { UpdateEnhancedServerSchema } from '@/lib/validations/server-enhanced'

// GET /api/servers/enhanced/[id] - Obtener servidor específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const server = await EnhancedServerService.getServerById(
      params.id,
      tenantId
    )

    if (!server) {
      return NextResponse.json(
        {
          success: false,
          error: 'Servidor no encontrado',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: server,
    })
  } catch (error) {
    console.error('Error fetching enhanced server:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener servidor',
      },
      { status: 500 }
    )
  }
}

// PUT /api/servers/enhanced/[id] - Actualizar servidor
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = UpdateEnhancedServerSchema.parse(body)

    const server = await EnhancedServerService.updateServer(
      params.id,
      validatedData,
      tenantId
    )

    return NextResponse.json({
      success: true,
      data: server,
    })
  } catch (error) {
    console.error('Error updating enhanced server:', error)

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
        error: 'Error al actualizar servidor',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/servers/enhanced/[id] - Eliminar servidor
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    await EnhancedServerService.deleteServer(params.id, tenantId)

    return NextResponse.json({
      success: true,
      message: 'Servidor eliminado exitosamente',
    })
  } catch (error) {
    console.error('Error deleting enhanced server:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar servidor',
      },
      { status: 500 }
    )
  }
}
