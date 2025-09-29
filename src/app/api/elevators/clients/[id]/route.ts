import { NextRequest, NextResponse } from 'next/server'
import { ElevatorClientService } from '@/lib/services/elevator-client'
import { ElevatorClientSchema } from '@/lib/validations/elevator'

// GET /api/elevators/clients/[id] - Obtener cliente por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const client = await ElevatorClientService.getClientById(
      params.id,
      tenantId
    )

    if (!client) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cliente no encontrado',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: client,
    })
  } catch (error) {
    console.error('Error fetching client:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener cliente',
      },
      { status: 500 }
    )
  }
}

// PUT /api/elevators/clients/[id] - Actualizar cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = ElevatorClientSchema.partial().parse(body)

    const client = await ElevatorClientService.updateClient(
      params.id,
      validatedData,
      tenantId
    )

    return NextResponse.json({
      success: true,
      data: client,
    })
  } catch (error) {
    console.error('Error updating client:', error)

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
        error: 'Error al actualizar cliente',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/elevators/clients/[id] - Eliminar cliente
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    await ElevatorClientService.deleteClient(params.id, tenantId)

    return NextResponse.json({
      success: true,
      message: 'Cliente eliminado correctamente',
    })
  } catch (error) {
    console.error('Error deleting client:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar cliente',
      },
      { status: 500 }
    )
  }
}
