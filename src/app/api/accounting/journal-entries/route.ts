import { NextRequest, NextResponse } from 'next/server'
import { AccountingService } from '@/lib/services/accounting'
import { journalEntrySchema, journalEntryFiltersSchema } from '@/lib/validations/accounting'
import { z } from 'zod'

// GET /api/accounting/journal-entries - Obtener asientos contables
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
      isPosted: searchParams.get('isPosted') ? searchParams.get('isPosted') === 'true' : undefined,
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
      accountId: searchParams.get('accountId') || '',
    }

    const validatedFilters = journalEntryFiltersSchema.parse(filters)
    const result = await AccountingService.getJournalEntries(tenantId, validatedFilters, page, limit)

    return NextResponse.json({
      entries: result.entries,
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

    console.error('Error fetching journal entries:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/accounting/journal-entries - Crear asiento contable
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

    const validatedData = journalEntrySchema.parse(body)
    const entry = await AccountingService.createJournalEntry(validatedData, tenantId, userId)

    return NextResponse.json(entry, { status: 201 })
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

    console.error('Error creating journal entry:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
