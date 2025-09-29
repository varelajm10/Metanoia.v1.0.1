import { NextRequest, NextResponse } from 'next/server'
import { LeadService } from '@/lib/services/lead'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const stats = await LeadService.getLeadStats(tenantId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching lead stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas de leads',
      },
      { status: 500 }
    )
  }
}
