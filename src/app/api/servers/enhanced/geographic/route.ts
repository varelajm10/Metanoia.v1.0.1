import { NextRequest, NextResponse } from 'next/server'
import { EnhancedServerService } from '@/lib/services/server-enhanced'

// GET /api/servers/enhanced/geographic - Obtener estadísticas geográficas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'
    const type = searchParams.get('type') || 'all' // all, countries, regions, cities, timezones

    let result

    switch (type) {
      case 'countries':
        const countries =
          await EnhancedServerService.getGeographicStats(tenantId)
        result = countries.countries
        break
      case 'regions':
        const regions = await EnhancedServerService.getGeographicStats(tenantId)
        result = regions.regions
        break
      case 'cities':
        const cities = await EnhancedServerService.getGeographicStats(tenantId)
        result = cities.cities
        break
      case 'timezones':
        result = await EnhancedServerService.getTimezoneStats(tenantId)
        break
      default:
        result = await EnhancedServerService.getGeographicStats(tenantId)
        break
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching geographic stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas geográficas',
      },
      { status: 500 }
    )
  }
}
