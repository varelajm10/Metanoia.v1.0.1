import { NextRequest, NextResponse } from 'next/server'
import { SchoolStudentService } from '@/lib/services/school-student'

// GET /api/schools/students/stats - Obtener estadísticas de estudiantes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const stats = await SchoolStudentService.getStudentStats(tenantId)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching student stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas de estudiantes',
      },
      { status: 500 }
    )
  }
}
