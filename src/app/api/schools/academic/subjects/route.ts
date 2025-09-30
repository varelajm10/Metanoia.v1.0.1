import { NextRequest, NextResponse } from 'next/server'
import { SchoolAcademicService } from '@/lib/services/school-academic'
import { SchoolSubjectSchema } from '@/lib/validations/school'

// GET /api/schools/academic/subjects - Obtener materias/asignaturas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'
    const gradeLevelId = searchParams.get('gradeLevelId') || undefined
    const teacherId = searchParams.get('teacherId') || undefined

    const subjects = await SchoolAcademicService.getSubjects(tenantId, {
      gradeLevelId,
      teacherId,
    })

    return NextResponse.json({
      success: true,
      data: subjects,
    })
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener materias/asignaturas',
      },
      { status: 500 }
    )
  }
}

// POST /api/schools/academic/subjects - Crear nueva materia/asignatura
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = SchoolSubjectSchema.parse(body)

    const subject = await SchoolAcademicService.createSubject({
      ...validatedData,
      tenantId,
    })

    return NextResponse.json({
      success: true,
      data: subject,
      message: 'Materia/Asignatura creada exitosamente',
    })
  } catch (error: any) {
    console.error('Error creating subject:', error)

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
        error: 'Error al crear materia/asignatura',
      },
      { status: 500 }
    )
  }
}
