import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Get current period (YYYY-MM format)
    const currentDate = new Date()
    const currentPeriod = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`

    // Get total employees
    const totalEmployees = await prisma.employee.count({
      where: {
        tenantId,
        status: 'ACTIVE',
      },
    })

    // Get current period payroll stats
    const currentPeriodPayrolls = await prisma.payroll.findMany({
      where: {
        tenantId,
        period: currentPeriod,
      },
    })

    const totalGrossSalary = currentPeriodPayrolls.reduce(
      (sum, payroll) => sum + Number(payroll.grossSalary),
      0
    )
    const totalNetSalary = currentPeriodPayrolls.reduce(
      (sum, payroll) => sum + Number(payroll.netSalary),
      0
    )
    const totalDeductions = currentPeriodPayrolls.reduce(
      (sum, payroll) =>
        sum + (Number(payroll.grossSalary) - Number(payroll.netSalary)),
      0
    )

    // Get pending and processed payrolls count
    const pendingPayrolls = await prisma.payroll.count({
      where: {
        tenantId,
        status: 'PENDING',
      },
    })

    const processedPayrolls = await prisma.payroll.count({
      where: {
        tenantId,
        status: 'PROCESSED',
      },
    })

    const stats = {
      totalEmployees,
      totalGrossSalary,
      totalNetSalary,
      totalDeductions,
      pendingPayrolls,
      processedPayrolls,
      currentPeriod,
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching payroll stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas de nómina',
      },
      { status: 500 }
    )
  }
}
