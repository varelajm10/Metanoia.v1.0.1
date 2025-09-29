import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { EmployeeService } from '@/lib/services/employee'
import { CreateEmployeeSchema } from '@/lib/validations/employee'
import { requireAuth } from '@/lib/middleware/auth'

const prisma = new PrismaClient()
const employeeService = new EmployeeService(prisma)

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult.error) {
      return authResult.error
    }

    const { user } = authResult
    const tenantId = user.tenantId

    // Verificar permisos del módulo RRHH
    const url = new URL(request.url)
    const searchParams = url.searchParams

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || undefined
    const department = searchParams.get('department') || undefined
    const status = searchParams.get('status') || undefined

    const result = await employeeService.getEmployees(tenantId, {
      page,
      limit,
      search,
      department,
      status,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching employees:', error)
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
        { success: false, error: 'No tienes permisos para crear empleados' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Validar datos de entrada
    const validatedData = CreateEmployeeSchema.parse(body)

    const employee = await employeeService.createEmployee({
      ...validatedData,
      tenantId,
    })

    return NextResponse.json(
      {
        success: true,
        data: employee,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating employee:', error)

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
