import { NextRequest, NextResponse } from 'next/server'
import { SchoolStudentService } from '@/lib/services/school-student'
import { SchoolStudentSchema } from '@/lib/validations/school'

// GET /api/schools/students/[id] - Obtener estudiante por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'
    const { id } = params

    const student = await SchoolStudentService.getStudentById(id, tenantId)

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: 'Estudiante no encontrado',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: student,
    })
  } catch (error) {
    console.error('Error fetching student:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estudiante',
      },
      { status: 500 }
    )
  }
}

// PUT /api/schools/students/[id] - Actualizar estudiante
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'
    const { id } = params

    // Validar datos de entrada
    const validatedData = SchoolStudentSchema.partial().parse(body)

    const result = await SchoolStudentService.updateStudent(
      id,
      tenantId,
      validatedData
    )

    if (result.count === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Estudiante no encontrado',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Estudiante actualizado exitosamente',
    })
  } catch (error: any) {
    console.error('Error updating student:', error)

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
        error: 'Error al actualizar estudiante',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/schools/students/[id] - Eliminar estudiante
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'
    const { id } = params

    const result = await SchoolStudentService.deleteStudent(id, tenantId)

    if (result.count === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Estudiante no encontrado',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Estudiante eliminado exitosamente',
    })
  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar estudiante',
      },
      { status: 500 }
    )
  }
}
