import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { getInvoiceStats } from '@/lib/services/invoice'

// GET /api/invoices/stats - Obtener estadísticas de facturas
export async function GET(request: NextRequest) {
  try {
    // Verificar permisos de lectura
    const { error, user } = await requirePermission(request, 'invoices', 'read')
    if (error) return error

    const tenantId = getTenantId(user!)

    // Obtener estadísticas de facturas
    const stats = await getInvoiceStats(tenantId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error en GET /api/invoices/stats:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
