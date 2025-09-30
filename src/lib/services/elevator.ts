import { PrismaClient } from '@prisma/client'
import type { ElevatorInput } from '../validations/elevator'

const prisma = new PrismaClient()

export class ElevatorService {
  /**
   * Obtiene ascensores con filtros avanzados y paginación
   * @param tenantId - ID del tenant
   * @param options - Opciones de filtrado y paginación
   * @param options.page - Número de página
   * @param options.limit - Límite de resultados por página
   * @param options.search - Término de búsqueda (número de serie, modelo, marca, edificio)
   * @param options.status - Filtro por estado del ascensor
   * @param options.clientId - Filtro por cliente específico
   * @param options.brand - Filtro por marca del ascensor
   * @returns Promise con lista paginada de ascensores y metadatos
   */
  static async getElevators(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      search?: string
      status?: string
      clientId?: string
      brand?: string
    } = {}
  ) {
    const { page = 1, limit = 20, search, status, clientId, brand } = options

    const skip = (page - 1) * limit

    const where: any = {
      tenantId,
    }

    if (search) {
      where.OR = [
        { serialNumber: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { buildingName: { contains: search, mode: 'insensitive' } },
        { buildingAddress: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (clientId) {
      where.clientId = clientId
    }

    if (brand) {
      where.brand = { contains: brand, mode: 'insensitive' }
    }

    const [elevators, total] = await Promise.all([
      prisma.elevator.findMany({
        where,
        skip,
        take: limit,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              company: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.elevator.count({ where }),
    ])

    return {
      elevators,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Obtiene un ascensor por su ID con todas sus relaciones
   * @param id - ID del ascensor
   * @param tenantId - ID del tenant
   * @returns Promise con el ascensor encontrado y sus relaciones (cliente, instalaciones, mantenimientos)
   */
  static async getElevatorById(id: string, tenantId: string) {
    return prisma.elevator.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        client: true,
        installations: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
        maintenanceRecords: {
          orderBy: {
            scheduledDate: 'desc',
          },
          take: 10,
        },
        inspections: {
          orderBy: {
            scheduledDate: 'desc',
          },
          take: 5,
        },
        workOrders: {
          orderBy: {
            createdDate: 'desc',
          },
          take: 10,
        },
      },
    })
  }

  // Crear nuevo ascensor
  static async createElevator(data: ElevatorInput, tenantId: string) {
    // Convertir fechas string a Date
    const elevatorData: any = {
      ...data,
      tenantId,
    }

    if (data.installationDate) {
      elevatorData.installationDate = new Date(data.installationDate)
    }
    if (data.commissioningDate) {
      elevatorData.commissioningDate = new Date(data.commissioningDate)
    }
    if (data.lastInspection) {
      elevatorData.lastInspection = new Date(data.lastInspection)
    }
    if (data.nextInspection) {
      elevatorData.nextInspection = new Date(data.nextInspection)
    }
    if (data.warrantyExpiry) {
      elevatorData.warrantyExpiry = new Date(data.warrantyExpiry)
    }
    if (data.certificationExpiry) {
      elevatorData.certificationExpiry = new Date(data.certificationExpiry)
    }

    return prisma.elevator.create({
      data: elevatorData,
      include: {
        client: true,
      },
    })
  }

  // Actualizar ascensor
  static async updateElevator(
    id: string,
    data: Partial<ElevatorInput>,
    tenantId: string
  ) {
    // Convertir fechas string a Date
    const elevatorData: any = { ...data }

    if (data.installationDate) {
      elevatorData.installationDate = new Date(data.installationDate)
    }
    if (data.commissioningDate) {
      elevatorData.commissioningDate = new Date(data.commissioningDate)
    }
    if (data.lastInspection) {
      elevatorData.lastInspection = new Date(data.lastInspection)
    }
    if (data.nextInspection) {
      elevatorData.nextInspection = new Date(data.nextInspection)
    }
    if (data.warrantyExpiry) {
      elevatorData.warrantyExpiry = new Date(data.warrantyExpiry)
    }
    if (data.certificationExpiry) {
      elevatorData.certificationExpiry = new Date(data.certificationExpiry)
    }

    return prisma.elevator.update({
      where: {
        id,
        tenantId,
      },
      data: elevatorData,
      include: {
        client: true,
      },
    })
  }

  // Eliminar ascensor
  static async deleteElevator(id: string, tenantId: string) {
    return prisma.elevator.delete({
      where: {
        id,
        tenantId,
      },
    })
  }

  // Obtener estadísticas de ascensores
  static async getElevatorStats(tenantId: string) {
    const [
      total,
      operational,
      underMaintenance,
      outOfService,
      upcomingInspections,
      expiredCertifications,
    ] = await Promise.all([
      prisma.elevator.count({ where: { tenantId } }),
      prisma.elevator.count({ where: { tenantId, status: 'OPERATIONAL' } }),
      prisma.elevator.count({
        where: { tenantId, status: 'UNDER_MAINTENANCE' },
      }),
      prisma.elevator.count({ where: { tenantId, status: 'OUT_OF_SERVICE' } }),
      prisma.elevator.count({
        where: {
          tenantId,
          nextInspection: {
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Próximos 30 días
          },
        },
      }),
      prisma.elevator.count({
        where: {
          tenantId,
          certificationExpiry: {
            lte: new Date(),
          },
        },
      }),
    ])

    return {
      total,
      operational,
      underMaintenance,
      outOfService,
      upcomingInspections,
      expiredCertifications,
    }
  }

  // Obtener ascensores por cliente
  static async getElevatorsByClient(clientId: string, tenantId: string) {
    return prisma.elevator.findMany({
      where: {
        clientId,
        tenantId,
      },
      orderBy: {
        buildingName: 'asc',
      },
    })
  }

  // Actualizar próxima inspección
  static async updateNextInspection(
    id: string,
    nextInspection: Date,
    tenantId: string
  ) {
    return prisma.elevator.update({
      where: {
        id,
        tenantId,
      },
      data: {
        nextInspection,
      },
    })
  }
}
