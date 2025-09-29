import { NextRequest, NextResponse } from 'next/server'
import { LeadService } from '@/lib/services/lead'
import { UpdateLeadSchema } from '@/lib/validations/crm'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const lead = await LeadService.getLeadById(params.id, tenantId)

    if (!lead) {
      return NextResponse.json(
        {
          success: false,
          error: 'Lead no encontrado',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: lead,
    })
  } catch (error) {
    console.error('Error fetching lead:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener lead',
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = UpdateLeadSchema.parse(body)

    const lead = await LeadService.updateLead(
      params.id,
      validatedData,
      tenantId
    )

    return NextResponse.json({
      success: true,
      data: lead,
    })
  } catch (error) {
    console.error('Error updating lead:', error)

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
        error: 'Error al actualizar lead',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    await LeadService.deleteLead(params.id, tenantId)

    return NextResponse.json({
      success: true,
      message: 'Lead eliminado exitosamente',
    })
  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar lead',
      },
      { status: 500 }
    )
  }
}
