import { NextRequest, NextResponse } from 'next/server'
import { TenantService } from '@/lib/services/tenant'
import { UpdateTenantSchema } from '@/lib/validations/tenant'

// GET /api/admin/tenants/[id] - Obtener tenant específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenant = await TenantService.getTenantById(params.id)

    if (!tenant) {
      return NextResponse.json(
        { success: false, error: 'Tenant no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: tenant,
    })
  } catch (error) {
    console.error('Error fetching tenant:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener tenant' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/tenants/[id] - Actualizar tenant
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = UpdateTenantSchema.parse(body)

    const tenant = await TenantService.updateTenant(params.id, validatedData)

    return NextResponse.json({
      success: true,
      data: tenant,
    })
  } catch (error) {
    console.error('Error updating tenant:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar tenant' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/tenants/[id] - Eliminar tenant
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await TenantService.deleteTenant(params.id)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error deleting tenant:', error)
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Error al eliminar tenant',
      },
      { status: 500 }
    )
  }
}
