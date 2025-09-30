import { NextRequest, NextResponse } from 'next/server'
import { SchoolAcademicService } from '@/lib/services/school-academic'
import { SchoolSectionSchema } from '@/lib/validations/school'

// GET /api/schools/academic/sections - Obtener secciones
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'
    const academicYear =
      searchParams.get('academicYear') || new Date().getFullYear().toString()
    const gradeLevelId = searchParams.get('gradeLevelId') || undefined

    const sections = await SchoolAcademicService.getSections(tenantId, {
      academicYear,
      gradeLevelId,
    })

    return NextResponse.json({
      success: true,
      data: sections,
    })
  } catch (error) {
    console.error('Error fetching sections:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener secciones',
      },
      { status: 500 }
    )
  }
}

// POST /api/schools/academic/sections - Crear nueva sección
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = SchoolSectionSchema.parse(body)

    const section = await SchoolAcademicService.createSection({
      ...validatedData,
      tenantId,
    })

    return NextResponse.json({
      success: true,
      data: section,
      message: 'Sección creada exitosamente',
    })
  } catch (error: any) {
    console.error('Error creating section:', error)

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
        error: 'Error al crear sección',
      },
      { status: 500 }
    )
  }
}
