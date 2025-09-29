import { PrismaClient } from '@prisma/client'
import type { SchoolTeacherInput } from '../validations/school'

const prisma = new PrismaClient()

export class SchoolTeacherService {
  // Obtener docentes con filtros y paginación
  static async getTeachers(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      search?: string
      status?: string
      department?: string
      employmentType?: string
    } = {}
  ) {
    const { page = 1, limit = 20, search, status, department, employmentType } =
      options

    const skip = (page - 1) * limit

    const where: any = {
      tenantId,
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { teacherCode: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { specialization: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (department) {
      where.department = department
    }

    if (employmentType) {
      where.employmentType = employmentType
    }

    const [teachers, total] = await Promise.all([
      prisma.schoolTeacher.findMany({
        where,
        skip,
        take: limit,
        include: {
          subjects: {
            select: {
              id: true,
              name: true,
              code: true,
              hoursPerWeek: true,
            },
          },
          schedules: {
            include: {
              subject: true,
              section: {
                include: {
                  gradeLevel: true,
                },
              },
            },
            take: 5,
          },
          evaluations: {
            orderBy: {
              evaluationDate: 'desc',
            },
            take: 3,
          },
        },
        orderBy: {
          lastName: 'asc',
        },
      }),
      prisma.schoolTeacher.count({ where }),
    ])

    return {
      teachers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  // Obtener un docente por ID
  static async getTeacherById(id: string, tenantId: string) {
    return prisma.schoolTeacher.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        subjects: {
          include: {
            gradeLevel: true,
          },
        },
        schedules: {
          include: {
            subject: true,
            section: {
              include: {
                gradeLevel: true,
              },
            },
          },
          orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        },
        evaluations: {
          orderBy: {
            evaluationDate: 'desc',
          },
        },
      },
    })
  }

  // Crear un docente
  static async createTeacher(
    data: SchoolTeacherInput & { tenantId: string }
  ) {
    return prisma.schoolTeacher.create({
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

  // Actualizar un docente
  static async updateTeacher(
    id: string,
    tenantId: string,
    data: Partial<SchoolTeacherInput>
  ) {
    return prisma.schoolTeacher.updateMany({
      where: {
        id,
        tenantId,
      },
      data,
    })
  }

  // Eliminar un docente
  static async deleteTeacher(id: string, tenantId: string) {
    return prisma.schoolTeacher.deleteMany({
      where: {
        id,
        tenantId,
      },
    })
  }

  // Obtener estadísticas de docentes
  static async getTeacherStats(tenantId: string) {
    const [
      total,
      active,
      inactive,
      onLeave,
      fullTime,
      partTime,
      byDepartment,
      byEmploymentType,
      avgEvaluation,
    ] = await Promise.all([
      prisma.schoolTeacher.count({
        where: { tenantId },
      }),
      prisma.schoolTeacher.count({
        where: { tenantId, status: 'ACTIVE' },
      }),
      prisma.schoolTeacher.count({
        where: { tenantId, status: 'INACTIVE' },
      }),
      prisma.schoolTeacher.count({
        where: { tenantId, status: 'ON_LEAVE' },
      }),
      prisma.schoolTeacher.count({
        where: { tenantId, employmentType: 'FULL_TIME' },
      }),
      prisma.schoolTeacher.count({
        where: { tenantId, employmentType: 'PART_TIME' },
      }),
      prisma.schoolTeacher.groupBy({
        by: ['department'],
        where: { tenantId, status: 'ACTIVE', department: { not: null } },
        _count: true,
      }),
      prisma.schoolTeacher.groupBy({
        by: ['employmentType'],
        where: { tenantId },
        _count: true,
      }),
      prisma.schoolEvaluation.aggregate({
        where: {
          tenantId,
          evaluationDate: {
            gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
          },
        },
        _avg: {
          overall: true,
        },
      }),
    ])

    return {
      total,
      active,
      inactive,
      onLeave,
      fullTime,
      partTime,
      byDepartment,
      byEmploymentType,
      avgEvaluation: avgEvaluation._avg.overall || 0,
    }
  }

  // Buscar docentes
  static async searchTeachers(tenantId: string, query: string) {
    return prisma.schoolTeacher.findMany({
      where: {
        tenantId,
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { teacherCode: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        teacherCode: true,
        email: true,
        specialization: true,
        status: true,
        photoUrl: true,
      },
    })
  }

  // Obtener horario de un docente
  static async getTeacherSchedule(
    teacherId: string,
    tenantId: string,
    academicYear: string
  ) {
    return prisma.schoolSchedule.findMany({
      where: {
        teacherId,
        tenantId,
        academicYear,
      },
      include: {
        subject: true,
        section: {
          include: {
            gradeLevel: true,
          },
        },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    })
  }
}
