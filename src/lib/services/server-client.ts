import { PrismaClient } from '@prisma/client'
import {
  CreateServerClientInput,
  UpdateServerClientInput,
} from '@/lib/validations/server'

const prisma = new PrismaClient()

export class ServerClientService {
  static async createServerClient(
    data: CreateServerClientInput,
    tenantId: string
  ) {
    return await prisma.serverClient.create({
      data: {
        ...data,
        tenantId,
        contractStart: data.contractStart ? new Date(data.contractStart) : null,
        contractEnd: data.contractEnd ? new Date(data.contractEnd) : null,
      },
      include: {
        servers: {
          include: {
            alerts: {
              where: { status: 'ACTIVE' },
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    })
  }

  static async getServerClients(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      search?: string
      status?: string
    } = {}
  ) {
    const { page = 1, limit = 20, search, status } = options
    const skip = (page - 1) * limit

    const where: any = { tenantId }

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    const [clients, total] = await Promise.all([
      prisma.serverClient.findMany({
        where,
        skip,
        take: limit,
        include: {
          servers: {
            include: {
              alerts: {
                where: { status: 'ACTIVE' },
                orderBy: { createdAt: 'desc' },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.serverClient.count({ where }),
    ])

    return {
      clients,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  static async getServerClientById(id: string, tenantId: string) {
    return await prisma.serverClient.findFirst({
      where: { id, tenantId },
      include: {
        servers: {
          include: {
            alerts: {
              orderBy: { createdAt: 'desc' },
            },
            metrics: {
              orderBy: { timestamp: 'desc' },
              take: 10,
            },
          },
        },
      },
    })
  }

  static async updateServerClient(
    id: string,
    data: UpdateServerClientInput,
    tenantId: string
  ) {
    return await prisma.serverClient.update({
      where: { id, tenantId },
      data: {
        ...data,
        contractStart: data.contractStart
          ? new Date(data.contractStart)
          : undefined,
        contractEnd: data.contractEnd ? new Date(data.contractEnd) : undefined,
      },
      include: {
        servers: {
          include: {
            alerts: {
              where: { status: 'ACTIVE' },
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    })
  }

  static async deleteServerClient(id: string, tenantId: string) {
    return await prisma.serverClient.delete({
      where: { id, tenantId },
    })
  }

  static async getServerClientStats(tenantId: string) {
    const [
      totalClients,
      activeClients,
      inactiveClients,
      suspendedClients,
      totalRevenue,
      averageMonthlyFee,
      clientsWithExpiringContracts,
    ] = await Promise.all([
      prisma.serverClient.count({ where: { tenantId } }),
      prisma.serverClient.count({ where: { tenantId, status: 'ACTIVE' } }),
      prisma.serverClient.count({ where: { tenantId, status: 'INACTIVE' } }),
      prisma.serverClient.count({ where: { tenantId, status: 'SUSPENDED' } }),
      prisma.serverClient.aggregate({
        where: { tenantId },
        _sum: { monthlyFee: true },
      }),
      prisma.serverClient.aggregate({
        where: { tenantId, monthlyFee: { not: null } },
        _avg: { monthlyFee: true },
      }),
      prisma.serverClient.count({
        where: {
          tenantId,
          status: 'ACTIVE',
          contractEnd: {
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Próximos 30 días
            gte: new Date(),
          },
        },
      }),
    ])

    // Obtener distribución por nivel de servicio
    const clientsByServiceLevel = await prisma.serverClient.groupBy({
      by: ['serviceLevel'],
      where: { tenantId },
      _count: { serviceLevel: true },
      orderBy: { _count: { serviceLevel: 'desc' } },
    })

    // Obtener top clientes por ingresos
    const topClientsByRevenue = await prisma.serverClient.findMany({
      where: {
        tenantId,
        monthlyFee: { not: null },
      },
      select: {
        id: true,
        companyName: true,
        monthlyFee: true,
        servers: {
          select: { id: true },
        },
      },
      orderBy: { monthlyFee: 'desc' },
      take: 10,
    })

    return {
      totalClients,
      activeClients,
      inactiveClients,
      suspendedClients,
      totalRevenue: totalRevenue._sum.monthlyFee || 0,
      averageMonthlyFee: averageMonthlyFee._avg.monthlyFee || 0,
      clientsWithExpiringContracts,
      clientsByServiceLevel,
      topClientsByRevenue,
    }
  }
}
