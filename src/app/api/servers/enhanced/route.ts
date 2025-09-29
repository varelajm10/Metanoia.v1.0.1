import { NextRequest, NextResponse } from 'next/server'
import { EnhancedServerService } from '@/lib/services/server-enhanced'
import {
  EnhancedServerSchema,
  ServerQuerySchema,
} from '@/lib/validations/server-enhanced'

// GET /api/servers/enhanced - Listar servidores con información geográfica
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const queryParams = Object.fromEntries(searchParams.entries())
    const validation = ServerQuerySchema.safeParse(queryParams)

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
    const result = await EnhancedServerService.getServers(tenantId, query)

    return NextResponse.json({
      success: true,
      data: result.servers,
      pagination: {
        page: result.page,
        total: result.total,
        totalPages: result.totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching enhanced servers:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener servidores',
      },
      { status: 500 }
    )
  }
}

// POST /api/servers/enhanced - Crear nuevo servidor con información geográfica
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = EnhancedServerSchema.parse(body)

    const server = await EnhancedServerService.createServer(
      validatedData,
      tenantId
    )

    return NextResponse.json(
      {
        success: true,
        data: server,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating enhanced server:', error)

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
        error: 'Error al crear servidor',
      },
      { status: 500 }
    )
  }
}
