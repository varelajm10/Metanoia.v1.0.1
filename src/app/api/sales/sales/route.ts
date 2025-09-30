import { NextRequest, NextResponse } from 'next/server'
import { SalesService } from '@/lib/services/sales'
import { saleSchema, saleFiltersSchema } from '@/lib/validations/sales'
import { z } from 'zod'

// GET /api/sales/sales - Obtener ventas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID requerido' },
        { status: 400 }
      )
    }

    const filters = {
      search: searchParams.get('search') || '',
      customerId: searchParams.get('customerId') || '',
      salespersonId: searchParams.get('salespersonId') || '',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
    }

    const validatedFilters = saleFiltersSchema.parse(filters)
    const result = await SalesService.getSales(
      tenantId,
      validatedFilters,
      page,
      limit
    )

    return NextResponse.json({
      sales: result.sales,
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

    console.error('Error fetching sales:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/sales/sales - Crear venta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const tenantId = request.headers.get('x-tenant-id')
    const userId = request.headers.get('x-user-id')

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID requerido' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID requerido' }, { status: 400 })
    }

    const validatedData = saleSchema.parse(body)
    const sale = await SalesService.createSale(validatedData, tenantId, userId)

    return NextResponse.json(sale, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.error('Error creating sale:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
