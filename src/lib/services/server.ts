import { CreateServerInput, UpdateServerInput } from '@/lib/validations/server'
import { prisma } from '@/lib/db'

export class ServerService {
  /**
   * Crea un nuevo servidor en el sistema
   * @param data - Datos del servidor a crear
   * @param tenantId - ID del tenant
   * @returns Promise con el servidor creado y sus relaciones (cliente, alertas, métricas)
   */
  static async createServer(data: CreateServerInput, tenantId: string) {
    return await prisma.server.create({
      data: {
        ...data,
        tenantId,
        installationDate: data.installationDate
          ? new Date(data.installationDate)
          : null,
        lastMaintenance: data.lastMaintenance
          ? new Date(data.lastMaintenance)
          : null,
        nextMaintenance: data.nextMaintenance
          ? new Date(data.nextMaintenance)
          : null,
      } as any,
      include: {
        client: true,
        alerts: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
        },
        metrics: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
      },
    })
  }

  /**
   * Obtiene servidores con filtros y paginación
   * @param tenantId - ID del tenant
   * @param options - Opciones de filtrado y paginación
   * @param options.page - Número de página
   * @param options.limit - Límite de resultados por página
   * @param options.search - Término de búsqueda (nombre, IP, modelo)
   * @param options.status - Filtro por estado del servidor
   * @param options.clientId - Filtro por cliente específico
   * @returns Promise con lista paginada de servidores y metadatos
   */
  static async getServers(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      search?: string
      status?: string
      clientId?: string
    } = {}
  ) {
    const { page = 1, limit = 20, search, status, clientId } = options
    const skip = (page - 1) * limit

    const where: any = { tenantId }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { hostname: { contains: search, mode: 'insensitive' } },
        { ipAddress: { contains: search, mode: 'insensitive' } },
        { client: { companyName: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (clientId) {
      where.clientId = clientId
    }

    const [servers, total] = await Promise.all([
      prisma.server.findMany({
        where,
        skip,
        take: limit,
        include: {
          client: true,
          alerts: {
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
          },
          metrics: {
            orderBy: { timestamp: 'desc' },
            take: 5,
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.server.count({ where }),
    ])

    return {
      servers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  static async getServerById(id: string, tenantId: string) {
    return await prisma.server.findFirst({
      where: { id, tenantId },
      include: {
        client: true,
        alerts: {
          orderBy: { createdAt: 'desc' },
        },
        metrics: {
          orderBy: { timestamp: 'desc' },
        },
      },
    })
  }

  static async updateServer(
    id: string,
    data: UpdateServerInput,
    tenantId: string
  ) {
    return await prisma.server.update({
      where: { id, tenantId },
      data: {
        ...data,
        installationDate: data.installationDate
          ? new Date(data.installationDate)
          : undefined,
        lastMaintenance: data.lastMaintenance
          ? new Date(data.lastMaintenance)
          : undefined,
        nextMaintenance: data.nextMaintenance
          ? new Date(data.nextMaintenance)
          : undefined,
      },
      include: {
        client: true,
        alerts: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
        },
        metrics: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
      },
    })
  }

  static async deleteServer(id: string, tenantId: string) {
    return await prisma.server.delete({
      where: { id, tenantId },
    })
  }

  static async getServerStats(tenantId: string) {
    const [
      totalServers,
      onlineServers,
      offlineServers,
      maintenanceServers,
      warningServers,
      totalClients,
      activeClients,
      totalRevenue,
      recentAlerts,
    ] = await Promise.all([
      prisma.server.count({ where: { tenantId } }),
      prisma.server.count({ where: { tenantId, status: 'ONLINE' } }),
      prisma.server.count({ where: { tenantId, status: 'OFFLINE' } }),
      prisma.server.count({ where: { tenantId, status: 'MAINTENANCE' } }),
      prisma.server.count({ where: { tenantId, status: 'WARNING' } }),
      prisma.serverClient.count({ where: { tenantId } }),
      prisma.serverClient.count({ where: { tenantId, status: 'ACTIVE' } }),
      prisma.server.aggregate({
        where: { tenantId },
        _sum: { cost: true },
      }),
      prisma.serverAlert.count({
        where: {
          tenantId,
          status: 'ACTIVE',
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24 horas
          },
        },
      }),
    ])

    // Obtener distribución por tipo de servidor
    const serversByType = await prisma.server.groupBy({
      by: ['type'],
      where: { tenantId },
      _count: { type: true },
      orderBy: { _count: { type: 'desc' } },
    })

    // Obtener distribución por cliente
    const serversByClient = await prisma.server.groupBy({
      by: ['clientId'],
      where: { tenantId },
      _count: { clientId: true },
      orderBy: { _count: { clientId: 'desc' } },
      take: 10,
    })

    // Obtener clientes con sus servidores
    const clientsWithServers = await prisma.serverClient.findMany({
      where: { tenantId },
      include: {
        servers: {
          select: { id: true, name: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    return {
      totalServers,
      onlineServers,
      offlineServers,
      maintenanceServers,
      warningServers,
      totalClients,
      activeClients,
      totalRevenue: totalRevenue._sum.cost || 0,
      recentAlerts,
      serversByType,
      serversByClient,
      clientsWithServers,
    }
  }

  static async getServerMetrics(
    serverId: string,
    tenantId: string,
    options: {
      metricType?: string
      hours?: number
    } = {}
  ) {
    const { metricType, hours = 24 } = options

    const where: any = {
      serverId,
      tenantId,
      timestamp: {
        gte: new Date(Date.now() - hours * 60 * 60 * 1000),
      },
    }

    if (metricType) {
      where.metricType = metricType
    }

    return await prisma.serverMetric.findMany({
      where,
      orderBy: { timestamp: 'asc' },
    })
  }

  static async createServerAlert(
    data: any,
    serverId: string,
    tenantId: string
  ) {
    return await prisma.serverAlert.create({
      data: {
        ...data,
        serverId,
        tenantId,
      },
    })
  }

  static async getServerAlerts(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      status?: string
      severity?: string
      serverId?: string
    } = {}
  ) {
    const { page = 1, limit = 20, status, severity, serverId } = options
    const skip = (page - 1) * limit

    const where: any = { tenantId }

    if (status) {
      where.status = status
    }

    if (severity) {
      where.severity = severity
    }

    if (serverId) {
      where.serverId = serverId
    }

    const [alerts, total] = await Promise.all([
      prisma.serverAlert.findMany({
        where,
        skip,
        take: limit,
        include: {
          server: {
            include: {
              client: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.serverAlert.count({ where }),
    ])

    return {
      alerts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  static async acknowledgeAlert(alertId: string, tenantId: string) {
    return await prisma.serverAlert.update({
      where: { id: alertId, tenantId },
      data: {
        acknowledged: true,
        status: 'ACKNOWLEDGED',
      },
    })
  }

  static async resolveAlert(
    alertId: string,
    tenantId: string,
    resolvedBy: string
  ) {
    return await prisma.serverAlert.update({
      where: { id: alertId, tenantId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        resolvedBy,
      },
    })
  }
}
