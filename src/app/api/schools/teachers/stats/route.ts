import { NextRequest, NextResponse } from 'next/server'
import { SchoolTeacherService } from '@/lib/services/school-teacher'

// GET /api/schools/teachers/stats - Obtener estadísticas de docentes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const stats = await SchoolTeacherService.getTeacherStats(tenantId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching teacher stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas de docentes',
      },
      { status: 500 }
    )
  }
}
