import { NextRequest, NextResponse } from 'next/server'
import { ServerService } from '@/lib/services/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || undefined
    const severity = searchParams.get('severity') || undefined
    const serverId = searchParams.get('serverId') || undefined

    const result = await ServerService.getServerAlerts(tenantId, {
      page,
      limit,
      status,
      severity,
      serverId,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching server alerts:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener alertas',
      },
      { status: 500 }
    )
  }
}
