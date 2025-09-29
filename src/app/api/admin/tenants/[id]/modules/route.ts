import { NextRequest, NextResponse } from 'next/server'
import { TenantService } from '@/lib/services/tenant'
import { ToggleModuleSchema } from '@/lib/validations/tenant'

// POST /api/admin/tenants/[id]/modules - Activar/desactivar módulo
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = ToggleModuleSchema.parse(body)

    const tenant = await TenantService.toggleModule(params.id, validatedData)

    return NextResponse.json({
      success: true,
      data: tenant,
    })
  } catch (error) {
    console.error('Error toggling module:', error)
    return NextResponse.json(
      { success: false, error: 'Error al cambiar estado del módulo' },
      { status: 500 }
    )
  }
}

// GET /api/admin/tenants/[id]/modules - Obtener historial de módulos
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const history = await TenantService.getTenantModuleHistory(params.id)

    return NextResponse.json({
      success: true,
      data: history,
    })
  } catch (error) {
    console.error('Error fetching module history:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener historial de módulos' },
      { status: 500 }
    )
  }
}
