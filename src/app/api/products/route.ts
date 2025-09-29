import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { getProducts, createProduct } from '@/lib/services/product'
import {
  ProductQuerySchema,
  CreateProductSchema,
} from '@/lib/validations/product'

// GET /api/products - Listar productos con filtros y paginación
export async function GET(request: NextRequest) {
  try {
    // Verificar permisos de lectura
    const { error, user } = await requirePermission(request, 'products', 'read')
    if (error) return error

    const tenantId = getTenantId(user!)

    // Obtener y validar parámetros de consulta
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    const validation = ProductQuerySchema.safeParse(queryParams)
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

    // Obtener productos
    const result = await getProducts(query, tenantId)

    return NextResponse.json({
      success: true,
      data: result.products,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error('Error en GET /api/products:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}

// POST /api/products - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    // Verificar permisos de escritura
    const { error, user } = await requirePermission(
      request,
      'products',
      'write'
    )
    if (error) return error

    const tenantId = getTenantId(user!)

    // Obtener y validar datos del cuerpo
    const body = await request.json()
    const validation = CreateProductSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const productData = validation.data

    // Crear producto
    const product = await createProduct(productData, tenantId)

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: 'Producto creado exitosamente',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error en POST /api/products:', error)

    if (error instanceof Error && error.message.includes('Ya existe')) {
      return NextResponse.json(
        {
          error: 'Error de validación',
          message: error.message,
        },
        { status: 409 }
      )
    }

    if (error instanceof Error && error.message.includes('stock máximo')) {
      return NextResponse.json(
        {
          error: 'Error de validación',
          message: error.message,
        },
        { status: 400 }
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
