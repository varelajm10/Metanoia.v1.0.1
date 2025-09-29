import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { getOverdueInvoices } from '@/lib/services/invoice'
import { z } from 'zod'

const OverdueQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50),
})

// GET /api/invoices/overdue - Obtener facturas vencidas
export async function GET(request: NextRequest) {
  try {
    // Verificar permisos de lectura
    const { error, user } = await requirePermission(request, 'invoices', 'read')
    if (error) return error

    const tenantId = getTenantId(user!)

    // Obtener y validar parámetros de consulta
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    const validation = OverdueQuerySchema.safeParse(queryParams)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Parámetros de consulta inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const { limit } = validation.data

    // Obtener facturas vencidas
    const invoices = await getOverdueInvoices(tenantId, limit)

    return NextResponse.json({
      success: true,
      data: invoices,
      count: invoices.length,
    })
  } catch (error) {
    console.error('Error en GET /api/invoices/overdue:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
