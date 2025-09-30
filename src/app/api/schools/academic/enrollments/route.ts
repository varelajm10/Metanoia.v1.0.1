import { NextRequest, NextResponse } from 'next/server'
import { SchoolAcademicService } from '@/lib/services/school-academic'
import { SchoolEnrollmentSchema } from '@/lib/validations/school'

// GET /api/schools/academic/enrollments - Obtener matrículas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const academicYear =
      searchParams.get('academicYear') || new Date().getFullYear().toString()
    const studentId = searchParams.get('studentId') || undefined
    const sectionId = searchParams.get('sectionId') || undefined
    const status = searchParams.get('status') || undefined

    const result = await SchoolAcademicService.getEnrollments(tenantId, {
      page,
      limit,
      academicYear,
      studentId,
      sectionId,
      status,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener matrículas',
      },
      { status: 500 }
    )
  }
}

// POST /api/schools/academic/enrollments - Crear nueva matrícula
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = SchoolEnrollmentSchema.parse(body)

    const enrollment = await SchoolAcademicService.createEnrollment({
      ...validatedData,
      tenantId,
    })

    return NextResponse.json({
      success: true,
      data: enrollment,
      message: 'Matrícula creada exitosamente',
    })
  } catch (error: any) {
    console.error('Error creating enrollment:', error)

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
        error: 'Error al crear matrícula',
      },
      { status: 500 }
    )
  }
}
