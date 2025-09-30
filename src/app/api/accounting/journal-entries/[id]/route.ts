import { NextRequest, NextResponse } from 'next/server'
import { AccountingService } from '@/lib/services/accounting'

// GET /api/accounting/journal-entries/[id] - Obtener asiento contable por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID requerido' },
        { status: 400 }
      )
    }

    const entry = await AccountingService.getJournalEntryById(
      params.id,
      tenantId
    )

    if (!entry) {
      return NextResponse.json(
        { error: 'Asiento contable no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(entry)
  } catch (error) {
    console.error('Error fetching journal entry:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
