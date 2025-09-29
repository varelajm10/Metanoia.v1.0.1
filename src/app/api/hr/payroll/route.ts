import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PayrollService } from '@/lib/services/payroll'
import { CreatePayrollSchema } from '@/lib/validations/employee'
import { requireAuth } from '@/lib/middleware/auth'

const prisma = new PrismaClient()
const payrollService = new PayrollService(prisma)

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
    const period = searchParams.get('period') || undefined
    const status = searchParams.get('status') || undefined
    const year = parseInt(searchParams.get('year') || '0') || undefined
    const month = parseInt(searchParams.get('month') || '0') || undefined

    const result = await payrollService.getPayrolls(tenantId, {
      page,
      limit,
      employeeId,
      period,
      status,
      year,
      month,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching payrolls:', error)
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

    // Verificar permisos de gestión de nómina
    if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'No tienes permisos para gestionar nómina' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Validar datos de entrada
    const validatedData = CreatePayrollSchema.parse(body)

    const payroll = await payrollService.createPayroll({
      ...validatedData,
      tenantId,
    })

    return NextResponse.json(
      {
        success: true,
        data: payroll,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating payroll:', error)

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
