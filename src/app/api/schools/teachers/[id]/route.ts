import { NextRequest, NextResponse } from 'next/server'
import { SchoolTeacherService } from '@/lib/services/school-teacher'
import { SchoolTeacherSchema } from '@/lib/validations/school'

// GET /api/schools/teachers/[id] - Obtener docente por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'
    const { id } = params

    const teacher = await SchoolTeacherService.getTeacherById(id, tenantId)

    if (!teacher) {
      return NextResponse.json(
        {
          success: false,
          error: 'Docente no encontrado',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: teacher,
    })
  } catch (error) {
    console.error('Error fetching teacher:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener docente',
      },
      { status: 500 }
    )
  }
}

// PUT /api/schools/teachers/[id] - Actualizar docente
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
    const validatedData = SchoolTeacherSchema.partial().parse(body)

    const result = await SchoolTeacherService.updateTeacher(
      id,
      tenantId,
      validatedData
    )

    if (result.count === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Docente no encontrado',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Docente actualizado exitosamente',
    })
  } catch (error: any) {
    console.error('Error updating teacher:', error)

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
        error: 'Error al actualizar docente',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/schools/teachers/[id] - Eliminar docente
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'
    const { id } = params

    const result = await SchoolTeacherService.deleteTeacher(id, tenantId)

    if (result.count === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Docente no encontrado',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Docente eliminado exitosamente',
    })
  } catch (error) {
    console.error('Error deleting teacher:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar docente',
      },
      { status: 500 }
    )
  }
}
