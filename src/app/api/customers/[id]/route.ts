import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import {
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from '@/lib/services/customer'
import { UpdateCustomerSchema } from '@/lib/validations/customer'

// GET /api/customers/[id] - Obtener cliente por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar permisos de lectura
    const { error, user } = await requirePermission(
      request,
      'customers',
      'read'
    )
    if (error) return error

    const tenantId = getTenantId(user!)

    // Obtener cliente
    const customer = await getCustomerById(params.id, tenantId)

    if (!customer) {
      return NextResponse.json(
        {
          error: 'Cliente no encontrado',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: customer,
    })
  } catch (error) {
    console.error('Error en GET /api/customers/[id]:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}

// PUT /api/customers/[id] - Actualizar cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validation = UpdateCustomerSchema.safeParse(body)

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

    // Actualizar cliente
    const customer = await updateCustomer(params.id, customerData, tenantId)

    return NextResponse.json({
      success: true,
      data: customer,
      message: 'Cliente actualizado exitosamente',
    })
  } catch (error) {
    console.error('Error en PUT /api/customers/[id]:', error)

    if (error instanceof Error && error.message.includes('Ya existe')) {
      return NextResponse.json(
        {
          error: 'Error de validación',
          message: error.message,
        },
        { status: 409 }
      )
    }

    if (error instanceof Error && error.message.includes('no encontrado')) {
      return NextResponse.json(
        {
          error: 'Error de validación',
          message: error.message,
        },
        { status: 404 }
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

// DELETE /api/customers/[id] - Eliminar cliente
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar permisos de eliminación
    const { error, user } = await requirePermission(
      request,
      'customers',
      'delete'
    )
    if (error) return error

    const tenantId = getTenantId(user!)

    // Eliminar cliente
    await deleteCustomer(params.id, tenantId)

    return NextResponse.json({
      success: true,
      message: 'Cliente eliminado exitosamente',
    })
  } catch (error) {
    console.error('Error en DELETE /api/customers/[id]:', error)

    if (error instanceof Error && error.message.includes('no encontrado')) {
      return NextResponse.json(
        {
          error: 'Error de validación',
          message: error.message,
        },
        { status: 404 }
      )
    }

    if (
      error instanceof Error &&
      error.message.includes('órdenes o facturas')
    ) {
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
