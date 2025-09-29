import { NextRequest, NextResponse } from 'next/server'
import { EnhancedServerService } from '@/lib/services/server-enhanced'

// GET /api/servers/enhanced/geographic/[location] - Obtener servidores por ubicación
export async function GET(
  request: NextRequest,
  { params }: { params: { location: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'
    const type = searchParams.get('type') || 'country' // country, region, city

    let servers

    switch (type) {
      case 'country':
        servers = await EnhancedServerService.getServersByCountry(
          tenantId,
          params.location
        )
        break
      case 'region':
        servers = await EnhancedServerService.getServersByRegion(
          tenantId,
          params.location
        )
        break
      default:
        servers = await EnhancedServerService.getServersByCountry(
          tenantId,
          params.location
        )
        break
    }

    return NextResponse.json({
      success: true,
      data: servers,
    })
  } catch (error) {
    console.error('Error fetching servers by location:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener servidores por ubicación',
      },
      { status: 500 }
    )
  }
}
