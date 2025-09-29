import { PrismaClient } from '@prisma/client'
import {
  CreateEnhancedServerInput,
  UpdateEnhancedServerInput,
  ServerQuery,
} from '@/lib/validations/server-enhanced'

const prisma = new PrismaClient()

export interface EnhancedServerWithRelations {
  id: string
  name: string
  hostname?: string | null
  type: string
  status: string
  ipAddress: string
  port?: number | null
  protocol?: string | null
  location: string

  // Información geográfica
  country: string
  region: string
  city: string
  timezone: string
  currency: string

  // Información del datacenter
  datacenter?: string | null
  datacenterCode?: string | null
  rack?: string | null
  rackPosition?: string | null
  provider?: string | null

  // Cumplimiento normativo
  compliance: string[]

  // Especificaciones técnicas
  operatingSystem?: string | null
  cpu?: string | null
  ram?: string | null
  storage?: string | null
  bandwidth?: string | null
  powerConsumption?: string | null
  temperature?: string | null

  // Configuraciones
  sslCertificate: boolean
  backupEnabled: boolean
  monitoringEnabled: boolean

  // Información del cliente
  clientId: string
  client: {
    id: string
    companyName: string
    email: string
    status: string
  }

  // Fechas importantes
  installationDate?: Date | null
  lastMaintenance?: Date | null
  nextMaintenance?: Date | null

  // Costos y descripción
  cost?: number | null
  costCurrency?: string | null
  costPeriod?: string | null
  description?: string | null
  notes?: string | null

  // Información de red
  publicIP?: string | null
  privateIP?: string | null
  gateway?: string | null
  subnet?: string | null
  dnsServers: string[]
  connectionType: string

  // Métricas de rendimiento
  uptime?: string | null
  lastChecked: Date

  createdAt: Date
  updatedAt: Date

  // Relaciones
  alerts: Array<{
    id: string
    type: string
    severity: string
    title: string
    status: string
    createdAt: Date
  }>
  metrics: Array<{
    id: string
    metricType: string
    value: number
    unit?: string | null
    timestamp: Date
  }>
  userAccesses: Array<{
    id: string
    username: string
    fullName: string
    accessType: string
    status: string
  }>
  maintenanceWindows: Array<{
    id: string
    title: string
    type: string
    status: string
    startTime: Date
    endTime: Date
  }>
  serverCosts: Array<{
    id: string
    costType: string
    amount: number
    currency: string
    period: string
  }>
  networkConfigs: Array<{
    id: string
    publicIP?: string | null
    privateIP: string
    connectionType: string
  }>

  _count?: {
    alerts: number
    metrics: number
    userAccesses: number
    maintenanceWindows: number
    serverCosts: number
  }
}

export class EnhancedServerService {
  static async createServer(data: CreateEnhancedServerInput, tenantId: string) {
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
      },
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
            email: true,
            status: true,
          },
        },
        alerts: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            type: true,
            severity: true,
            title: true,
            status: true,
            createdAt: true,
          },
        },
        metrics: {
          orderBy: { timestamp: 'desc' },
          take: 10,
          select: {
            id: true,
            metricType: true,
            value: true,
            unit: true,
            timestamp: true,
          },
        },
        userAccesses: {
          select: {
            id: true,
            username: true,
            fullName: true,
            accessType: true,
            status: true,
          },
        },
        maintenanceWindows: {
          orderBy: { startTime: 'desc' },
          take: 3,
          select: {
            id: true,
            title: true,
            type: true,
            status: true,
            startTime: true,
            endTime: true,
          },
        },
        serverCosts: {
          orderBy: { startDate: 'desc' },
          take: 5,
          select: {
            id: true,
            costType: true,
            amount: true,
            currency: true,
            period: true,
          },
        },
        networkConfigs: {
          select: {
            id: true,
            publicIP: true,
            privateIP: true,
            connectionType: true,
          },
        },
        _count: {
          select: {
            alerts: true,
            metrics: true,
            userAccesses: true,
            maintenanceWindows: true,
            serverCosts: true,
          },
        },
      },
    })
  }

  static async getServers(
    tenantId: string,
    options: Partial<ServerQuery> = {}
  ) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      country,
      region,
      type,
      clientId,
      sortBy,
      sortOrder,
    } = options
    const skip = (page - 1) * limit

    const where: any = { tenantId }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { hostname: { contains: search, mode: 'insensitive' } },
        { ipAddress: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { datacenter: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (country) {
      where.country = country
    }

    if (region) {
      where.region = region
    }

    if (type) {
      where.type = type
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
          client: {
            select: {
              id: true,
              companyName: true,
              email: true,
              status: true,
            },
          },
          alerts: {
            orderBy: { createdAt: 'desc' },
            take: 3,
            select: {
              id: true,
              type: true,
              severity: true,
              title: true,
              status: true,
              createdAt: true,
            },
          },
          metrics: {
            orderBy: { timestamp: 'desc' },
            take: 5,
            select: {
              id: true,
              metricType: true,
              value: true,
              unit: true,
              timestamp: true,
            },
          },
          userAccesses: {
            select: {
              id: true,
              username: true,
              fullName: true,
              accessType: true,
              status: true,
            },
          },
          maintenanceWindows: {
            orderBy: { startTime: 'desc' },
            take: 2,
            select: {
              id: true,
              title: true,
              type: true,
              status: true,
              startTime: true,
              endTime: true,
            },
          },
          serverCosts: {
            orderBy: { startDate: 'desc' },
            take: 3,
            select: {
              id: true,
              costType: true,
              amount: true,
              currency: true,
              period: true,
            },
          },
          networkConfigs: {
            select: {
              id: true,
              publicIP: true,
              privateIP: true,
              connectionType: true,
            },
          },
          _count: {
            select: {
              alerts: true,
              metrics: true,
              userAccesses: true,
              maintenanceWindows: true,
              serverCosts: true,
            },
          },
        },
        orderBy: { [sortBy as any]: sortOrder },
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
        client: {
          select: {
            id: true,
            companyName: true,
            email: true,
            status: true,
          },
        },
        alerts: {
          orderBy: { createdAt: 'desc' },
        },
        metrics: {
          orderBy: { timestamp: 'desc' },
        },
        userAccesses: {
          select: {
            id: true,
            username: true,
            fullName: true,
            accessType: true,
            status: true,
          },
        },
        maintenanceWindows: {
          orderBy: { startTime: 'desc' },
        },
        serverCosts: {
          orderBy: { startDate: 'desc' },
        },
        networkConfigs: true,
        _count: {
          select: {
            alerts: true,
            metrics: true,
            userAccesses: true,
            maintenanceWindows: true,
            serverCosts: true,
          },
        },
      },
    })
  }

  static async updateServer(
    id: string,
    data: UpdateEnhancedServerInput,
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
        client: {
          select: {
            id: true,
            companyName: true,
            email: true,
            status: true,
          },
        },
        alerts: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            type: true,
            severity: true,
            title: true,
            status: true,
            createdAt: true,
          },
        },
        metrics: {
          orderBy: { timestamp: 'desc' },
          take: 10,
          select: {
            id: true,
            metricType: true,
            value: true,
            unit: true,
            timestamp: true,
          },
        },
        userAccesses: {
          select: {
            id: true,
            username: true,
            fullName: true,
            accessType: true,
            status: true,
          },
        },
        maintenanceWindows: {
          orderBy: { startTime: 'desc' },
          take: 3,
          select: {
            id: true,
            title: true,
            type: true,
            status: true,
            startTime: true,
            endTime: true,
          },
        },
        serverCosts: {
          orderBy: { startDate: 'desc' },
          take: 5,
          select: {
            id: true,
            costType: true,
            amount: true,
            currency: true,
            period: true,
          },
        },
        networkConfigs: {
          select: {
            id: true,
            publicIP: true,
            privateIP: true,
            connectionType: true,
          },
        },
        _count: {
          select: {
            alerts: true,
            metrics: true,
            userAccesses: true,
            maintenanceWindows: true,
            serverCosts: true,
          },
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
      serversByCountry,
      serversByRegion,
      serversByType,
      serversByClient,
      recentServers,
      upcomingMaintenance,
    ] = await Promise.all([
      prisma.server.count({ where: { tenantId } }),
      prisma.server.count({ where: { tenantId, status: 'ONLINE' } }),
      prisma.server.count({ where: { tenantId, status: 'OFFLINE' } }),
      prisma.server.count({ where: { tenantId, status: 'MAINTENANCE' } }),
      prisma.server.count({ where: { tenantId, status: 'WARNING' } }),
      prisma.server.groupBy({
        by: ['country'],
        where: { tenantId },
        _count: { country: true },
        orderBy: { _count: { country: 'desc' } },
      }),
      prisma.server.groupBy({
        by: ['region'],
        where: { tenantId },
        _count: { region: true },
        orderBy: { _count: { region: 'desc' } },
      }),
      prisma.server.groupBy({
        by: ['type'],
        where: { tenantId },
        _count: { type: true },
        orderBy: { _count: { type: 'desc' } },
      }),
      prisma.server.groupBy({
        by: ['clientId'],
        where: { tenantId },
        _count: { clientId: true },
        orderBy: { _count: { clientId: 'desc' } },
      }),
      prisma.server.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          client: {
            select: { id: true, companyName: true },
          },
        },
      }),
      prisma.server.findMany({
        where: {
          tenantId,
          nextMaintenance: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Próximos 7 días
          },
        },
        orderBy: { nextMaintenance: 'asc' },
        take: 5,
        include: {
          client: {
            select: { id: true, companyName: true },
          },
        },
      }),
    ])

    // Calcular tasa de disponibilidad
    const availabilityRate =
      totalServers > 0 ? Math.round((onlineServers / totalServers) * 100) : 0

    return {
      totalServers,
      onlineServers,
      offlineServers,
      maintenanceServers,
      warningServers,
      availabilityRate,
      serversByCountry,
      serversByRegion,
      serversByType,
      serversByClient,
      recentServers,
      upcomingMaintenance,
    }
  }

  static async getServersByCountry(tenantId: string, country: string) {
    return await prisma.server.findMany({
      where: { tenantId, country },
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
            email: true,
            status: true,
          },
        },
        alerts: {
          orderBy: { createdAt: 'desc' },
          take: 3,
          select: {
            id: true,
            type: true,
            severity: true,
            title: true,
            status: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            alerts: true,
            metrics: true,
            userAccesses: true,
            maintenanceWindows: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    })
  }

  static async getServersByRegion(tenantId: string, region: string) {
    return await prisma.server.findMany({
      where: { tenantId, region },
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
            email: true,
            status: true,
          },
        },
        alerts: {
          orderBy: { createdAt: 'desc' },
          take: 3,
          select: {
            id: true,
            type: true,
            severity: true,
            title: true,
            status: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            alerts: true,
            metrics: true,
            userAccesses: true,
            maintenanceWindows: true,
          },
        },
      },
      orderBy: { country: 'asc' },
    })
  }

  static async searchServers(
    query: string,
    tenantId: string,
    limit: number = 10
  ) {
    if (!query || query.trim().length < 2) {
      return []
    }

    return prisma.server.findMany({
      where: {
        tenantId,
        status: 'ONLINE',
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { hostname: { contains: query, mode: 'insensitive' } },
          { ipAddress: { contains: query, mode: 'insensitive' } },
          { city: { contains: query, mode: 'insensitive' } },
          { country: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        client: {
          select: { id: true, companyName: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
      take: limit,
    })
  }

  static async getGeographicStats(tenantId: string) {
    const [countries, regions, cities] = await Promise.all([
      prisma.server.groupBy({
        by: ['country'],
        where: { tenantId },
        _count: { country: true },
        orderBy: { _count: { country: 'desc' } },
      }),
      prisma.server.groupBy({
        by: ['region'],
        where: { tenantId },
        _count: { region: true },
        orderBy: { _count: { region: 'desc' } },
      }),
      prisma.server.groupBy({
        by: ['city'],
        where: { tenantId },
        _count: { city: true },
        orderBy: { _count: { city: 'desc' } },
      }),
    ])

    return {
      countries: countries.map(c => ({
        name: c.country,
        count: c._count.country,
      })),
      regions: regions.map(r => ({ name: r.region, count: r._count.region })),
      cities: cities.map(c => ({ name: c.city, count: c._count.city })),
    }
  }

  static async getTimezoneStats(tenantId: string) {
    const timezones = await prisma.server.groupBy({
      by: ['timezone'],
      where: { tenantId },
      _count: { timezone: true },
      orderBy: { _count: { timezone: 'desc' } },
    })

    return timezones.map(t => ({
      timezone: t.timezone,
      count: t._count.timezone,
    }))
  }
}
