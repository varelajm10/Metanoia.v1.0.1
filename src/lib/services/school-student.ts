import { PrismaClient } from '@prisma/client'
import type { SchoolStudentInput } from '../validations/school'

const prisma = new PrismaClient()

export class SchoolStudentService {
  // Obtener estudiantes con filtros y paginación
  static async getStudents(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      search?: string
      status?: string
      grade?: string
      section?: string
    } = {}
  ) {
    const { page = 1, limit = 20, search, status, grade, section } = options

    const skip = (page - 1) * limit

    const where: any = {
      tenantId,
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { studentCode: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (grade) {
      where.grade = grade
    }

    if (section) {
      where.section = section
    }

    const [students, total] = await Promise.all([
      prisma.schoolStudent.findMany({
        where,
        skip,
        take: limit,
        include: {
          parents: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              relationship: true,
              email: true,
              phone: true,
              isPrimaryContact: true,
            },
          },
          enrollments: {
            where: {
              status: 'ENROLLED',
            },
            include: {
              section: {
                include: {
                  gradeLevel: true,
                },
              },
            },
            take: 1,
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
        orderBy: {
          lastName: 'asc',
        },
      }),
      prisma.schoolStudent.count({ where }),
    ])

    return {
      students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  // Obtener un estudiante por ID
  static async getStudentById(id: string, tenantId: string) {
    return prisma.schoolStudent.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        parents: true,
        enrollments: {
          include: {
            section: {
              include: {
                gradeLevel: true,
              },
            },
          },
          orderBy: {
            enrollmentDate: 'desc',
          },
        },
        grades: {
          include: {
            subject: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        attendance: {
          orderBy: {
            date: 'desc',
          },
          take: 30,
        },
        payments: {
          orderBy: {
            dueDate: 'desc',
          },
          take: 10,
        },
        disciplinary: {
          orderBy: {
            incidentDate: 'desc',
          },
          take: 5,
        },
      },
    })
  }

  // Crear un estudiante
  static async createStudent(
    data: SchoolStudentInput & { tenantId: string }
  ) {
    return prisma.schoolStudent.create({
      data: {
        ...data,
        tenant: {
          connect: {
            id: data.tenantId,
          },
        },
      },
    })
  }

  // Actualizar un estudiante
  static async updateStudent(
    id: string,
    tenantId: string,
    data: Partial<SchoolStudentInput>
  ) {
    return prisma.schoolStudent.updateMany({
      where: {
        id,
        tenantId,
      },
      data,
    })
  }

  // Eliminar un estudiante
  static async deleteStudent(id: string, tenantId: string) {
    return prisma.schoolStudent.deleteMany({
      where: {
        id,
        tenantId,
      },
    })
  }

  // Obtener estadísticas de estudiantes
  static async getStudentStats(tenantId: string) {
    const [
      total,
      active,
      inactive,
      graduated,
      transferred,
      byGrade,
      byStatus,
      recentEnrollments,
    ] = await Promise.all([
      prisma.schoolStudent.count({
        where: { tenantId },
      }),
      prisma.schoolStudent.count({
        where: { tenantId, status: 'ACTIVE' },
      }),
      prisma.schoolStudent.count({
        where: { tenantId, status: 'INACTIVE' },
      }),
      prisma.schoolStudent.count({
        where: { tenantId, status: 'GRADUATED' },
      }),
      prisma.schoolStudent.count({
        where: { tenantId, status: 'TRANSFERRED' },
      }),
      prisma.schoolStudent.groupBy({
        by: ['grade'],
        where: { tenantId, status: 'ACTIVE' },
        _count: true,
      }),
      prisma.schoolStudent.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: true,
      }),
      prisma.schoolStudent.count({
        where: {
          tenantId,
          enrollmentDate: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      }),
    ])

    return {
      total,
      active,
      inactive,
      graduated,
      transferred,
      byGrade,
      byStatus,
      recentEnrollments,
    }
  }

  // Buscar estudiantes
  static async searchStudents(tenantId: string, query: string) {
    return prisma.schoolStudent.findMany({
      where: {
        tenantId,
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { studentCode: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        studentCode: true,
        email: true,
        grade: true,
        section: true,
        status: true,
        photoUrl: true,
      },
    })
  }
}
