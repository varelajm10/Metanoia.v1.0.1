import { PrismaClient } from '@prisma/client'
import type {
  SchoolAttendanceInput,
  SchoolPaymentInput,
} from '../validations/school'

const prisma = new PrismaClient()

export class SchoolAttendancePaymentsService {
  // ============================================
  // ASISTENCIA
  // ============================================

  static async getAttendance(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      studentId?: string
      date?: string
      status?: string
      startDate?: string
      endDate?: string
    } = {}
  ) {
    const {
      page = 1,
      limit = 100,
      studentId,
      date,
      status,
      startDate,
      endDate,
    } = options
    const skip = (page - 1) * limit

    const where: any = { tenantId }

    if (studentId) {
      where.studentId = studentId
    }

    if (date) {
      where.date = new Date(date)
    }

    if (status) {
      where.status = status
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const [attendance, total] = await Promise.all([
      prisma.schoolAttendance.findMany({
        where,
        skip,
        take: limit,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentCode: true,
              grade: true,
              section: true,
            },
          },
        },
        orderBy: [{ date: 'desc' }, { student: { lastName: 'asc' } }],
      }),
      prisma.schoolAttendance.count({ where }),
    ])

    return {
      attendance,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async getAttendanceById(id: string, tenantId: string) {
    return prisma.schoolAttendance.findFirst({
      where: { id, tenantId },
      include: {
        student: true,
      },
    })
  }

  static async createAttendance(
    data: SchoolAttendanceInput & { tenantId: string }
  ) {
    return prisma.schoolAttendance.create({
      data: {
        ...data,
        date: new Date(data.date),
        tenant: {
          connect: { id: data.tenantId },
        },
        student: {
          connect: { id: data.studentId },
        },
      },
    })
  }

  static async updateAttendance(
    id: string,
    tenantId: string,
    data: Partial<SchoolAttendanceInput>
  ) {
    const updateData: any = { ...data }
    if (data.date) {
      updateData.date = new Date(data.date)
    }

    return prisma.schoolAttendance.updateMany({
      where: { id, tenantId },
      data: updateData,
    })
  }

  static async deleteAttendance(id: string, tenantId: string) {
    return prisma.schoolAttendance.deleteMany({
      where: { id, tenantId },
    })
  }

  // Obtener estadísticas de asistencia
  static async getAttendanceStats(
    tenantId: string,
    startDate: string,
    endDate: string
  ) {
    const where = {
      tenantId,
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    }

    const [total, present, absent, late, excused, sick, byStatus] =
      await Promise.all([
        prisma.schoolAttendance.count({ where }),
        prisma.schoolAttendance.count({
          where: { ...where, status: 'PRESENT' },
        }),
        prisma.schoolAttendance.count({
          where: { ...where, status: 'ABSENT' },
        }),
        prisma.schoolAttendance.count({ where: { ...where, status: 'LATE' } }),
        prisma.schoolAttendance.count({
          where: { ...where, status: 'EXCUSED' },
        }),
        prisma.schoolAttendance.count({ where: { ...where, status: 'SICK' } }),
        prisma.schoolAttendance.groupBy({
          by: ['status'],
          where,
          _count: true,
        }),
      ])

    return {
      total,
      present,
      absent,
      late,
      excused,
      sick,
      byStatus,
      attendanceRate: total > 0 ? (present / total) * 100 : 0,
    }
  }

  // Tomar asistencia por lote (múltiples estudiantes)
  static async bulkCreateAttendance(
    tenantId: string,
    date: string,
    attendanceData: Array<{
      studentId: string
      status: string
      comments?: string
    }>
  ) {
    const data = attendanceData.map(item => ({
      tenantId,
      studentId: item.studentId,
      date: new Date(date),
      status: item.status as any,
      comments: item.comments,
    }))

    return prisma.schoolAttendance.createMany({
      data,
      skipDuplicates: true,
    })
  }

  // ============================================
  // PAGOS
  // ============================================

  static async getPayments(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      studentId?: string
      paymentType?: string
      status?: string
      academicYear?: string
      month?: string
      startDate?: string
      endDate?: string
    } = {}
  ) {
    const {
      page = 1,
      limit = 50,
      studentId,
      paymentType,
      status,
      academicYear,
      month,
      startDate,
      endDate,
    } = options
    const skip = (page - 1) * limit

    const where: any = { tenantId }

    if (studentId) {
      where.studentId = studentId
    }

    if (paymentType) {
      where.paymentType = paymentType
    }

    if (status) {
      where.status = status
    }

    if (academicYear) {
      where.academicYear = academicYear
    }

    if (month) {
      where.month = month
    }

    if (startDate && endDate) {
      where.dueDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const [payments, total] = await Promise.all([
      prisma.schoolPayment.findMany({
        where,
        skip,
        take: limit,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentCode: true,
              grade: true,
              section: true,
            },
          },
        },
        orderBy: {
          dueDate: 'desc',
        },
      }),
      prisma.schoolPayment.count({ where }),
    ])

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async getPaymentById(id: string, tenantId: string) {
    return prisma.schoolPayment.findFirst({
      where: { id, tenantId },
      include: {
        student: {
          include: {
            parents: {
              where: {
                isPrimaryContact: true,
              },
              take: 1,
            },
          },
        },
      },
    })
  }

  static async createPayment(data: SchoolPaymentInput & { tenantId: string }) {
    return prisma.schoolPayment.create({
      data: {
        ...data,
        dueDate: new Date(data.dueDate),
        ...(data.paymentDate && { paymentDate: new Date(data.paymentDate) }),
        tenant: {
          connect: { id: data.tenantId },
        },
        student: {
          connect: { id: data.studentId },
        },
      },
    })
  }

  static async updatePayment(
    id: string,
    tenantId: string,
    data: Partial<SchoolPaymentInput>
  ) {
    const updateData: any = { ...data }
    if (data.dueDate) {
      updateData.dueDate = new Date(data.dueDate)
    }
    if (data.paymentDate) {
      updateData.paymentDate = new Date(data.paymentDate)
    }

    return prisma.schoolPayment.updateMany({
      where: { id, tenantId },
      data: updateData,
    })
  }

  static async deletePayment(id: string, tenantId: string) {
    return prisma.schoolPayment.deleteMany({
      where: { id, tenantId },
    })
  }

  // Obtener estadísticas de pagos
  static async getPaymentStats(
    tenantId: string,
    academicYear: string,
    month?: string
  ) {
    const where: any = { tenantId, academicYear }
    if (month) {
      where.month = month
    }

    const [
      total,
      pending,
      paid,
      partial,
      overdue,
      totalAmount,
      paidAmount,
      pendingAmount,
      byType,
      byStatus,
    ] = await Promise.all([
      prisma.schoolPayment.count({ where }),
      prisma.schoolPayment.count({ where: { ...where, status: 'PENDING' } }),
      prisma.schoolPayment.count({ where: { ...where, status: 'PAID' } }),
      prisma.schoolPayment.count({ where: { ...where, status: 'PARTIAL' } }),
      prisma.schoolPayment.count({ where: { ...where, status: 'OVERDUE' } }),
      prisma.schoolPayment.aggregate({
        where,
        _sum: { amount: true },
      }),
      prisma.schoolPayment.aggregate({
        where: { ...where, status: 'PAID' },
        _sum: { amount: true },
      }),
      prisma.schoolPayment.aggregate({
        where: { ...where, status: { in: ['PENDING', 'PARTIAL', 'OVERDUE'] } },
        _sum: { amount: true },
      }),
      prisma.schoolPayment.groupBy({
        by: ['paymentType'],
        where,
        _count: true,
        _sum: { amount: true },
      }),
      prisma.schoolPayment.groupBy({
        by: ['status'],
        where,
        _count: true,
        _sum: { amount: true },
      }),
    ])

    return {
      total,
      pending,
      paid,
      partial,
      overdue,
      totalAmount: totalAmount._sum.amount || 0,
      paidAmount: paidAmount._sum.amount || 0,
      pendingAmount: pendingAmount._sum.amount || 0,
      byType,
      byStatus,
      collectionRate:
        totalAmount._sum.amount && paidAmount._sum.amount
          ? (Number(paidAmount._sum.amount) / Number(totalAmount._sum.amount)) *
            100
          : 0,
    }
  }

  // Registrar pago
  static async registerPayment(
    paymentId: string,
    tenantId: string,
    paymentData: {
      paymentDate: string
      paymentMethod: string
      transactionId?: string
      receiptNumber?: string
      amount?: number
    }
  ) {
    return prisma.schoolPayment.updateMany({
      where: { id: paymentId, tenantId },
      data: {
        status: 'PAID',
        paymentDate: new Date(paymentData.paymentDate),
        paymentMethod: paymentData.paymentMethod,
        transactionId: paymentData.transactionId,
        receiptNumber: paymentData.receiptNumber,
      },
    })
  }

  // Generar pagos mensuales por lote
  static async generateMonthlyPayments(
    tenantId: string,
    academicYear: string,
    month: string,
    paymentType: string,
    amount: number,
    dueDate: string,
    studentIds: string[]
  ) {
    const data = studentIds.map(studentId => ({
      tenantId,
      studentId,
      paymentType: paymentType as any,
      amount,
      dueDate: new Date(dueDate),
      status: 'PENDING' as any,
      concept: `${paymentType} - ${month} ${academicYear}`,
      academicYear,
      month,
    }))

    return prisma.schoolPayment.createMany({
      data,
      skipDuplicates: true,
    })
  }
}
