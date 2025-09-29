import { NextRequest, NextResponse } from 'next/server'
import { SchoolAcademicService } from '@/lib/services/school-academic'
import { SchoolScheduleSchema } from '@/lib/validations/school'

// GET /api/schools/academic/schedules - Obtener horarios
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'
    const academicYear = searchParams.get('academicYear') || new Date().getFullYear().toString()
    const sectionId = searchParams.get('sectionId') || undefined
    const teacherId = searchParams.get('teacherId') || undefined
    const dayOfWeek = searchParams.get('dayOfWeek') ? parseInt(searchParams.get('dayOfWeek')!) : undefined

    const schedules = await SchoolAcademicService.getSchedules(tenantId, {
      academicYear,
      sectionId,
      teacherId,
      dayOfWeek,
    })

    return NextResponse.json({
      success: true,
      data: schedules,
    })
  } catch (error) {
    console.error('Error fetching schedules:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener horarios',
      },
      { status: 500 }
    )
  }
}

// POST /api/schools/academic/schedules - Crear nuevo horario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = SchoolScheduleSchema.parse(body)

    const schedule = await SchoolAcademicService.createSchedule({
      ...validatedData,
      tenantId,
    })

    return NextResponse.json({
      success: true,
      data: schedule,
      message: 'Horario creado exitosamente',
    })
  } catch (error: any) {
    console.error('Error creating schedule:', error)
    
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
        error: 'Error al crear horario',
      },
      { status: 500 }
    )
  }
}
