import { NextRequest, NextResponse } from 'next/server'
import { TenantService } from '@/lib/services/tenant'
import { CreateTenantSchema } from '@/lib/validations/tenant'

// GET /api/admin/tenants - Listar todos los tenants
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || undefined
    const isActive =
      searchParams.get('isActive') === 'true'
        ? true
        : searchParams.get('isActive') === 'false'
          ? false
          : undefined
    const subscriptionPlan = searchParams.get('subscriptionPlan') || undefined

    const result = await TenantService.getTenants(page, limit, {
      search,
      isActive,
      subscriptionPlan,
    })

    return NextResponse.json({
      success: true,
      data: result.tenants,
      pagination: {
        page: result.page,
        total: result.total,
        totalPages: result.totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching tenants:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener tenants' },
      { status: 500 }
    )
  }
}

// POST /api/admin/tenants - Crear nuevo tenant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = CreateTenantSchema.parse(body)

    const tenant = await TenantService.createTenant(validatedData)

    return NextResponse.json(
      {
        success: true,
        data: tenant,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating tenant:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Error al crear tenant' },
      { status: 500 }
    )
  }
}
