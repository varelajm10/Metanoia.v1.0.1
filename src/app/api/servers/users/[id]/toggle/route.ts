import { NextRequest, NextResponse } from 'next/server'
import { ServerUserAccessService } from '@/lib/services/server-user'
import { z } from 'zod'

const ToggleStatusSchema = z.object({
  status: z.enum([
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED',
    'EXPIRED',
    'PENDING_APPROVAL',
  ]),
})

// POST /api/servers/users/[id]/toggle - Cambiar estado de usuario
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validation = ToggleStatusSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const { status } = validation.data

    // Cambiar estado del usuario
    const userAccess = await ServerUserAccessService.toggleUserStatus(
      params.id,
      tenantId,
      status
    )

    return NextResponse.json({
      success: true,
      data: userAccess,
      message: `Estado del usuario actualizado a ${status}`,
    })
  } catch (error) {
    console.error('Error toggling server user status:', error)

    if (error instanceof Error && error.message.includes('no encontrado')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Error de validación',
          message: error.message,
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
