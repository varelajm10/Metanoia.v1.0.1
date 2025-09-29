import { NextRequest, NextResponse } from 'next/server'
import { AccountingService } from '@/lib/services/accounting'
import { updateChartOfAccountsSchema } from '@/lib/validations/accounting'
import { z } from 'zod'

// GET /api/accounting/chart-of-accounts/[id] - Obtener cuenta por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID requerido' }, { status: 400 })
    }

    const account = await AccountingService.getAccountById(params.id, tenantId)

    if (!account) {
      return NextResponse.json(
        { error: 'Cuenta no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(account)
  } catch (error) {
    console.error('Error fetching account:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/accounting/chart-of-accounts/[id] - Actualizar cuenta
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID requerido' }, { status: 400 })
    }

    const validatedData = updateChartOfAccountsSchema.parse(body)
    const account = await AccountingService.updateAccount(params.id, validatedData, tenantId)

    return NextResponse.json(account)
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

    console.error('Error updating account:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/accounting/chart-of-accounts/[id] - Eliminar cuenta
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID requerido' }, { status: 400 })
    }

    await AccountingService.deleteAccount(params.id, tenantId)

    return NextResponse.json({ message: 'Cuenta eliminada exitosamente' })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
