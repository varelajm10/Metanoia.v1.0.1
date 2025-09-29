import { NextRequest, NextResponse } from 'next/server'
import { SchoolAcademicService } from '@/lib/services/school-academic'
import { SchoolGradeLevelSchema } from '@/lib/validations/school'

// GET /api/schools/academic/grade-levels - Obtener grados/niveles
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const gradeLevels = await SchoolAcademicService.getGradeLevels(tenantId)

    return NextResponse.json({
      success: true,
      data: gradeLevels,
    })
  } catch (error) {
    console.error('Error fetching grade levels:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener grados/niveles',
      },
      { status: 500 }
    )
  }
}

// POST /api/schools/academic/grade-levels - Crear nuevo grado/nivel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = SchoolGradeLevelSchema.parse(body)

    const gradeLevel = await SchoolAcademicService.createGradeLevel({
      ...validatedData,
      tenantId,
    })

    return NextResponse.json({
      success: true,
      data: gradeLevel,
      message: 'Grado/Nivel creado exitosamente',
    })
  } catch (error: any) {
    console.error('Error creating grade level:', error)
    
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
        error: 'Error al crear grado/nivel',
      },
      { status: 500 }
    )
  }
}
