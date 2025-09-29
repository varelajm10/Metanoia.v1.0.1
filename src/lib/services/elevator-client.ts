import { PrismaClient } from '@prisma/client'
import type { ElevatorClientInput } from '../validations/elevator'

const prisma = new PrismaClient()

export class ElevatorClientService {
  // Obtener clientes con filtros y paginación
  static async getClients(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      search?: string
      status?: string
      clientType?: string
    } = {}
  ) {
    const { page = 1, limit = 20, search, status, clientType } = options

    const skip = (page - 1) * limit

    const where: any = {
      tenantId,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (clientType) {
      where.clientType = clientType
    }

    const [clients, total] = await Promise.all([
      prisma.elevatorClient.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              elevators: true,
              installations: true,
              maintenanceContracts: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.elevatorClient.count({ where }),
    ])

    return {
      clients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  // Obtener un cliente por ID
  static async getClientById(id: string, tenantId: string) {
    return prisma.elevatorClient.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        elevators: {
          orderBy: {
            buildingName: 'asc',
          },
        },
        installations: {
          orderBy: {
            startDate: 'desc',
          },
          take: 10,
        },
        maintenanceContracts: {
          orderBy: {
            startDate: 'desc',
          },
          take: 10,
        },
      },
    })
  }

  // Crear nuevo cliente
  static async createClient(data: ElevatorClientInput, tenantId: string) {
    return prisma.elevatorClient.create({
      data: {
        ...data,
        tenantId,
      },
    })
  }

  // Actualizar cliente
  static async updateClient(
    id: string,
    data: Partial<ElevatorClientInput>,
    tenantId: string
  ) {
    return prisma.elevatorClient.update({
      where: {
        id,
        tenantId,
      },
      data,
    })
  }

  // Eliminar cliente
  static async deleteClient(id: string, tenantId: string) {
    return prisma.elevatorClient.delete({
      where: {
        id,
        tenantId,
      },
    })
  }

  // Obtener estadísticas de clientes
  static async getClientStats(tenantId: string) {
    const [total, active, prospective, withElevators, withContracts] =
      await Promise.all([
        prisma.elevatorClient.count({ where: { tenantId } }),
        prisma.elevatorClient.count({ where: { tenantId, status: 'ACTIVE' } }),
        prisma.elevatorClient.count({
          where: { tenantId, status: 'PROSPECTIVE' },
        }),
        prisma.elevatorClient.count({
          where: {
            tenantId,
            elevators: {
              some: {},
            },
          },
        }),
        prisma.elevatorClient.count({
          where: {
            tenantId,
            maintenanceContracts: {
              some: {
                status: 'ACTIVE',
              },
            },
          },
        }),
      ])

    return {
      total,
      active,
      prospective,
      withElevators,
      withContracts,
    }
  }
}
