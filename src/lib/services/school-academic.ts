import { PrismaClient } from '@prisma/client'
import type {
  SchoolGradeLevelInput,
  SchoolSectionInput,
  SchoolSubjectInput,
  SchoolScheduleInput,
  SchoolEnrollmentInput,
  SchoolGradeInput,
} from '../validations/school'

const prisma = new PrismaClient()

export class SchoolAcademicService {
  // ============================================
  // GRADOS Y NIVELES
  // ============================================

  static async getGradeLevels(tenantId: string) {
    return prisma.schoolGradeLevel.findMany({
      where: { tenantId },
      include: {
        sections: {
          where: {
            academicYear: new Date().getFullYear().toString(),
          },
        },
        subjects: true,
      },
      orderBy: {
        code: 'asc',
      },
    })
  }

  static async getGradeLevelById(id: string, tenantId: string) {
    return prisma.schoolGradeLevel.findFirst({
      where: { id, tenantId },
      include: {
        sections: true,
        subjects: true,
      },
    })
  }

  static async createGradeLevel(
    data: SchoolGradeLevelInput & { tenantId: string }
  ) {
    return prisma.schoolGradeLevel.create({
      data: {
        ...data,
        tenant: {
          connect: { id: data.tenantId },
        },
      },
    })
  }

  static async updateGradeLevel(
    id: string,
    tenantId: string,
    data: Partial<SchoolGradeLevelInput>
  ) {
    return prisma.schoolGradeLevel.updateMany({
      where: { id, tenantId },
      data,
    })
  }

  static async deleteGradeLevel(id: string, tenantId: string) {
    return prisma.schoolGradeLevel.deleteMany({
      where: { id, tenantId },
    })
  }

  // ============================================
  // SECCIONES
  // ============================================

  static async getSections(
    tenantId: string,
    options: {
      academicYear?: string
      gradeLevelId?: string
    } = {}
  ) {
    const where: any = { tenantId }

    if (options.academicYear) {
      where.academicYear = options.academicYear
    }

    if (options.gradeLevelId) {
      where.gradeLevelId = options.gradeLevelId
    }

    return prisma.schoolSection.findMany({
      where,
      include: {
        gradeLevel: true,
        enrollments: {
          where: {
            status: 'ENROLLED',
          },
        },
        schedules: {
          include: {
            subject: true,
            teacher: true,
          },
        },
      },
      orderBy: [{ gradeLevel: { code: 'asc' } }, { name: 'asc' }],
    })
  }

  static async getSectionById(id: string, tenantId: string) {
    return prisma.schoolSection.findFirst({
      where: { id, tenantId },
      include: {
        gradeLevel: true,
        enrollments: {
          include: {
            student: true,
          },
        },
        schedules: {
          include: {
            subject: true,
            teacher: true,
          },
          orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        },
      },
    })
  }

  static async createSection(data: SchoolSectionInput & { tenantId: string }) {
    return prisma.schoolSection.create({
      data: {
        ...data,
        tenant: {
          connect: { id: data.tenantId },
        },
        gradeLevel: {
          connect: { id: data.gradeLevelId },
        },
      },
    })
  }

  static async updateSection(
    id: string,
    tenantId: string,
    data: Partial<SchoolSectionInput>
  ) {
    const updateData: any = { ...data }
    if (data.gradeLevelId) {
      updateData.gradeLevel = {
        connect: { id: data.gradeLevelId },
      }
      delete updateData.gradeLevelId
    }

    return prisma.schoolSection.updateMany({
      where: { id, tenantId },
      data: updateData,
    })
  }

  static async deleteSection(id: string, tenantId: string) {
    return prisma.schoolSection.deleteMany({
      where: { id, tenantId },
    })
  }

  // ============================================
  // MATERIAS/ASIGNATURAS
  // ============================================

  static async getSubjects(
    tenantId: string,
    options: {
      gradeLevelId?: string
      teacherId?: string
    } = {}
  ) {
    const where: any = { tenantId }

    if (options.gradeLevelId) {
      where.gradeLevelId = options.gradeLevelId
    }

    if (options.teacherId) {
      where.teacherId = options.teacherId
    }

    return prisma.schoolSubject.findMany({
      where,
      include: {
        gradeLevel: true,
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            specialization: true,
          },
        },
        schedules: true,
      },
      orderBy: {
        name: 'asc',
      },
    })
  }

  static async getSubjectById(id: string, tenantId: string) {
    return prisma.schoolSubject.findFirst({
      where: { id, tenantId },
      include: {
        gradeLevel: true,
        teacher: true,
        schedules: {
          include: {
            section: {
              include: {
                gradeLevel: true,
              },
            },
          },
        },
        grades: {
          include: {
            student: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    })
  }

  static async createSubject(data: SchoolSubjectInput & { tenantId: string }) {
    return prisma.schoolSubject.create({
      data: {
        ...data,
        tenant: {
          connect: { id: data.tenantId },
        },
        ...(data.gradeLevelId && {
          gradeLevel: {
            connect: { id: data.gradeLevelId },
          },
        }),
        ...(data.teacherId && {
          teacher: {
            connect: { id: data.teacherId },
          },
        }),
      },
    })
  }

  static async updateSubject(
    id: string,
    tenantId: string,
    data: Partial<SchoolSubjectInput>
  ) {
    return prisma.schoolSubject.updateMany({
      where: { id, tenantId },
      data,
    })
  }

  static async deleteSubject(id: string, tenantId: string) {
    return prisma.schoolSubject.deleteMany({
      where: { id, tenantId },
    })
  }

  // ============================================
  // HORARIOS
  // ============================================

  static async getSchedules(
    tenantId: string,
    options: {
      academicYear?: string
      sectionId?: string
      teacherId?: string
      dayOfWeek?: number
    } = {}
  ) {
    const where: any = { tenantId }

    if (options.academicYear) {
      where.academicYear = options.academicYear
    }

    if (options.sectionId) {
      where.sectionId = options.sectionId
    }

    if (options.teacherId) {
      where.teacherId = options.teacherId
    }

    if (options.dayOfWeek !== undefined) {
      where.dayOfWeek = options.dayOfWeek
    }

    return prisma.schoolSchedule.findMany({
      where,
      include: {
        subject: true,
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        section: {
          include: {
            gradeLevel: true,
          },
        },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    })
  }

  static async getScheduleById(id: string, tenantId: string) {
    return prisma.schoolSchedule.findFirst({
      where: { id, tenantId },
      include: {
        subject: true,
        teacher: true,
        section: {
          include: {
            gradeLevel: true,
          },
        },
      },
    })
  }

  static async createSchedule(
    data: SchoolScheduleInput & { tenantId: string }
  ) {
    return prisma.schoolSchedule.create({
      data: {
        ...data,
        tenant: {
          connect: { id: data.tenantId },
        },
        subject: {
          connect: { id: data.subjectId },
        },
        teacher: {
          connect: { id: data.teacherId },
        },
        section: {
          connect: { id: data.sectionId },
        },
      },
    })
  }

  static async updateSchedule(
    id: string,
    tenantId: string,
    data: Partial<SchoolScheduleInput>
  ) {
    return prisma.schoolSchedule.updateMany({
      where: { id, tenantId },
      data,
    })
  }

  static async deleteSchedule(id: string, tenantId: string) {
    return prisma.schoolSchedule.deleteMany({
      where: { id, tenantId },
    })
  }

  // ============================================
  // MATRÍCULAS
  // ============================================

  static async getEnrollments(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      academicYear?: string
      studentId?: string
      sectionId?: string
      status?: string
    } = {}
  ) {
    const {
      page = 1,
      limit = 50,
      academicYear,
      studentId,
      sectionId,
      status,
    } = options
    const skip = (page - 1) * limit

    const where: any = { tenantId }

    if (academicYear) {
      where.academicYear = academicYear
    }

    if (studentId) {
      where.studentId = studentId
    }

    if (sectionId) {
      where.sectionId = sectionId
    }

    if (status) {
      where.status = status
    }

    const [enrollments, total] = await Promise.all([
      prisma.schoolEnrollment.findMany({
        where,
        skip,
        take: limit,
        include: {
          student: true,
          section: {
            include: {
              gradeLevel: true,
            },
          },
        },
        orderBy: {
          enrollmentDate: 'desc',
        },
      }),
      prisma.schoolEnrollment.count({ where }),
    ])

    return {
      enrollments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async getEnrollmentById(id: string, tenantId: string) {
    return prisma.schoolEnrollment.findFirst({
      where: { id, tenantId },
      include: {
        student: true,
        section: {
          include: {
            gradeLevel: true,
          },
        },
      },
    })
  }

  static async createEnrollment(
    data: SchoolEnrollmentInput & { tenantId: string }
  ) {
    return prisma.schoolEnrollment.create({
      data: {
        ...data,
        tenant: {
          connect: { id: data.tenantId },
        },
        student: {
          connect: { id: data.studentId },
        },
        section: {
          connect: { id: data.sectionId },
        },
      },
    })
  }

  static async updateEnrollment(
    id: string,
    tenantId: string,
    data: Partial<SchoolEnrollmentInput>
  ) {
    return prisma.schoolEnrollment.updateMany({
      where: { id, tenantId },
      data,
    })
  }

  static async deleteEnrollment(id: string, tenantId: string) {
    return prisma.schoolEnrollment.deleteMany({
      where: { id, tenantId },
    })
  }

  // ============================================
  // CALIFICACIONES
  // ============================================

  static async getGrades(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      studentId?: string
      subjectId?: string
      academicYear?: string
      term?: string
    } = {}
  ) {
    const {
      page = 1,
      limit = 100,
      studentId,
      subjectId,
      academicYear,
      term,
    } = options
    const skip = (page - 1) * limit

    const where: any = { tenantId }

    if (studentId) {
      where.studentId = studentId
    }

    if (subjectId) {
      where.subjectId = subjectId
    }

    if (academicYear) {
      where.academicYear = academicYear
    }

    if (term) {
      where.term = term
    }

    const [grades, total] = await Promise.all([
      prisma.schoolGrade.findMany({
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
            },
          },
          subject: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.schoolGrade.count({ where }),
    ])

    return {
      grades,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async getGradeById(id: string, tenantId: string) {
    return prisma.schoolGrade.findFirst({
      where: { id, tenantId },
      include: {
        student: true,
        subject: true,
      },
    })
  }

  static async createGrade(data: SchoolGradeInput & { tenantId: string }) {
    return prisma.schoolGrade.create({
      data: {
        ...data,
        tenant: {
          connect: { id: data.tenantId },
        },
        student: {
          connect: { id: data.studentId },
        },
        subject: {
          connect: { id: data.subjectId },
        },
      },
    })
  }

  static async updateGrade(
    id: string,
    tenantId: string,
    data: Partial<SchoolGradeInput>
  ) {
    return prisma.schoolGrade.updateMany({
      where: { id, tenantId },
      data,
    })
  }

  static async deleteGrade(id: string, tenantId: string) {
    return prisma.schoolGrade.deleteMany({
      where: { id, tenantId },
    })
  }

  // Obtener boletín de calificaciones de un estudiante
  static async getStudentReportCard(
    studentId: string,
    tenantId: string,
    academicYear: string,
    term?: string
  ) {
    const where: any = {
      studentId,
      tenantId,
      academicYear,
    }

    if (term) {
      where.term = term
    }

    return prisma.schoolGrade.findMany({
      where,
      include: {
        subject: {
          include: {
            teacher: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        subject: {
          name: 'asc',
        },
      },
    })
  }
}
