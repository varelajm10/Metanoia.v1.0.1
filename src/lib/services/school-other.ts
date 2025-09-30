import { PrismaClient } from '@prisma/client'
import type {
  SchoolParentInput,
  SchoolDisciplinaryInput,
  SchoolEvaluationInput,
} from '../validations/school'

const prisma = new PrismaClient()

export class SchoolOtherService {
  // ============================================
  // PADRES/TUTORES
  // ============================================

  static async getParents(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      search?: string
      relationship?: string
    } = {}
  ) {
    const { page = 1, limit = 50, search, relationship } = options
    const skip = (page - 1) * limit

    const where: any = { tenantId }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (relationship) {
      where.relationship = relationship
    }

    const [parents, total] = await Promise.all([
      prisma.schoolParent.findMany({
        where,
        skip,
        take: limit,
        include: {
          students: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentCode: true,
              grade: true,
              status: true,
            },
          },
        },
        orderBy: {
          lastName: 'asc',
        },
      }),
      prisma.schoolParent.count({ where }),
    ])

    return {
      parents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async getParentById(id: string, tenantId: string) {
    return prisma.schoolParent.findFirst({
      where: { id, tenantId },
      include: {
        students: {
          include: {
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
            payments: {
              where: {
                status: { in: ['PENDING', 'OVERDUE'] },
              },
              orderBy: {
                dueDate: 'asc',
              },
            },
          },
        },
      },
    })
  }

  static async createParent(data: SchoolParentInput & { tenantId: string }) {
    return prisma.schoolParent.create({
      data: {
        ...data,
        tenant: {
          connect: { id: data.tenantId },
        },
      },
    })
  }

  static async updateParent(
    id: string,
    tenantId: string,
    data: Partial<SchoolParentInput>
  ) {
    return prisma.schoolParent.updateMany({
      where: { id, tenantId },
      data,
    })
  }

  static async deleteParent(id: string, tenantId: string) {
    return prisma.schoolParent.deleteMany({
      where: { id, tenantId },
    })
  }

  // Asociar padre con estudiante
  static async linkParentToStudent(
    parentId: string,
    studentId: string,
    tenantId: string
  ) {
    // Verificar que ambos existen y pertenecen al tenant
    const [parent, student] = await Promise.all([
      prisma.schoolParent.findFirst({
        where: { id: parentId, tenantId },
      }),
      prisma.schoolStudent.findFirst({
        where: { id: studentId, tenantId },
      }),
    ])

    if (!parent || !student) {
      throw new Error('Padre o estudiante no encontrado')
    }

    // Actualizar relación many-to-many
    return prisma.schoolStudent.update({
      where: { id: studentId },
      data: {
        parents: {
          connect: { id: parentId },
        },
      },
    })
  }

  // Desasociar padre de estudiante
  static async unlinkParentFromStudent(
    parentId: string,
    studentId: string,
    tenantId: string
  ) {
    return prisma.schoolStudent.update({
      where: { id: studentId },
      data: {
        parents: {
          disconnect: { id: parentId },
        },
      },
    })
  }

  // ============================================
  // REGISTROS DISCIPLINARIOS
  // ============================================

  static async getDisciplinaryRecords(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      studentId?: string
      incidentType?: string
      severity?: string
      status?: string
      startDate?: string
      endDate?: string
    } = {}
  ) {
    const {
      page = 1,
      limit = 50,
      studentId,
      incidentType,
      severity,
      status,
      startDate,
      endDate,
    } = options
    const skip = (page - 1) * limit

    const where: any = { tenantId }

    if (studentId) {
      where.studentId = studentId
    }

    if (incidentType) {
      where.incidentType = incidentType
    }

    if (severity) {
      where.severity = severity
    }

    if (status) {
      where.status = status
    }

    if (startDate && endDate) {
      where.incidentDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const [records, total] = await Promise.all([
      prisma.schoolDisciplinary.findMany({
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
          incidentDate: 'desc',
        },
      }),
      prisma.schoolDisciplinary.count({ where }),
    ])

    return {
      records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async getDisciplinaryRecordById(id: string, tenantId: string) {
    return prisma.schoolDisciplinary.findFirst({
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

  static async createDisciplinaryRecord(
    data: SchoolDisciplinaryInput & { tenantId: string }
  ) {
    return prisma.schoolDisciplinary.create({
      data: {
        ...data,
        incidentDate: new Date(data.incidentDate),
        ...(data.resolvedDate && {
          resolvedDate: new Date(data.resolvedDate),
        }),
        tenant: {
          connect: { id: data.tenantId },
        },
        student: {
          connect: { id: data.studentId },
        },
      },
    })
  }

  static async updateDisciplinaryRecord(
    id: string,
    tenantId: string,
    data: Partial<SchoolDisciplinaryInput>
  ) {
    const updateData: any = { ...data }
    if (data.incidentDate) {
      updateData.incidentDate = new Date(data.incidentDate)
    }
    if (data.resolvedDate) {
      updateData.resolvedDate = new Date(data.resolvedDate)
    }

    return prisma.schoolDisciplinary.updateMany({
      where: { id, tenantId },
      data: updateData,
    })
  }

  static async deleteDisciplinaryRecord(id: string, tenantId: string) {
    return prisma.schoolDisciplinary.deleteMany({
      where: { id, tenantId },
    })
  }

  // Obtener estadísticas disciplinarias
  static async getDisciplinaryStats(
    tenantId: string,
    startDate: string,
    endDate: string
  ) {
    const where = {
      tenantId,
      incidentDate: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    }

    const [total, open, resolved, byType, bySeverity, byStatus, topStudents] =
      await Promise.all([
        prisma.schoolDisciplinary.count({ where }),
        prisma.schoolDisciplinary.count({
          where: { ...where, status: { in: ['OPEN', 'IN_REVIEW'] } },
        }),
        prisma.schoolDisciplinary.count({
          where: { ...where, status: { in: ['RESOLVED', 'CLOSED'] } },
        }),
        prisma.schoolDisciplinary.groupBy({
          by: ['incidentType'],
          where,
          _count: true,
        }),
        prisma.schoolDisciplinary.groupBy({
          by: ['severity'],
          where,
          _count: true,
        }),
        prisma.schoolDisciplinary.groupBy({
          by: ['status'],
          where,
          _count: true,
        }),
        prisma.schoolDisciplinary.groupBy({
          by: ['studentId'],
          where,
          _count: true,
          orderBy: {
            _count: {
              studentId: 'desc',
            },
          },
          take: 10,
        }),
      ])

    return {
      total,
      open,
      resolved,
      byType,
      bySeverity,
      byStatus,
      topStudents,
    }
  }

  // ============================================
  // EVALUACIONES DE DOCENTES
  // ============================================

  static async getEvaluations(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      teacherId?: string
      evaluationType?: string
      startDate?: string
      endDate?: string
    } = {}
  ) {
    const {
      page = 1,
      limit = 50,
      teacherId,
      evaluationType,
      startDate,
      endDate,
    } = options
    const skip = (page - 1) * limit

    const where: any = { tenantId }

    if (teacherId) {
      where.teacherId = teacherId
    }

    if (evaluationType) {
      where.evaluationType = evaluationType
    }

    if (startDate && endDate) {
      where.evaluationDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const [evaluations, total] = await Promise.all([
      prisma.schoolEvaluation.findMany({
        where,
        skip,
        take: limit,
        include: {
          teacher: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              teacherCode: true,
              specialization: true,
              department: true,
            },
          },
        },
        orderBy: {
          evaluationDate: 'desc',
        },
      }),
      prisma.schoolEvaluation.count({ where }),
    ])

    return {
      evaluations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async getEvaluationById(id: string, tenantId: string) {
    return prisma.schoolEvaluation.findFirst({
      where: { id, tenantId },
      include: {
        teacher: {
          include: {
            subjects: true,
            schedules: {
              include: {
                section: {
                  include: {
                    gradeLevel: true,
                  },
                },
              },
            },
          },
        },
      },
    })
  }

  static async createEvaluation(
    data: SchoolEvaluationInput & { tenantId: string }
  ) {
    return prisma.schoolEvaluation.create({
      data: {
        ...data,
        evaluationDate: new Date(data.evaluationDate),
        tenant: {
          connect: { id: data.tenantId },
        },
        teacher: {
          connect: { id: data.teacherId },
        },
      },
    })
  }

  static async updateEvaluation(
    id: string,
    tenantId: string,
    data: Partial<SchoolEvaluationInput>
  ) {
    const updateData: any = { ...data }
    if (data.evaluationDate) {
      updateData.evaluationDate = new Date(data.evaluationDate)
    }

    return prisma.schoolEvaluation.updateMany({
      where: { id, tenantId },
      data: updateData,
    })
  }

  static async deleteEvaluation(id: string, tenantId: string) {
    return prisma.schoolEvaluation.deleteMany({
      where: { id, tenantId },
    })
  }

  // Obtener estadísticas de evaluaciones
  static async getEvaluationStats(
    tenantId: string,
    startDate: string,
    endDate: string
  ) {
    const where = {
      tenantId,
      evaluationDate: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    }

    const [total, avgScores, byType] = await Promise.all([
      prisma.schoolEvaluation.count({ where }),
      prisma.schoolEvaluation.aggregate({
        where,
        _avg: {
          teaching: true,
          planning: true,
          discipline: true,
          communication: true,
          overall: true,
        },
      }),
      prisma.schoolEvaluation.groupBy({
        by: ['evaluationType'],
        where,
        _count: true,
        _avg: {
          overall: true,
        },
      }),
    ])

    return {
      total,
      avgScores: {
        teaching: avgScores._avg.teaching || 0,
        planning: avgScores._avg.planning || 0,
        discipline: avgScores._avg.discipline || 0,
        communication: avgScores._avg.communication || 0,
        overall: avgScores._avg.overall || 0,
      },
      byType,
    }
  }

  // Obtener historial de evaluaciones de un docente
  static async getTeacherEvaluationHistory(
    teacherId: string,
    tenantId: string
  ) {
    return prisma.schoolEvaluation.findMany({
      where: {
        teacherId,
        tenantId,
      },
      orderBy: {
        evaluationDate: 'desc',
      },
    })
  }
}
