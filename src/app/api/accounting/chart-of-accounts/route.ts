import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { AccountingService } from '@/lib/services/accounting'
import {
  chartOfAccountsSchema,
  chartOfAccountsFiltersSchema,
} from '@/lib/validations/accounting'

const prisma = new PrismaClient()

// GET /api/accounting/chart-of-accounts - Obtener plan de cuentas
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
      type: searchParams.get('type') || '',
      isActive: searchParams.get('isActive')
        ? searchParams.get('isActive') === 'true'
        : undefined,
      parentId: searchParams.get('parentId') || '',
    }

    const validatedFilters = chartOfAccountsFiltersSchema.parse(filters)
    const result = await AccountingService.getChartOfAccounts(
      tenantId,
      validatedFilters,
      page,
      limit
    )

    return NextResponse.json({
      accounts: result.accounts,
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

    console.error('Error fetching chart of accounts:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/accounting/chart-of-accounts - Crear cuenta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID requerido' },
        { status: 400 }
      )
    }

    const validatedData = chartOfAccountsSchema.parse(body)
    const account = await AccountingService.createAccount(
      validatedData,
      tenantId
    )

    return NextResponse.json(account, { status: 201 })
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

    console.error('Error creating account:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
