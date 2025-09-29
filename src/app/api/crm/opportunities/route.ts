import { NextRequest, NextResponse } from 'next/server'
import { OpportunityService } from '@/lib/services/opportunity'
import { CreateOpportunitySchema } from '@/lib/validations/crm'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || undefined
    const stage = searchParams.get('stage') || undefined
    const assignedTo = searchParams.get('assignedTo') || undefined
    const leadId = searchParams.get('leadId') || undefined

    const result = await OpportunityService.getOpportunities(tenantId, {
      page,
      limit,
      search,
      stage,
      assignedTo,
      leadId,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching opportunities:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener oportunidades',
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
    const validatedData = CreateOpportunitySchema.parse(body)

    const opportunity = await OpportunityService.createOpportunity(
      validatedData,
      tenantId
    )

    return NextResponse.json(
      {
        success: true,
        data: opportunity,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating opportunity:', error)

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
        error: 'Error al crear oportunidad',
      },
      { status: 500 }
    )
  }
}
