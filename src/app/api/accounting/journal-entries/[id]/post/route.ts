import { NextRequest, NextResponse } from 'next/server'
import { AccountingService } from '@/lib/services/accounting'

// POST /api/accounting/journal-entries/[id]/post - Contabilizar asiento
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID requerido' }, { status: 400 })
    }

    const entry = await AccountingService.postJournalEntry(params.id, tenantId)

    return NextResponse.json(entry)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    console.error('Error posting journal entry:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
