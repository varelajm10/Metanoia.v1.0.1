import { NextRequest, NextResponse } from 'next/server'
import { AccountingService } from '@/lib/services/accounting'

// GET /api/accounting/dashboard - Obtener estadísticas del dashboard de contabilidad
export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID requerido' }, { status: 400 })
    }

    const stats = await AccountingService.getDashboardStats(tenantId)

    return NextResponse.json({
      stats,
    })
  } catch (error) {
    console.error('Error fetching accounting dashboard:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
