import { PrismaClient } from '@prisma/client'
import {
  CreatePayrollInput,
  UpdatePayrollInput,
} from '@/lib/validations/employee'

export class PayrollService {
  constructor(private prisma: PrismaClient) {}

  async createPayroll(data: CreatePayrollInput & { tenantId: string }) {
    // Verificar que el empleado existe
    const employee = await this.prisma.employee.findFirst({
      where: { id: data.employeeId, tenantId: data.tenantId },
    })

    if (!employee) {
      throw new Error('Empleado no encontrado')
    }

    // Verificar que no exista nómina para este período
    const existingPayroll = await this.prisma.payroll.findFirst({
      where: {
        employeeId: data.employeeId,
        period: data.period,
        tenantId: data.tenantId,
      },
    })

    if (existingPayroll) {
      throw new Error('Ya existe una nómina para este empleado en este período')
    }

    // Calcular salarios
    const grossSalary =
      data.basicSalary + data.overtimePay + data.bonuses + data.allowances
    const totalDeductions =
      data.taxes +
      data.socialSecurity +
      data.healthInsurance +
      data.otherDeductions
    const netSalary = grossSalary - totalDeductions

    // Parsear año y mes del período
    const [year, month] = data.period.split('-').map(Number)

    return await this.prisma.payroll.create({
      data: {
        ...data,
        year,
        month,
        grossSalary,
        totalDeductions,
        netSalary,
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeNumber: true,
            email: true,
            position: true,
            department: true,
          },
        },
      },
    })
  }

  async getPayrolls(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      employeeId?: string
      period?: string
      status?: string
      year?: number
      month?: number
    } = {}
  ) {
    const {
      page = 1,
      limit = 10,
      employeeId,
      period,
      status,
      year,
      month,
    } = options

    const where: any = { tenantId }

    if (employeeId) {
      where.employeeId = employeeId
    }

    if (period) {
      where.period = period
    }

    if (status) {
      where.status = status
    }

    if (year) {
      where.year = year
    }

    if (month) {
      where.month = month
    }

    const [payrolls, total] = await Promise.all([
      this.prisma.payroll.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              employeeNumber: true,
              position: true,
              department: true,
            },
          },
        },
        orderBy: { period: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.payroll.count({ where }),
    ])

    return {
      payrolls,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async getPayrollById(id: string, tenantId: string) {
    return await this.prisma.payroll.findFirst({
      where: { id, tenantId },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeNumber: true,
            email: true,
            position: true,
            department: true,
            hireDate: true,
          },
        },
      },
    })
  }

  async updatePayroll(id: string, data: UpdatePayrollInput, tenantId: string) {
    // Verificar que la nómina existe
    const existingPayroll = await this.prisma.payroll.findFirst({
      where: { id, tenantId },
    })

    if (!existingPayroll) {
      throw new Error('Nómina no encontrada')
    }

    // Verificar que no esté procesada o pagada
    if (
      existingPayroll.status === 'PROCESSED' ||
      existingPayroll.status === 'PAID'
    ) {
      throw new Error('No se puede modificar una nómina procesada o pagada')
    }

    // Recalcular si se actualizan valores de salario
    let updateData: any = { ...data }

    if (
      data.basicSalary ||
      data.overtimePay ||
      data.bonuses ||
      data.allowances ||
      data.taxes ||
      data.socialSecurity ||
      data.healthInsurance ||
      data.otherDeductions
    ) {
      const basicSalary = data.basicSalary ?? existingPayroll.basicSalary
      const overtimePay = data.overtimePay ?? existingPayroll.overtimePay
      const bonuses = data.bonuses ?? existingPayroll.bonuses
      const allowances = data.allowances ?? existingPayroll.allowances
      const taxes = data.taxes ?? existingPayroll.taxes
      const socialSecurity =
        data.socialSecurity ?? existingPayroll.socialSecurity
      const healthInsurance =
        data.healthInsurance ?? existingPayroll.healthInsurance
      const otherDeductions =
        data.otherDeductions ?? existingPayroll.otherDeductions

      updateData.grossSalary =
        Number(basicSalary) +
        Number(overtimePay) +
        Number(bonuses) +
        Number(allowances)
      updateData.totalDeductions =
        Number(taxes) +
        Number(socialSecurity) +
        Number(healthInsurance) +
        Number(otherDeductions)
      updateData.netSalary =
        Number(updateData.grossSalary) - Number(updateData.totalDeductions)
    }

    return await this.prisma.payroll.update({
      where: { id },
      data: updateData,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeNumber: true,
            email: true,
            position: true,
            department: true,
          },
        },
      },
    })
  }

  async processPayroll(id: string, processedBy: string, tenantId: string) {
    const payroll = await this.prisma.payroll.findFirst({
      where: { id, tenantId },
    })

    if (!payroll) {
      throw new Error('Nómina no encontrada')
    }

    if (payroll.status !== 'PENDING') {
      throw new Error('Solo se pueden procesar nóminas pendientes')
    }

    return await this.prisma.payroll.update({
      where: { id },
      data: {
        status: 'PROCESSED',
        processedAt: new Date(),
        processedBy,
      },
    })
  }

  async getPayrollStats(tenantId: string, year?: number, month?: number) {
    const currentYear = year ?? new Date().getFullYear()
    const currentMonth = month ?? new Date().getMonth() + 1

    const where: any = {
      tenantId,
      year: currentYear,
    }

    if (month) {
      where.month = currentMonth
    }

    const [
      totalPayrolls,
      totalGrossSalary,
      totalNetSalary,
      totalDeductions,
      payrollsByStatus,
      payrollsByDepartment,
    ] = await Promise.all([
      this.prisma.payroll.count({ where }),
      this.prisma.payroll.aggregate({
        where,
        _sum: { grossSalary: true },
      }),
      this.prisma.payroll.aggregate({
        where,
        _sum: { netSalary: true },
      }),
      this.prisma.payroll.aggregate({
        where,
        _sum: { totalDeductions: true },
      }),
      this.prisma.payroll.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      this.prisma.payroll.groupBy({
        by: ['employeeId', 'department'] as any,
        where,
        _sum: {
          grossSalary: true,
          netSalary: true,
          totalDeductions: true,
        },
        _count: true,
      }),
    ])

    return {
      totalPayrolls,
      totalGrossSalary: totalGrossSalary._sum.grossSalary || 0,
      totalNetSalary: totalNetSalary._sum.netSalary || 0,
      totalDeductions: totalDeductions._sum.totalDeductions || 0,
      payrollsByStatus,
      payrollsByDepartment,
    }
  }

  async generatePayrollForPeriod(tenantId: string, period: string) {
    const [year, month] = period.split('-').map(Number)

    // Obtener empleados activos
    const employees = await this.prisma.employee.findMany({
      where: {
        tenantId,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        employeeNumber: true,
        salary: true,
      },
    })

    const payrolls = []

    for (const employee of employees) {
      // Verificar si ya existe nómina para este período
      const existingPayroll = await this.prisma.payroll.findFirst({
        where: {
          employeeId: employee.id,
          period,
          tenantId,
        },
      })

      if (existingPayroll) {
        continue // Ya existe nómina para este empleado en este período
      }

      // Crear nómina básica
      const basicSalary = Number(employee.salary) || 0
      const grossSalary = basicSalary
      const taxes = basicSalary * 0.1 // 10% impuestos (ejemplo)
      const socialSecurity = basicSalary * 0.05 // 5% seguridad social (ejemplo)
      const healthInsurance = basicSalary * 0.03 // 3% seguro de salud (ejemplo)
      const totalDeductions = taxes + socialSecurity + healthInsurance
      const netSalary = grossSalary - totalDeductions

      const payroll = await this.prisma.payroll.create({
        data: {
          employeeId: employee.id,
          period,
          year,
          month,
          basicSalary,
          grossSalary,
          totalDeductions,
          netSalary,
          taxes,
          socialSecurity,
          healthInsurance,
          tenantId,
        },
      })

      payrolls.push(payroll)
    }

    return payrolls
  }
}
