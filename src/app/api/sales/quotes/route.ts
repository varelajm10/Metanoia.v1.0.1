import { NextRequest, NextResponse } from 'next/server'
import { SalesService } from '@/lib/services/sales'
import { quoteSchema, quoteFiltersSchema } from '@/lib/validations/sales'
import { z } from 'zod'

// GET /api/sales/quotes - Obtener cotizaciones
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID requerido' }, { status: 400 })
    }

    const filters = {
      search: searchParams.get('search') || '',
      status: searchParams.get('status') || '',
      customerId: searchParams.get('customerId') || '',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
    }

    const validatedFilters = quoteFiltersSchema.parse(filters)
    const result = await SalesService.getQuotes(tenantId, validatedFilters, page, limit)

    return NextResponse.json({
      quotes: result.quotes,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: result.pages,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Parámetros inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/sales/quotes - Crear cotización
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const tenantId = request.headers.get('x-tenant-id')
    const userId = request.headers.get('x-user-id')

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID requerido' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID requerido' }, { status: 400 })
    }

    const validatedData = quoteSchema.parse(body)
    const quote = await SalesService.createQuote(validatedData, tenantId, userId)

    return NextResponse.json(quote, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    console.error('Error creating quote:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
