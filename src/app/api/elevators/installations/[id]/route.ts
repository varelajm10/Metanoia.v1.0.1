import { NextRequest, NextResponse } from 'next/server'
import { ElevatorInstallationService } from '@/lib/services/elevator-installation'
import { InstallationSchema } from '@/lib/validations/elevator'

// GET /api/elevators/installations/[id] - Obtener instalación por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const installation = await ElevatorInstallationService.getInstallationById(
      params.id,
      tenantId
    )

    if (!installation) {
      return NextResponse.json(
        {
          success: false,
          error: 'Instalación no encontrada',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: installation,
    })
  } catch (error) {
    console.error('Error fetching installation:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener instalación',
      },
      { status: 500 }
    )
  }
}

// PUT /api/elevators/installations/[id] - Actualizar instalación
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = InstallationSchema.partial().parse(body)

    const installation = await ElevatorInstallationService.updateInstallation(
      params.id,
      validatedData,
      tenantId
    )

    return NextResponse.json({
      success: true,
      data: installation,
    })
  } catch (error) {
    console.error('Error updating installation:', error)

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
        error: 'Error al actualizar instalación',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/elevators/installations/[id] - Eliminar instalación
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    await ElevatorInstallationService.deleteInstallation(params.id, tenantId)

    return NextResponse.json({
      success: true,
      message: 'Instalación eliminada correctamente',
    })
  } catch (error) {
    console.error('Error deleting installation:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar instalación',
      },
      { status: 500 }
    )
  }
}
