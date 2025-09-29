import { NextRequest, NextResponse } from 'next/server'
import { SchoolStudentService } from '@/lib/services/school-student'

// GET /api/schools/students/search - Buscar estudiantes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parámetro de búsqueda requerido',
        },
        { status: 400 }
      )
    }

    const students = await SchoolStudentService.searchStudents(tenantId, query)

    return NextResponse.json({
      success: true,
      data: students,
    })
  } catch (error) {
    console.error('Error searching students:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al buscar estudiantes',
      },
      { status: 500 }
    )
  }
}
