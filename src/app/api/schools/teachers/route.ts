import { NextRequest, NextResponse } from 'next/server'
import { SchoolTeacherService } from '@/lib/services/school-teacher'
import { SchoolTeacherSchema } from '@/lib/validations/school'

// GET /api/schools/teachers - Obtener docentes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined
    const department = searchParams.get('department') || undefined
    const employmentType = searchParams.get('employmentType') || undefined

    const result = await SchoolTeacherService.getTeachers(tenantId, {
      page,
      limit,
      search,
      status,
      department,
      employmentType,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching teachers:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener docentes',
      },
      { status: 500 }
    )
  }
}

// POST /api/schools/teachers - Crear nuevo docente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = SchoolTeacherSchema.parse(body)

    const teacher = await SchoolTeacherService.createTeacher({
      ...validatedData,
      tenantId,
    })

    return NextResponse.json({
      success: true,
      data: teacher,
      message: 'Docente creado exitosamente',
    })
  } catch (error: any) {
    console.error('Error creating teacher:', error)

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
        error: 'Error al crear docente',
      },
      { status: 500 }
    )
  }
}
