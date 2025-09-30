import { PrismaClient } from '@prisma/client'
import {
  CreateEmployeeInput,
  UpdateEmployeeInput,
} from '@/lib/validations/employee'

export class EmployeeService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Crea un nuevo empleado en el sistema
   * @param data - Datos del empleado a crear, incluyendo tenantId
   * @returns Promise con el empleado creado y sus relaciones
   * @throws Error si el email ya existe o hay problemas de validación
   */
  async createEmployee(data: CreateEmployeeInput & { tenantId: string }) {
    try {
      // Generar número de empleado si no se proporciona
      if (!data.employeeNumber) {
        const lastEmployee = await this.prisma.employee.findFirst({
          where: { tenantId: data.tenantId },
          orderBy: { employeeNumber: 'desc' },
        })

        const nextNumber = lastEmployee
          ? parseInt(lastEmployee.employeeNumber) + 1
          : 1000

        data.employeeNumber = nextNumber.toString().padStart(4, '0')
      }

      // Verificar que el email no esté en uso
      const existingEmployee = await this.prisma.employee.findFirst({
        where: {
          email: data.email,
          tenantId: data.tenantId,
        },
      })

      if (existingEmployee) {
        throw new Error('Ya existe un empleado con este email')
      }

      return await this.prisma.employee.create({
        data: {
          ...data,
          hireDate: new Date(data.hireDate),
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          terminationDate: data.terminationDate
            ? new Date(data.terminationDate)
            : null,
        },
        include: {
          manager: true,
          subordinates: true,
          payrolls: true,
          vacations: true,
          performances: true,
        },
      })
    } catch (error) {
      console.error('Error en createEmployee:', {
        error: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined,
        data: {
          email: data.email,
          employeeNumber: data.employeeNumber,
          tenantId: data.tenantId,
        },
      })
      throw error
    }
  }

  /**
   * Obtiene empleados con filtros y paginación
   * @param tenantId - ID del tenant
   * @param options - Opciones de filtrado y paginación
   * @param options.page - Número de página
   * @param options.limit - Límite de resultados por página
   * @param options.search - Término de búsqueda (nombre, email, número de empleado)
   * @param options.department - Filtro por departamento
   * @param options.status - Filtro por estado del empleado
   * @returns Promise con lista paginada de empleados y metadatos
   */
  async getEmployees(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      search?: string
      department?: string
      status?: string
    } = {}
  ) {
    const { page = 1, limit = 10, search, department, status } = options

    const where: any = { tenantId }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { employeeNumber: { contains: search } },
      ]
    }

    if (department) {
      where.department = department
    }

    if (status) {
      where.status = status
    }

    const [employees, total] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        include: {
          manager: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              employeeNumber: true,
            },
          },
          _count: {
            select: {
              subordinates: true,
              payrolls: true,
              vacations: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.employee.count({ where }),
    ])

    return {
      employees,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async getEmployeeById(id: string, tenantId: string) {
    return await this.prisma.employee.findFirst({
      where: { id, tenantId },
      include: {
        manager: true,
        subordinates: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeNumber: true,
            position: true,
            department: true,
          },
        },
        payrolls: {
          orderBy: { period: 'desc' },
          take: 12, // Últimos 12 períodos
        },
        vacations: {
          orderBy: { startDate: 'desc' },
          take: 10, // Últimas 10 vacaciones
        },
        performances: {
          orderBy: { createdAt: 'desc' },
          take: 5, // Últimas 5 evaluaciones
        },
        attendance: {
          orderBy: { date: 'desc' },
          take: 30, // Últimos 30 días
        },
      },
    })
  }

  async updateEmployee(
    id: string,
    data: UpdateEmployeeInput,
    tenantId: string
  ) {
    // Verificar que el empleado existe
    const existingEmployee = await this.prisma.employee.findFirst({
      where: { id, tenantId },
    })

    if (!existingEmployee) {
      throw new Error('Empleado no encontrado')
    }

    // Verificar email único si se está actualizando
    if (data.email && data.email !== existingEmployee.email) {
      const emailExists = await this.prisma.employee.findFirst({
        where: {
          email: data.email,
          tenantId,
          id: { not: id },
        },
      })

      if (emailExists) {
        throw new Error('Ya existe un empleado con este email')
      }
    }

    const updateData: any = { ...data }

    if (data.hireDate) {
      updateData.hireDate = new Date(data.hireDate)
    }
    if (data.dateOfBirth) {
      updateData.dateOfBirth = new Date(data.dateOfBirth)
    }
    if (data.terminationDate) {
      updateData.terminationDate = new Date(data.terminationDate)
    }

    return await this.prisma.employee.update({
      where: { id },
      data: updateData,
      include: {
        manager: true,
        subordinates: true,
        payrolls: true,
        vacations: true,
        performances: true,
      },
    })
  }

  async deleteEmployee(id: string, tenantId: string) {
    // Verificar que el empleado existe
    const existingEmployee = await this.prisma.employee.findFirst({
      where: { id, tenantId },
    })

    if (!existingEmployee) {
      throw new Error('Empleado no encontrado')
    }

    // Verificar que no tenga registros relacionados críticos
    const relatedRecords = await this.prisma.employee.findFirst({
      where: { id, tenantId },
      include: {
        payrolls: true,
        vacations: true,
        performances: true,
      },
    })

    if (
      (relatedRecords?.payrolls?.length || 0) > 0 ||
      (relatedRecords?.vacations?.length || 0) > 0 ||
      (relatedRecords?.performances?.length || 0) > 0
    ) {
      // En lugar de eliminar, marcar como inactivo
      return await this.prisma.employee.update({
        where: { id },
        data: { status: 'INACTIVE' },
      })
    }

    return await this.prisma.employee.delete({
      where: { id },
    })
  }

  async getEmployeeStats(tenantId: string) {
    const [
      totalEmployees,
      activeEmployees,
      employeesByDepartment,
      employeesByStatus,
      recentHires,
      upcomingBirthdays,
    ] = await Promise.all([
      this.prisma.employee.count({ where: { tenantId } }),
      this.prisma.employee.count({ where: { tenantId, status: 'ACTIVE' } }),
      this.prisma.employee.groupBy({
        by: ['department'],
        where: { tenantId },
        _count: true,
      }),
      this.prisma.employee.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: true,
      }),
      this.prisma.employee.findMany({
        where: {
          tenantId,
          hireDate: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Últimos 30 días
          },
        },
        orderBy: { hireDate: 'desc' },
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeNumber: true,
          position: true,
          hireDate: true,
        },
      }),
      this.prisma.employee.findMany({
        where: {
          tenantId,
          dateOfBirth: {
            not: null,
            gte: new Date(),
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Próximos 30 días
          },
        },
        orderBy: { dateOfBirth: 'asc' },
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeNumber: true,
          dateOfBirth: true,
        },
      }),
    ])

    return {
      totalEmployees,
      activeEmployees,
      employeesByDepartment,
      employeesByStatus,
      recentHires,
      upcomingBirthdays,
    }
  }

  async searchEmployees(
    tenantId: string, 
    query: string,
    options: { page: number; limit: number } = { page: 1, limit: 10 }
  ) {
    if (!query || query.trim().length < 2) {
      return {
        employees: [],
        pagination: {
          page: options.page,
          limit: options.limit,
          total: 0,
          totalPages: 0,
        },
      }
    }

    const { page, limit } = options
    const skip = (page - 1) * limit

    const where = {
      tenantId,
      OR: [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { employeeNumber: { contains: query } },
        { position: { contains: query, mode: 'insensitive' } },
      ],
    }

    // Obtener total de registros
    const total = await this.prisma.employee.count({ where })

    // Obtener empleados con paginación
    const employees = await this.prisma.employee.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        employeeNumber: true,
        position: true,
        department: true,
      },
      skip,
      take: limit,
    })

    return {
      employees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
}
