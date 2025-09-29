import { NextRequest, NextResponse } from 'next/server'
import { ElevatorClientService } from '@/lib/services/elevator-client'
import { ElevatorClientSchema } from '@/lib/validations/elevator'

// GET /api/elevators/clients - Obtener clientes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined
    const clientType = searchParams.get('clientType') || undefined

    const result = await ElevatorClientService.getClients(tenantId, {
      page,
      limit,
      search,
      status,
      clientType,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener clientes',
      },
      { status: 500 }
    )
  }
}

// POST /api/elevators/clients - Crear nuevo cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = ElevatorClientSchema.parse(body)

    const client = await ElevatorClientService.createClient(
      validatedData,
      tenantId
    )

    return NextResponse.json(
      {
        success: true,
        data: client,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating client:', error)

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
        error: 'Error al crear cliente',
      },
      { status: 500 }
    )
  }
}
