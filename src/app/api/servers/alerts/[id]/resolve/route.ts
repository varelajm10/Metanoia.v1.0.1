import { NextRequest, NextResponse } from 'next/server'
import { ServerService } from '@/lib/services/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const { resolvedBy } = body

    const alert = await ServerService.resolveAlert(
      params.id,
      tenantId,
      resolvedBy
    )

    return NextResponse.json({
      success: true,
      data: alert,
    })
  } catch (error) {
    console.error('Error resolving alert:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al resolver alerta',
      },
      { status: 500 }
    )
  }
}
