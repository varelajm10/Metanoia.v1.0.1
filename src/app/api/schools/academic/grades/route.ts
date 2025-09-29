import { NextRequest, NextResponse } from 'next/server'
import { SchoolAcademicService } from '@/lib/services/school-academic'
import { SchoolGradeSchema } from '@/lib/validations/school'

// GET /api/schools/academic/grades - Obtener calificaciones
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
    const studentId = searchParams.get('studentId') || undefined
    const subjectId = searchParams.get('subjectId') || undefined
    const academicYear = searchParams.get('academicYear') || new Date().getFullYear().toString()
    const term = searchParams.get('term') || undefined

    const result = await SchoolAcademicService.getGrades(tenantId, {
      page,
      limit,
      studentId,
      subjectId,
      academicYear,
      term,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching grades:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener calificaciones',
      },
      { status: 500 }
    )
  }
}

// POST /api/schools/academic/grades - Crear nueva calificación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = SchoolGradeSchema.parse(body)

    const grade = await SchoolAcademicService.createGrade({
      ...validatedData,
      tenantId,
    })

    return NextResponse.json({
      success: true,
      data: grade,
      message: 'Calificación creada exitosamente',
    })
  } catch (error: any) {
    console.error('Error creating grade:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos de entrada inválidos',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear calificación',
      },
      { status: 500 }
    )
  }
}
