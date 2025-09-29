import { NextRequest, NextResponse } from 'next/server'
import { LeadService } from '@/lib/services/lead'
import { CreateLeadSchema } from '@/lib/validations/crm'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined
    const source = searchParams.get('source') || undefined
    const priority = searchParams.get('priority') || undefined
    const assignedTo = searchParams.get('assignedTo') || undefined

    const result = await LeadService.getLeads(tenantId, {
      page,
      limit,
      search,
      status,
      source,
      priority,
      assignedTo,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener leads',
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
    const validatedData = CreateLeadSchema.parse(body)

    const lead = await LeadService.createLead(validatedData, tenantId)

    return NextResponse.json(
      {
        success: true,
        data: lead,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating lead:', error)

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
        error: 'Error al crear lead',
      },
      { status: 500 }
    )
  }
}
