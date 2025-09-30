import { NextRequest, NextResponse } from 'next/server'
import { SchoolStudentService } from '@/lib/services/school-student'
import { SchoolStudentSchema } from '@/lib/validations/school'

// GET /api/schools/students - Obtener estudiantes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined
    const grade = searchParams.get('grade') || undefined
    const section = searchParams.get('section') || undefined

    const result = await SchoolStudentService.getStudents(tenantId, {
      page,
      limit,
      search,
      status,
      grade,
      section,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estudiantes',
      },
      { status: 500 }
    )
  }
}

// POST /api/schools/students - Crear nuevo estudiante
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = SchoolStudentSchema.parse(body)

    const student = await SchoolStudentService.createStudent({
      ...validatedData,
      tenantId,
    })

    return NextResponse.json({
      success: true,
      data: student,
      message: 'Estudiante creado exitosamente',
    })
  } catch (error: any) {
    console.error('Error creating student:', error)

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
        error: 'Error al crear estudiante',
      },
      { status: 500 }
    )
  }
}
