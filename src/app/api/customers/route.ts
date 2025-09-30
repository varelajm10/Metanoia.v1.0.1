import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { rateLimit } from '@/lib/middleware/rate-limit'
import { getCustomers, createCustomer } from '@/lib/services/customer'
import { CustomerCacheService } from '@/lib/services/customer-cache'
import {
  CustomerQuerySchema,
  CreateCustomerSchema,
} from '@/lib/validations/customer'

// GET /api/customers - Listar clientes con filtros y paginación
export async function GET(request: NextRequest) {
  try {
    // Rate limiting para prevenir abuso
    const rateLimitError = rateLimit(50, 15 * 60 * 1000)(request) // 50 requests por 15 min
    if (rateLimitError) return rateLimitError

    // Verificar permisos de lectura
    const { error, user } = await requirePermission(
      request,
      'customers',
      'read'
    )
    if (error) return error

    const tenantId = getTenantId(user!)

    // Obtener y validar parámetros de consulta
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    const validation = CustomerQuerySchema.safeParse(queryParams)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Parámetros de consulta inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const query = validation.data

    // Obtener clientes con caché
    const result = await CustomerCacheService.getCachedCustomers(query, tenantId)

    return NextResponse.json({
      success: true,
      data: result.customers,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error('Error en GET /api/customers:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}

// POST /api/customers - Crear nuevo cliente
export async function POST(request: NextRequest) {
  try {
    // Verificar permisos de escritura
    const { error, user } = await requirePermission(
      request,
      'customers',
      'write'
    )
    if (error) return error

    const tenantId = getTenantId(user!)

    // Obtener y validar datos del cuerpo
    const body = await request.json()
    const validation = CreateCustomerSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const customerData = validation.data

    // Crear cliente
    const customer = await createCustomer(customerData, tenantId)

    // Invalidar caché después de crear
    await CustomerCacheService.onCustomerCreated(tenantId)

    return NextResponse.json(
      {
        success: true,
        data: customer,
        message: 'Cliente creado exitosamente',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error en POST /api/customers:', error)

    if (error instanceof Error && error.message.includes('Ya existe')) {
      return NextResponse.json(
        {
          error: 'Error de validación',
          message: error.message,
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
