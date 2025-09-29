import { NextRequest, NextResponse } from 'next/server'
import { ServerUserAccessService } from '@/lib/services/server-user'
import {
  ServerUserAccessSchema,
  ServerUserQuerySchema,
} from '@/lib/validations/server-user'

// GET /api/servers/users - Listar usuarios de servidores
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const queryParams = Object.fromEntries(searchParams.entries())
    const validation = ServerUserQuerySchema.safeParse(queryParams)

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
    const result = await ServerUserAccessService.getUserAccesses(
      tenantId,
      query
    )

    return NextResponse.json({
      success: true,
      data: result.userAccesses,
      pagination: {
        page: result.page,
        total: result.total,
        totalPages: result.totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching server users:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener usuarios de servidores',
      },
      { status: 500 }
    )
  }
}

// POST /api/servers/users - Crear nuevo acceso de usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = ServerUserAccessSchema.parse(body)

    const userAccess = await ServerUserAccessService.createUserAccess(
      validatedData,
      tenantId
    )

    return NextResponse.json(
      {
        success: true,
        data: userAccess,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating server user access:', error)

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
        error: 'Error al crear acceso de usuario',
      },
      { status: 500 }
    )
  }
}
