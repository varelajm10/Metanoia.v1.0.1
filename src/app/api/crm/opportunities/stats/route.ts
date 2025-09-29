import { NextRequest, NextResponse } from 'next/server'
import { OpportunityService } from '@/lib/services/opportunity'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const stats = await OpportunityService.getOpportunityStats(tenantId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching opportunity stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas de oportunidades',
      },
      { status: 500 }
    )
  }
}
