import { NextRequest, NextResponse } from 'next/server'
import { ElevatorInstallationService } from '@/lib/services/elevator-installation'
import { InstallationSchema } from '@/lib/validations/elevator'

// GET /api/elevators/installations - Obtener instalaciones
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined
    const clientId = searchParams.get('clientId') || undefined

    const result = await ElevatorInstallationService.getInstallations(
      tenantId,
      {
        page,
        limit,
        search,
        status,
        clientId,
      }
    )

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching installations:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener instalaciones',
      },
      { status: 500 }
    )
  }
}

// POST /api/elevators/installations - Crear nueva instalación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = InstallationSchema.parse(body)

    const installation = await ElevatorInstallationService.createInstallation(
      validatedData,
      tenantId
    )

    return NextResponse.json(
      {
        success: true,
        data: installation,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating installation:', error)

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
        error: 'Error al crear instalación',
      },
      { status: 500 }
    )
  }
}
