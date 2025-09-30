import {
  CreateVacationInput,
  UpdateVacationInput,
} from '@/lib/validations/employee'
import { prisma } from '@/lib/db'

export class VacationService {
  constructor() {}

  /**
   * Crea una nueva solicitud de vacaciones para un empleado
   * @param data - Datos de la solicitud de vacaciones, incluyendo tenantId
   * @returns Promise con la solicitud de vacaciones creada y cálculos automáticos
   * @throws Error si el empleado no existe, no está activo, o hay conflictos de fechas
   */
  async createVacation(data: CreateVacationInput & { tenantId: string }) {
    // Verificar que el empleado existe
    const employee = await prisma.employee.findFirst({
      where: { id: data.employeeId, tenantId: data.tenantId },
    })

    if (!employee) {
      throw new Error('Empleado no encontrado')
    }

    // Verificar que el empleado esté activo
    if (employee.status !== 'ACTIVE') {
      throw new Error('Solo empleados activos pueden solicitar vacaciones')
    }

    // Calcular días de vacación
    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)
    const timeDiff = endDate.getTime() - startDate.getTime()
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1 // +1 para incluir el día final

    // Verificar que no haya conflictos con otras vacaciones
    const conflictingVacations = await prisma.vacation.findMany({
      where: {
        employeeId: data.employeeId,
        tenantId: data.tenantId,
        status: { in: ['PENDING', 'APPROVED'] },
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    })

    if (conflictingVacations.length > 0) {
      throw new Error(
        'Ya existe una solicitud de vacaciones que se superpone con estas fechas'
      )
    }

    return await prisma.vacation.create({
      data: {
        ...data,
        days,
        startDate,
        endDate,
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

  async getVacations(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      employeeId?: string
      status?: string
      type?: string
      startDate?: string
      endDate?: string
    } = {}
  ) {
    const {
      page = 1,
      limit = 10,
      employeeId,
      status,
      type,
      startDate,
      endDate,
    } = options

    const where: any = { tenantId }

    if (employeeId) {
      where.employeeId = employeeId
    }

    if (status) {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    if (startDate && endDate) {
      where.OR = [
        {
          startDate: { gte: new Date(startDate) },
          endDate: { lte: new Date(endDate) },
        },
        {
          startDate: { lte: new Date(endDate) },
          endDate: { gte: new Date(startDate) },
        },
      ]
    }

    const [vacations, total] = await Promise.all([
      prisma.vacation.findMany({
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
        orderBy: { requestedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.vacation.count({ where }),
    ])

    return {
      vacations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async getVacationById(id: string, tenantId: string) {
    return await prisma.vacation.findFirst({
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
          },
        },
      },
    })
  }

  async updateVacation(
    id: string,
    data: UpdateVacationInput,
    tenantId: string
  ) {
    // Verificar que la vacación existe
    const existingVacation = await prisma.vacation.findFirst({
      where: { id, tenantId },
    })

    if (!existingVacation) {
      throw new Error('Solicitud de vacaciones no encontrada')
    }

    // Solo permitir cambios de estado si está pendiente
    if (existingVacation.status !== 'PENDING' && data.status) {
      throw new Error('Solo se pueden modificar solicitudes pendientes')
    }

    return await prisma.vacation.update({
      where: { id },
      data: {
        ...data,
        approvedAt:
          data.status === 'APPROVED' ? new Date() : existingVacation.approvedAt,
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

  async approveVacation(id: string, approvedBy: string, tenantId: string) {
    const vacation = await prisma.vacation.findFirst({
      where: { id, tenantId },
    })

    if (!vacation) {
      throw new Error('Solicitud de vacaciones no encontrada')
    }

    if (vacation.status !== 'PENDING') {
      throw new Error('Solo se pueden aprobar solicitudes pendientes')
    }

    return await prisma.vacation.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
        approvedBy,
      },
    })
  }

  async rejectVacation(
    id: string,
    approvedBy: string,
    rejectionReason: string,
    tenantId: string
  ) {
    const vacation = await prisma.vacation.findFirst({
      where: { id, tenantId },
    })

    if (!vacation) {
      throw new Error('Solicitud de vacaciones no encontrada')
    }

    if (vacation.status !== 'PENDING') {
      throw new Error('Solo se pueden rechazar solicitudes pendientes')
    }

    return await prisma.vacation.update({
      where: { id },
      data: {
        status: 'REJECTED',
        approvedAt: new Date(),
        approvedBy,
        rejectionReason,
      },
    })
  }

  async getVacationStats(tenantId: string, year?: number) {
    const currentYear = year ?? new Date().getFullYear()

    const startOfYear = new Date(currentYear, 0, 1)
    const endOfYear = new Date(currentYear, 11, 31)

    const where = {
      tenantId,
      startDate: { gte: startOfYear },
      endDate: { lte: endOfYear },
    }

    const [
      totalVacations,
      approvedVacations,
      pendingVacations,
      rejectedVacations,
      vacationsByType,
      vacationsByStatus,
      totalVacationDays,
    ] = await Promise.all([
      prisma.vacation.count({ where }),
      prisma.vacation.count({ where: { ...where, status: 'APPROVED' } }),
      prisma.vacation.count({ where: { ...where, status: 'PENDING' } }),
      prisma.vacation.count({ where: { ...where, status: 'REJECTED' } }),
      prisma.vacation.groupBy({
        by: ['type'],
        where,
        _count: true,
        _sum: { days: true },
      }),
      prisma.vacation.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      prisma.vacation.aggregate({
        where: { ...where, status: 'APPROVED' },
        _sum: { days: true },
      }),
    ])

    return {
      totalVacations,
      approvedVacations,
      pendingVacations,
      rejectedVacations,
      vacationsByType,
      vacationsByStatus,
      totalVacationDays: totalVacationDays._sum.days || 0,
    }
  }

  async getUpcomingVacations(tenantId: string, days: number = 30) {
    const startDate = new Date()
    const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000)

    return await prisma.vacation.findMany({
      where: {
        tenantId,
        status: 'APPROVED',
        startDate: { gte: startDate, lte: endDate },
      },
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
      orderBy: { startDate: 'asc' },
    })
  }

  async getEmployeeVacationBalance(
    employeeId: string,
    tenantId: string,
    year?: number
  ) {
    const currentYear = year ?? new Date().getFullYear()

    const startOfYear = new Date(currentYear, 0, 1)
    const endOfYear = new Date(currentYear, 11, 31)

    // Obtener empleado
    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, tenantId },
    })

    if (!employee) {
      throw new Error('Empleado no encontrado')
    }

    // Calcular días de vacación utilizados
    const usedVacations = await prisma.vacation.aggregate({
      where: {
        employeeId,
        tenantId,
        status: 'APPROVED',
        type: 'ANNUAL',
        startDate: { gte: startOfYear },
        endDate: { lte: endOfYear },
      },
      _sum: { days: true },
    })

    // Días de vacación anuales por defecto (se puede configurar por empleado)
    const annualVacationDays = 22 // Días estándar por año

    const usedDays = usedVacations._sum.days || 0
    const remainingDays = annualVacationDays - usedDays

    return {
      employee: {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        employeeNumber: employee.employeeNumber,
      },
      year: currentYear,
      annualVacationDays,
      usedDays,
      remainingDays,
      usedVacations: await prisma.vacation.findMany({
        where: {
          employeeId,
          tenantId,
          status: 'APPROVED',
          type: 'ANNUAL',
          startDate: { gte: startOfYear },
          endDate: { lte: endOfYear },
        },
        orderBy: { startDate: 'desc' },
      }),
    }
  }
}
