import { NextRequest, NextResponse } from 'next/server'
import { TenantService } from '@/lib/services/tenant'

// GET /api/admin/tenants/[id]/stats - Obtener estadísticas del tenant
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stats = await TenantService.getTenantStats(params.id)

    if (!stats) {
      return NextResponse.json(
        { success: false, error: 'Tenant no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching tenant stats:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener estadísticas del tenant' },
      { status: 500 }
    )
  }
}
