import { NextRequest, NextResponse } from 'next/server'
import { ServerService } from '@/lib/services/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const alert = await ServerService.acknowledgeAlert(params.id, tenantId)

    return NextResponse.json({
      success: true,
      data: alert,
    })
  } catch (error) {
    console.error('Error acknowledging alert:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al reconocer alerta',
      },
      { status: 500 }
    )
  }
}
