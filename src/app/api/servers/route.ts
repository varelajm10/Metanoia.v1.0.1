import { NextRequest, NextResponse } from 'next/server'
import { ServerService } from '@/lib/services/server'
import { ServerSchema } from '@/lib/validations/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined
    const clientId = searchParams.get('clientId') || undefined

    const result = await ServerService.getServers(tenantId, {
      page,
      limit,
      search,
      status,
      clientId,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching servers:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener servidores',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = ServerSchema.parse(body)

    const server = await ServerService.createServer(validatedData, tenantId)

    return NextResponse.json(
      {
        success: true,
        data: server,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating server:', error)

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
