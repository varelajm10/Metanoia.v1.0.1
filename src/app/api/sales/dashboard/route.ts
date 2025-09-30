import { NextRequest, NextResponse } from 'next/server'
import { SalesService } from '@/lib/services/sales'

// GET /api/sales/dashboard - Obtener estadísticas del dashboard de ventas
export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID requerido' },
        { status: 400 }
      )
    }

    const stats = await SalesService.getDashboardStats(tenantId)

    return NextResponse.json({
      stats,
    })
  } catch (error) {
    console.error('Error fetching sales dashboard:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
