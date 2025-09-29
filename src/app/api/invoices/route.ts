import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { getInvoices, createInvoice } from '@/lib/services/invoice'
import {
  InvoiceQuerySchema,
  CreateInvoiceSchema,
} from '@/lib/validations/invoice'

// GET /api/invoices - Listar facturas con filtros y paginación
export async function GET(request: NextRequest) {
  try {
    // Verificar permisos de lectura
    const { error, user } = await requirePermission(request, 'invoices', 'read')
    if (error) return error

    const tenantId = getTenantId(user!)

    // Obtener y validar parámetros de consulta
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    const validation = InvoiceQuerySchema.safeParse(queryParams)
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

    // Obtener facturas
    const result = await getInvoices(query, tenantId)

    return NextResponse.json({
      success: true,
      data: result.invoices,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error('Error en GET /api/invoices:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}

// POST /api/invoices - Crear nueva factura
export async function POST(request: NextRequest) {
  try {
    // Verificar permisos de escritura
    const { error, user } = await requirePermission(
      request,
      'invoices',
      'write'
    )
    if (error) return error

    const tenantId = getTenantId(user!)

    // Obtener y validar datos del cuerpo
    const body = await request.json()
    const validation = CreateInvoiceSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const invoiceData = validation.data

    // Crear factura
    const invoice = await createInvoice(invoiceData, tenantId)

    return NextResponse.json(
      {
        success: true,
        data: invoice,
        message: 'Factura creada exitosamente',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error en POST /api/invoices:', error)

    if (error instanceof Error) {
      if (
        error.message.includes('no encontrado') ||
        error.message.includes('inactivo')
      ) {
        return NextResponse.json(
          {
            error: 'Error de validación',
            message: error.message,
          },
          { status: 404 }
        )
      }

      if (error.message.includes('Ya existe')) {
        return NextResponse.json(
          {
            error: 'Error de validación',
            message: error.message,
          },
          { status: 409 }
        )
      }
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
