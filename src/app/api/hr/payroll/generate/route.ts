import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PayrollService } from '@/lib/services/payroll'
import { requireAuth } from '@/lib/middleware/auth'

const prisma = new PrismaClient()
const payrollService = new PayrollService(prisma)

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
        { success: false, error: 'No tienes permisos para generar nómina' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { period } = body

    if (!period || !/^\d{4}-\d{2}$/.test(period)) {
      return NextResponse.json(
        { success: false, error: 'Período inválido. Use formato YYYY-MM' },
        { status: 400 }
      )
    }

    const payrolls = await payrollService.generatePayrollForPeriod(
      tenantId,
      period
    )

    return NextResponse.json({
      success: true,
      data: {
        period,
        generatedCount: payrolls.length,
        payrolls,
      },
    })
  } catch (error) {
    console.error('Error generating payroll:', error)
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
