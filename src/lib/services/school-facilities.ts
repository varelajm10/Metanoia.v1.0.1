import { PrismaClient } from '@prisma/client'
import type {
  SchoolLibraryBookInput,
  SchoolLibraryLoanInput,
  SchoolTransportRouteInput,
  SchoolTransportAssignmentInput,
  SchoolCafeteriaMenuInput,
  SchoolCafeteriaAssignmentInput,
} from '../validations/school'

const prisma = new PrismaClient()

export class SchoolFacilitiesService {
  // ============================================
  // BIBLIOTECA - LIBROS
  // ============================================

  static async getLibraryBooks(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      search?: string
      category?: string
      status?: string
    } = {}
  ) {
    const { page = 1, limit = 50, search, category, status } = options
    const skip = (page - 1) * limit

    const where: any = { tenantId }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { isbn: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category) {
      where.category = category
    }

    if (status) {
      where.status = status
    }

    const [books, total] = await Promise.all([
      prisma.schoolLibraryBook.findMany({
        where,
        skip,
        take: limit,
        include: {
          loans: {
            where: {
              status: 'ACTIVE',
            },
            include: {
              student: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  studentCode: true,
                },
              },
            },
          },
        },
        orderBy: {
          title: 'asc',
        },
      }),
      prisma.schoolLibraryBook.count({ where }),
    ])

    return {
      books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async getLibraryBookById(id: string, tenantId: string) {
    return prisma.schoolLibraryBook.findFirst({
      where: { id, tenantId },
      include: {
        loans: {
          include: {
            student: true,
          },
          orderBy: {
            loanDate: 'desc',
          },
        },
      },
    })
  }

  static async createLibraryBook(
    data: SchoolLibraryBookInput & { tenantId: string }
  ) {
    return prisma.schoolLibraryBook.create({
      data: {
        ...data,
        tenant: {
          connect: { id: data.tenantId },
        },
      },
    })
  }

  static async updateLibraryBook(
    id: string,
    tenantId: string,
    data: Partial<SchoolLibraryBookInput>
  ) {
    return prisma.schoolLibraryBook.updateMany({
      where: { id, tenantId },
      data,
    })
  }

  static async deleteLibraryBook(id: string, tenantId: string) {
    return prisma.schoolLibraryBook.deleteMany({
      where: { id, tenantId },
    })
  }

  // ============================================
  // BIBLIOTECA - PRÉSTAMOS
  // ============================================

  static async getLibraryLoans(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      studentId?: string
      bookId?: string
      status?: string
    } = {}
  ) {
    const { page = 1, limit = 50, studentId, bookId, status } = options
    const skip = (page - 1) * limit

    const where: any = { tenantId }

    if (studentId) {
      where.studentId = studentId
    }

    if (bookId) {
      where.bookId = bookId
    }

    if (status) {
      where.status = status
    }

    const [loans, total] = await Promise.all([
      prisma.schoolLibraryLoan.findMany({
        where,
        skip,
        take: limit,
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              isbn: true,
            },
          },
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentCode: true,
              grade: true,
            },
          },
        },
        orderBy: {
          loanDate: 'desc',
        },
      }),
      prisma.schoolLibraryLoan.count({ where }),
    ])

    return {
      loans,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async getLibraryLoanById(id: string, tenantId: string) {
    return prisma.schoolLibraryLoan.findFirst({
      where: { id, tenantId },
      include: {
        book: true,
        student: true,
      },
    })
  }

  static async createLibraryLoan(
    data: SchoolLibraryLoanInput & { tenantId: string }
  ) {
    // Verificar disponibilidad del libro
    const book = await prisma.schoolLibraryBook.findFirst({
      where: { id: data.bookId, tenantId: data.tenantId },
    })

    if (!book || book.availableCopies <= 0) {
      throw new Error('El libro no está disponible para préstamo')
    }

    // Crear préstamo y actualizar copias disponibles
    const [loan] = await prisma.$transaction([
      prisma.schoolLibraryLoan.create({
        data: {
          ...data,
          loanDate: data.loanDate ? new Date(data.loanDate) : new Date(),
          dueDate: new Date(data.dueDate),
          tenant: {
            connect: { id: data.tenantId },
          },
          book: {
            connect: { id: data.bookId },
          },
          student: {
            connect: { id: data.studentId },
          },
        },
      }),
      prisma.schoolLibraryBook.update({
        where: { id: data.bookId },
        data: {
          availableCopies: { decrement: 1 },
          status: book.availableCopies - 1 === 0 ? 'CHECKED_OUT' : book.status,
        },
      }),
    ])

    return loan
  }

  static async updateLibraryLoan(
    id: string,
    tenantId: string,
    data: Partial<SchoolLibraryLoanInput>
  ) {
    const updateData: any = { ...data }
    if (data.loanDate) {
      updateData.loanDate = new Date(data.loanDate)
    }
    if (data.dueDate) {
      updateData.dueDate = new Date(data.dueDate)
    }

    return prisma.schoolLibraryLoan.updateMany({
      where: { id, tenantId },
      data: updateData,
    })
  }

  static async deleteLibraryLoan(id: string, tenantId: string) {
    return prisma.schoolLibraryLoan.deleteMany({
      where: { id, tenantId },
    })
  }

  // Retornar libro
  static async returnBook(loanId: string, tenantId: string) {
    const loan = await prisma.schoolLibraryLoan.findFirst({
      where: { id: loanId, tenantId },
      include: { book: true },
    })

    if (!loan) {
      throw new Error('Préstamo no encontrado')
    }

    return prisma.$transaction([
      prisma.schoolLibraryLoan.update({
        where: { id: loanId },
        data: {
          status: 'RETURNED',
          returnDate: new Date(),
        },
      }),
      prisma.schoolLibraryBook.update({
        where: { id: loan.bookId },
        data: {
          availableCopies: { increment: 1 },
          status:
            loan.book.availableCopies + 1 > 0 ? 'AVAILABLE' : loan.book.status,
        },
      }),
    ])
  }

  // ============================================
  // TRANSPORTE - RUTAS
  // ============================================

  static async getTransportRoutes(
    tenantId: string,
    options: {
      status?: string
    } = {}
  ) {
    const where: any = { tenantId }

    if (options.status) {
      where.status = options.status
    }

    return prisma.schoolTransportRoute.findMany({
      where,
      include: {
        students: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                studentCode: true,
                grade: true,
              },
            },
          },
        },
      },
      orderBy: {
        routeName: 'asc',
      },
    })
  }

  static async getTransportRouteById(id: string, tenantId: string) {
    return prisma.schoolTransportRoute.findFirst({
      where: { id, tenantId },
      include: {
        students: {
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
        },
      },
    })
  }

  static async createTransportRoute(
    data: SchoolTransportRouteInput & { tenantId: string }
  ) {
    return prisma.schoolTransportRoute.create({
      data: {
        ...data,
        tenant: {
          connect: { id: data.tenantId },
        },
      },
    })
  }

  static async updateTransportRoute(
    id: string,
    tenantId: string,
    data: Partial<SchoolTransportRouteInput>
  ) {
    return prisma.schoolTransportRoute.updateMany({
      where: { id, tenantId },
      data,
    })
  }

  static async deleteTransportRoute(id: string, tenantId: string) {
    return prisma.schoolTransportRoute.deleteMany({
      where: { id, tenantId },
    })
  }

  // ============================================
  // TRANSPORTE - ASIGNACIONES
  // ============================================

  static async getTransportAssignments(
    tenantId: string,
    options: {
      routeId?: string
      studentId?: string
      status?: string
    } = {}
  ) {
    const where: any = { tenantId }

    if (options.routeId) {
      where.routeId = options.routeId
    }

    if (options.studentId) {
      where.studentId = options.studentId
    }

    if (options.status) {
      where.status = options.status
    }

    return prisma.schoolTransportAssignment.findMany({
      where,
      include: {
        route: true,
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
      orderBy: {
        pickupTime: 'asc',
      },
    })
  }

  static async getTransportAssignmentById(id: string, tenantId: string) {
    return prisma.schoolTransportAssignment.findFirst({
      where: { id, tenantId },
      include: {
        route: true,
        student: {
          include: {
            parents: true,
          },
        },
      },
    })
  }

  static async createTransportAssignment(
    data: SchoolTransportAssignmentInput & { tenantId: string }
  ) {
    return prisma.schoolTransportAssignment.create({
      data: {
        ...data,
        tenant: {
          connect: { id: data.tenantId },
        },
        route: {
          connect: { id: data.routeId },
        },
        student: {
          connect: { id: data.studentId },
        },
      },
    })
  }

  static async updateTransportAssignment(
    id: string,
    tenantId: string,
    data: Partial<SchoolTransportAssignmentInput>
  ) {
    return prisma.schoolTransportAssignment.updateMany({
      where: { id, tenantId },
      data,
    })
  }

  static async deleteTransportAssignment(id: string, tenantId: string) {
    return prisma.schoolTransportAssignment.deleteMany({
      where: { id, tenantId },
    })
  }

  // ============================================
  // COMEDOR - MENÚS
  // ============================================

  static async getCafeteriaMenus(
    tenantId: string,
    options: {
      startDate?: string
      endDate?: string
      mealType?: string
    } = {}
  ) {
    const where: any = { tenantId }

    if (options.startDate && options.endDate) {
      where.date = {
        gte: new Date(options.startDate),
        lte: new Date(options.endDate),
      }
    }

    if (options.mealType) {
      where.mealType = options.mealType
    }

    return prisma.schoolCafeteriaMenu.findMany({
      where,
      orderBy: [{ date: 'asc' }, { mealType: 'asc' }],
    })
  }

  static async getCafeteriaMenuById(id: string, tenantId: string) {
    return prisma.schoolCafeteriaMenu.findFirst({
      where: { id, tenantId },
    })
  }

  static async createCafeteriaMenu(
    data: SchoolCafeteriaMenuInput & { tenantId: string }
  ) {
    return prisma.schoolCafeteriaMenu.create({
      data: {
        ...data,
        date: new Date(data.date),
        tenant: {
          connect: { id: data.tenantId },
        },
      },
    })
  }

  static async updateCafeteriaMenu(
    id: string,
    tenantId: string,
    data: Partial<SchoolCafeteriaMenuInput>
  ) {
    const updateData: any = { ...data }
    if (data.date) {
      updateData.date = new Date(data.date)
    }

    return prisma.schoolCafeteriaMenu.updateMany({
      where: { id, tenantId },
      data: updateData,
    })
  }

  static async deleteCafeteriaMenu(id: string, tenantId: string) {
    return prisma.schoolCafeteriaMenu.deleteMany({
      where: { id, tenantId },
    })
  }

  // ============================================
  // COMEDOR - ASIGNACIONES
  // ============================================

  static async getCafeteriaAssignments(
    tenantId: string,
    options: {
      studentId?: string
      plan?: string
      status?: string
    } = {}
  ) {
    const where: any = { tenantId }

    if (options.studentId) {
      where.studentId = options.studentId
    }

    if (options.plan) {
      where.plan = options.plan
    }

    if (options.status) {
      where.status = options.status
    }

    return prisma.schoolCafeteriaAssignment.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentCode: true,
            grade: true,
            allergies: true,
          },
        },
      },
      orderBy: {
        student: {
          lastName: 'asc',
        },
      },
    })
  }

  static async getCafeteriaAssignmentById(id: string, tenantId: string) {
    return prisma.schoolCafeteriaAssignment.findFirst({
      where: { id, tenantId },
      include: {
        student: {
          include: {
            parents: true,
          },
        },
      },
    })
  }

  static async createCafeteriaAssignment(
    data: SchoolCafeteriaAssignmentInput & { tenantId: string }
  ) {
    return prisma.schoolCafeteriaAssignment.create({
      data: {
        ...data,
        tenant: {
          connect: { id: data.tenantId },
        },
        student: {
          connect: { id: data.studentId },
        },
      },
    })
  }

  static async updateCafeteriaAssignment(
    id: string,
    tenantId: string,
    data: Partial<SchoolCafeteriaAssignmentInput>
  ) {
    return prisma.schoolCafeteriaAssignment.updateMany({
      where: { id, tenantId },
      data,
    })
  }

  static async deleteCafeteriaAssignment(id: string, tenantId: string) {
    return prisma.schoolCafeteriaAssignment.deleteMany({
      where: { id, tenantId },
    })
  }
}
