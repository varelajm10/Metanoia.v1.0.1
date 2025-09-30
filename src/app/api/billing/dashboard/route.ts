import { NextRequest, NextResponse } from 'next/server'
import { BillingService } from '@/lib/services/billing'

// GET /api/billing/dashboard - Obtener estadísticas del dashboard de facturación
export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID requerido' },
        { status: 400 }
      )
    }

    const stats = await BillingService.getDashboardStats(tenantId)

    return NextResponse.json({
      stats,
    })
  } catch (error) {
    console.error('Error fetching billing dashboard:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
