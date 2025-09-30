import { NextRequest, NextResponse } from 'next/server'
import { SchoolAttendancePaymentsService } from '@/lib/services/school-attendance-payments'
import { SchoolAttendanceSchema } from '@/lib/validations/school'

// GET /api/schools/attendance - Obtener asistencia
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
    const studentId = searchParams.get('studentId') || undefined
    const date = searchParams.get('date') || undefined
    const status = searchParams.get('status') || undefined
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined

    const result = await SchoolAttendancePaymentsService.getAttendance(
      tenantId,
      {
        page,
        limit,
        studentId,
        date,
        status,
        startDate,
        endDate,
      }
    )

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener asistencia',
      },
      { status: 500 }
    )
  }
}

// POST /api/schools/attendance - Crear registro de asistencia
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = SchoolAttendanceSchema.parse(body)

    const attendance = await SchoolAttendancePaymentsService.createAttendance({
      ...validatedData,
      tenantId,
    })

    return NextResponse.json({
      success: true,
      data: attendance,
      message: 'Registro de asistencia creado exitosamente',
    })
  } catch (error: any) {
    console.error('Error creating attendance:', error)

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
        error: 'Error al crear registro de asistencia',
      },
      { status: 500 }
    )
  }
}
