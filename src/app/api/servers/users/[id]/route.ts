import { NextRequest, NextResponse } from 'next/server'
import { ServerUserAccessService } from '@/lib/services/server-user'
import { UpdateServerUserAccessSchema } from '@/lib/validations/server-user'
import { requireAuth } from '@/lib/middleware/auth'

// GET /api/servers/users/[id] - Obtener usuario específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // VERIFICACIÓN DE AUTENTICACIÓN
    const { error: authError, user } = await requireAuth(request)
    if (authError || !user) {
      return authError || new Response('No autorizado', { status: 401 })
    }
    // FIN DE VERIFICACIÓN DE AUTENTICACIÓN

    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const userAccess = await ServerUserAccessService.getUserAccessById(
      params.id,
      tenantId
    )

    if (!userAccess) {
      return NextResponse.json(
        {
          success: false,
          error: 'Usuario no encontrado',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: userAccess,
    })
  } catch (error) {
    console.error('Error fetching server user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener usuario',
      },
      { status: 500 }
    )
  }
}

// PUT /api/servers/users/[id] - Actualizar usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // VERIFICACIÓN DE AUTENTICACIÓN
    const { error: authError, user } = await requireAuth(request)
    if (authError || !user) {
      return authError || new Response('No autorizado', { status: 401 })
    }
    // FIN DE VERIFICACIÓN DE AUTENTICACIÓN

    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = UpdateServerUserAccessSchema.parse(body)

    const userAccess = await ServerUserAccessService.updateUserAccess(
      params.id,
      validatedData,
      tenantId
    )

    return NextResponse.json({
      success: true,
      data: userAccess,
    })
  } catch (error) {
    console.error('Error updating server user:', error)

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
        error: 'Error al actualizar usuario',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/servers/users/[id] - Eliminar usuario
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // VERIFICACIÓN DE AUTENTICACIÓN
    const { error: authError, user } = await requireAuth(request)
    if (authError || !user) {
      return authError || new Response('No autorizado', { status: 401 })
    }
    // FIN DE VERIFICACIÓN DE AUTENTICACIÓN

    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    await ServerUserAccessService.deleteUserAccess(params.id, tenantId)

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
    })
  } catch (error) {
    console.error('Error deleting server user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar usuario',
      },
      { status: 500 }
    )
  }
}
