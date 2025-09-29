import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { VacationService } from '@/lib/services/vacation'
import { CreateVacationSchema } from '@/lib/validations/employee'
import { requireAuth } from '@/lib/middleware/auth'

const prisma = new PrismaClient()
const vacationService = new VacationService(prisma)

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult.error) {
      return authResult.error
    }

    const { user } = authResult
    const tenantId = user.tenantId

    const url = new URL(request.url)
    const searchParams = url.searchParams

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const employeeId = searchParams.get('employeeId') || undefined
    const status = searchParams.get('status') || undefined
    const type = searchParams.get('type') || undefined
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined

    const result = await vacationService.getVacations(tenantId, {
      page,
      limit,
      employeeId,
      status,
      type,
      startDate,
      endDate,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching vacations:', error)
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Error interno del servidor',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult.error) {
      return authResult.error
    }

    const { user } = authResult
    const tenantId = user.tenantId

    // Verificar permisos de escritura
    if (!['MANAGER', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'No tienes permisos para solicitar vacaciones',
        },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Validar datos de entrada
    const validatedData = CreateVacationSchema.parse(body)

    const vacation = await vacationService.createVacation({
      ...validatedData,
      tenantId,
    })

    return NextResponse.json(
      {
        success: true,
        data: vacation,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating vacation:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos de entrada inválidos',
          details: error.message,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Error interno del servidor',
      },
      { status: 500 }
    )
  }
}
