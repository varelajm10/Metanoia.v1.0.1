import { PrismaClient, Prisma } from '@prisma/client'
import {
  CreateNetworkConfigInput,
  UpdateNetworkConfigInput,
  CreateNetworkMetricInput,
  CreateConnectivityAlertInput,
  UpdateConnectivityAlertInput,
  CreateDnsConfigInput,
  UpdateDnsConfigInput,
  CreateRoutingConfigInput,
  UpdateRoutingConfigInput,
  CreateFirewallConfigInput,
  UpdateFirewallConfigInput,
  NetworkQuery,
} from '@/lib/validations/server-network'

const prisma = new PrismaClient()

export interface NetworkConfigWithRelations {
  id: string
  publicIP?: string | null
  privateIP: string
  gateway?: string | null
  subnet?: string | null
  dnsServers: string[]
  bandwidth?: string | null
  connectionType: string
  isp?: string | null
  contractNumber?: string | null
  contractEndDate?: Date | null
  vlan?: string | null
  routingTable?: any
  firewallRules?: any
  createdAt: Date
  updatedAt: Date
  serverId: string
  server: {
    id: string
    name: string
    ipAddress: string
    status: string
    client: {
      id: string
      companyName: string
      email: string
    }
  }
}

export interface NetworkMetricWithRelations {
  id: string
  metricType: string
  value: number
  unit?: string | null
  timestamp: Date
  source?: string | null
  additionalData?: any
  serverId: string
  server: {
    id: string
    name: string
    ipAddress: string
    status: string
  }
}

export interface ConnectivityAlertWithRelations {
  id: string
  type: string
  severity: string
  title: string
  description: string
  threshold?: number | null
  actualValue?: number | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  serverId: string
  server: {
    id: string
    name: string
    ipAddress: string
    status: string
    client: {
      id: string
      companyName: string
    }
  }
}

export class ServerNetworkService {
  // Configuración de red
  static async createNetworkConfig(
    data: CreateNetworkConfigInput,
    tenantId: string
  ) {
    return await prisma.networkConfig.create({
      data: {
        ...data,
        tenantId,
        contractEndDate: data.contractEndDate
          ? new Date(data.contractEndDate)
          : null,
      },
      include: {
        server: {
          select: {
            id: true,
            name: true,
            ipAddress: true,
            status: true,
            client: {
              select: {
                id: true,
                companyName: true,
                email: true,
              },
            },
          },
        },
      },
    })
  }

  static async getNetworkConfigs(tenantId: string, serverId?: string) {
    const where: Prisma.NetworkConfigWhereInput = { tenantId }
    if (serverId) {
      where.serverId = serverId
    }

    return await prisma.networkConfig.findMany({
      where,
      include: {
        server: {
          select: {
            id: true,
            name: true,
            ipAddress: true,
            status: true,
            client: {
              select: {
                id: true,
                companyName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  static async getNetworkConfigById(id: string, tenantId: string) {
    return await prisma.networkConfig.findFirst({
      where: { id, tenantId },
      include: {
        server: {
          select: {
            id: true,
            name: true,
            ipAddress: true,
            status: true,
            client: {
              select: {
                id: true,
                companyName: true,
                email: true,
              },
            },
          },
        },
      },
    })
  }

  static async updateNetworkConfig(
    id: string,
    data: UpdateNetworkConfigInput,
    tenantId: string
  ) {
    return await prisma.networkConfig.update({
      where: { id, tenantId },
      data: {
        ...data,
        contractEndDate: data.contractEndDate
          ? new Date(data.contractEndDate)
          : undefined,
      },
      include: {
        server: {
          select: {
            id: true,
            name: true,
            ipAddress: true,
            status: true,
            client: {
              select: {
                id: true,
                companyName: true,
                email: true,
              },
            },
          },
        },
      },
    })
  }

  static async deleteNetworkConfig(id: string, tenantId: string) {
    return await prisma.networkConfig.delete({
      where: { id, tenantId },
    })
  }

  // Métricas de red
  static async createNetworkMetric(
    data: CreateNetworkMetricInput,
    tenantId: string
  ) {
    return await prisma.serverMetric.create({
      data: {
        serverId: data.serverId,
        metricType: data.metricType as any,
        value: data.value,
        unit: data.unit,
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
        source: data.source,
        tenantId,
      },
      include: {
        server: {
          select: {
            id: true,
            name: true,
            ipAddress: true,
            status: true,
          },
        },
      },
    })
  }

  static async getNetworkMetrics(
    tenantId: string,
    options: Partial<NetworkQuery> = {}
  ) {
    const {
      serverId,
      metricType,
      startDate,
      endDate,
      page = 1,
      limit = 20,
      sortBy,
      sortOrder,
    } = options

    const where: Prisma.NetworkMetricWhereInput = { tenantId }

    if (serverId) {
      where.serverId = serverId
    }

    if (metricType) {
      where.metricType = metricType
    }

    if (startDate || endDate) {
      where.timestamp = {}
      if (startDate) where.timestamp.gte = new Date(startDate)
      if (endDate) where.timestamp.lte = new Date(endDate)
    }

    const skip = (page - 1) * limit

    const [metrics, total] = await Promise.all([
      prisma.serverMetric.findMany({
        where,
        skip,
        take: limit,
        include: {
          server: {
            select: {
              id: true,
              name: true,
              ipAddress: true,
              status: true,
            },
          },
        },
        orderBy: { [sortBy as any]: sortOrder },
      }),
      prisma.serverMetric.count({ where }),
    ])

    return {
      metrics,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  // Alertas de conectividad
  static async createConnectivityAlert(
    data: CreateConnectivityAlertInput,
    tenantId: string
  ) {
    return await prisma.serverAlert.create({
      data: {
        serverId: data.serverId,
        type: data.type as any,
        severity: data.severity as any,
        title: data.title,
        description: data.description,
        status: 'ACTIVE',
        tenantId,
      },
      include: {
        server: {
          select: {
            id: true,
            name: true,
            ipAddress: true,
            status: true,
            client: {
              select: {
                id: true,
                companyName: true,
              },
            },
          },
        },
      },
    })
  }

  static async getConnectivityAlerts(tenantId: string, serverId?: string) {
    const where: Prisma.ConnectivityAlertWhereInput = {
      tenantId,
      type: {
        in: [
          'CONNECTIVITY_LOST',
          'HIGH_LATENCY',
          'PACKET_LOSS',
          'BANDWIDTH_EXCEEDED',
          'DNS_FAILURE',
          'ROUTING_ISSUE',
        ],
      },
    }

    if (serverId) {
      where.serverId = serverId
    }

    return await prisma.serverAlert.findMany({
      where,
      include: {
        server: {
          select: {
            id: true,
            name: true,
            ipAddress: true,
            status: true,
            client: {
              select: {
                id: true,
                companyName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  static async updateConnectivityAlert(
    id: string,
    data: UpdateConnectivityAlertInput,
    tenantId: string
  ) {
    return await prisma.serverAlert.update({
      where: { id, tenantId },
      data: {
        severity: data.severity as any,
        title: data.title,
        description: data.description,
        status: data.isActive ? 'ACTIVE' : 'RESOLVED',
      },
      include: {
        server: {
          select: {
            id: true,
            name: true,
            ipAddress: true,
            status: true,
            client: {
              select: {
                id: true,
                companyName: true,
              },
            },
          },
        },
      },
    })
  }

  // Estadísticas de red
  static async getNetworkStats(tenantId: string) {
    const [
      totalServers,
      serversWithNetworkConfig,
      totalNetworkConfigs,
      totalNetworkMetrics,
      activeConnectivityAlerts,
      networkMetricsByType,
      serversByConnectionType,
      recentNetworkMetrics,
      topBandwidthUsage,
    ] = await Promise.all([
      prisma.server.count({ where: { tenantId } }),
      prisma.server.count({
        where: {
          tenantId,
          networkConfigs: {
            some: {},
          },
        },
      }),
      prisma.networkConfig.count({ where: { tenantId } }),
      prisma.serverMetric.count({
        where: {
          tenantId,
          metricType: {
            in: [
              'NETWORK_IN',
              'NETWORK_OUT',
              'LATENCY',
              'PACKET_LOSS',
              'JITTER',
              'THROUGHPUT',
              'CONNECTIONS',
              'DNS_RESPONSE_TIME',
            ] as any,
          },
        },
      }),
      prisma.serverAlert.count({
        where: {
          tenantId,
          type: {
            in: [
              'CONNECTIVITY_LOST',
              'HIGH_LATENCY',
              'PACKET_LOSS',
              'BANDWIDTH_EXCEEDED',
              'DNS_FAILURE',
              'ROUTING_ISSUE',
            ] as any,
          },
          status: 'ACTIVE',
        },
      }),
      prisma.serverMetric.groupBy({
        by: ['metricType'],
        where: {
          tenantId,
          metricType: {
            in: [
              'NETWORK_IN',
              'NETWORK_OUT',
              'LATENCY',
              'PACKET_LOSS',
              'JITTER',
              'THROUGHPUT',
              'CONNECTIONS',
              'DNS_RESPONSE_TIME',
            ] as any,
          },
        },
        _count: { metricType: true },
        _avg: { value: true },
        orderBy: { _count: { metricType: 'desc' } },
      }),
      prisma.networkConfig.groupBy({
        by: ['connectionType'],
        where: { tenantId },
        _count: { connectionType: true },
        orderBy: { _count: { connectionType: 'desc' } },
      }),
      prisma.serverMetric.findMany({
        where: {
          tenantId,
          metricType: {
            in: ['NETWORK_IN', 'NETWORK_OUT', 'LATENCY'] as any,
          },
        },
        orderBy: { timestamp: 'desc' },
        take: 10,
        include: {
          server: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.serverMetric.findMany({
        where: {
          tenantId,
          metricType: 'NETWORK_IN' as any,
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24 horas
          },
        },
        orderBy: { value: 'desc' },
        take: 5,
        include: {
          server: {
            select: {
              id: true,
              name: true,
              client: { select: { companyName: true } },
            },
          },
        },
      }),
    ])

    return {
      totalServers,
      serversWithNetworkConfig,
      totalNetworkConfigs,
      totalNetworkMetrics,
      activeConnectivityAlerts,
      networkMetricsByType,
      serversByConnectionType,
      recentNetworkMetrics,
      topBandwidthUsage,
      networkConfigCoverage:
        totalServers > 0
          ? Math.round((serversWithNetworkConfig / totalServers) * 100)
          : 0,
    }
  }

  // Análisis de conectividad
  static async getConnectivityAnalysis(tenantId: string, serverId?: string) {
    const where: Prisma.NetworkMetricWhereInput = { tenantId }
    if (serverId) {
      where.serverId = serverId
    }

    const [latencyMetrics, packetLossMetrics, bandwidthMetrics, dnsMetrics] =
      await Promise.all([
        prisma.serverMetric.findMany({
          where: {
            ...where,
            metricType: 'LATENCY',
            timestamp: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24 horas
            },
          },
          orderBy: { timestamp: 'desc' },
          take: 100,
        }),
        prisma.serverMetric.findMany({
          where: {
            ...where,
            metricType: 'PACKET_LOSS',
            timestamp: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
          orderBy: { timestamp: 'desc' },
          take: 100,
        }),
        prisma.serverMetric.findMany({
          where: {
            ...where,
            metricType: { in: ['NETWORK_IN', 'NETWORK_OUT'] },
            timestamp: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
          orderBy: { timestamp: 'desc' },
          take: 100,
        }),
        prisma.serverMetric.findMany({
          where: {
            ...where,
            metricType: 'DNS_RESPONSE_TIME',
            timestamp: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
          orderBy: { timestamp: 'desc' },
          take: 100,
        }),
      ])

    // Calcular estadísticas
    const avgLatency =
      latencyMetrics.length > 0
        ? latencyMetrics.reduce((sum, m) => sum + Number(m.value), 0) /
          latencyMetrics.length
        : 0

    const avgPacketLoss =
      packetLossMetrics.length > 0
        ? packetLossMetrics.reduce((sum, m) => sum + Number(m.value), 0) /
          packetLossMetrics.length
        : 0

    const avgBandwidthIn =
      bandwidthMetrics
        .filter(m => m.metricType === 'NETWORK_IN')
        .reduce((sum, m) => sum + Number(m.value), 0) /
      Math.max(
        1,
        bandwidthMetrics.filter(m => m.metricType === 'NETWORK_IN').length
      )

    const avgBandwidthOut =
      bandwidthMetrics
        .filter(m => m.metricType === 'NETWORK_OUT')
        .reduce((sum, m) => sum + Number(m.value), 0) /
      Math.max(
        1,
        bandwidthMetrics.filter(m => m.metricType === 'NETWORK_OUT').length
      )

    const avgDnsResponseTime =
      dnsMetrics.length > 0
        ? dnsMetrics.reduce((sum, m) => sum + Number(m.value), 0) /
          dnsMetrics.length
        : 0

    return {
      avgLatency,
      avgPacketLoss,
      avgBandwidthIn,
      avgBandwidthOut,
      avgDnsResponseTime,
      latencyMetrics: latencyMetrics.slice(0, 20),
      packetLossMetrics: packetLossMetrics.slice(0, 20),
      bandwidthMetrics: bandwidthMetrics.slice(0, 20),
      dnsMetrics: dnsMetrics.slice(0, 20),
    }
  }

  // Monitoreo de conectividad en tiempo real
  static async getRealTimeConnectivity(tenantId: string) {
    const now = new Date()
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

    const [servers, recentMetrics] = await Promise.all([
      prisma.server.findMany({
        where: { tenantId },
        include: {
          networkConfigs: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
          metrics: {
            where: {
              metricType: {
                in: [
                  'LATENCY',
                  'PACKET_LOSS',
                  'NETWORK_IN',
                  'NETWORK_OUT',
                ] as any,
              },
              timestamp: { gte: fiveMinutesAgo },
            },
            orderBy: { timestamp: 'desc' },
            take: 1,
          },
        },
      }),
      prisma.serverMetric.findMany({
        where: {
          tenantId,
          metricType: {
            in: ['LATENCY', 'PACKET_LOSS', 'NETWORK_IN', 'NETWORK_OUT'] as any,
          },
          timestamp: { gte: fiveMinutesAgo },
        },
        include: {
          server: {
            select: { id: true, name: true, status: true },
          },
        },
        orderBy: { timestamp: 'desc' },
      }),
    ])

    // Agrupar métricas por servidor
    const serverMetrics = new Map()
    recentMetrics.forEach(metric => {
      if (!serverMetrics.has(metric.serverId)) {
        serverMetrics.set(metric.serverId, {})
      }
      serverMetrics.get(metric.serverId)[metric.metricType] = Number(
        metric.value
      )
    })

    // Calcular estado de conectividad para cada servidor
    const connectivityStatus = servers.map(server => {
      const metrics = serverMetrics.get(server.id) || {}
      const hasRecentMetrics = Object.keys(metrics).length > 0

      let status = 'UNKNOWN'
      let score = 0

      if (hasRecentMetrics) {
        // Calcular score de conectividad
        if (metrics.LATENCY && metrics.LATENCY < 100) score += 25
        else if (metrics.LATENCY && metrics.LATENCY < 200) score += 15
        else if (metrics.LATENCY && metrics.LATENCY < 500) score += 5

        if (metrics.PACKET_LOSS && metrics.PACKET_LOSS < 1) score += 25
        else if (metrics.PACKET_LOSS && metrics.PACKET_LOSS < 2) score += 15
        else if (metrics.PACKET_LOSS && metrics.PACKET_LOSS < 5) score += 5

        if (metrics.NETWORK_IN && metrics.NETWORK_IN > 0) score += 25
        if (metrics.NETWORK_OUT && metrics.NETWORK_OUT > 0) score += 25

        if (score >= 90) status = 'EXCELLENT'
        else if (score >= 70) status = 'GOOD'
        else if (score >= 50) status = 'FAIR'
        else if (score >= 30) status = 'POOR'
        else status = 'CRITICAL'
      }

      return {
        server,
        metrics,
        status,
        score,
        hasRecentMetrics,
      }
    })

    return connectivityStatus
  }

  // Verificar conectividad
  static async checkConnectivity(serverId: string, tenantId: string) {
    // Simular verificación de conectividad
    // En un entorno real, esto haría ping, traceroute, etc.
    const server = await prisma.server.findFirst({
      where: { id: serverId, tenantId },
      include: {
        networkConfigs: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!server) {
      throw new Error('Servidor no encontrado')
    }

    // Simular métricas de conectividad
    const latency = Math.random() * 100 + 10 // 10-110ms
    const packetLoss = Math.random() * 2 // 0-2%
    const bandwidthIn = Math.random() * 100 + 10 // 10-110 Mbps
    const bandwidthOut = Math.random() * 50 + 5 // 5-55 Mbps

    // Crear métricas
    const metrics = await Promise.all([
      this.createNetworkMetric(
        {
          serverId,
          metricType: 'LATENCY',
          value: latency,
          unit: 'ms',
          source: 'connectivity_check',
        },
        tenantId
      ),
      this.createNetworkMetric(
        {
          serverId,
          metricType: 'PACKET_LOSS',
          value: packetLoss,
          unit: '%',
          source: 'connectivity_check',
        },
        tenantId
      ),
      this.createNetworkMetric(
        {
          serverId,
          metricType: 'NETWORK_IN' as any,
          value: bandwidthIn,
          unit: 'Mbps',
          source: 'connectivity_check',
        },
        tenantId
      ),
      this.createNetworkMetric(
        {
          serverId,
          metricType: 'NETWORK_OUT' as any,
          value: bandwidthOut,
          unit: 'Mbps',
          source: 'connectivity_check',
        },
        tenantId
      ),
    ])

    // Verificar si hay alertas que crear
    if (latency > 200) {
      await this.createConnectivityAlert(
        {
          serverId,
          type: 'HIGH_LATENCY' as any,
          severity: latency > 500 ? 'CRITICAL' : 'HIGH',
          title: 'Alta latencia detectada',
          description: `Latencia de ${latency.toFixed(2)}ms excede el umbral normal`,
          threshold: 200,
          actualValue: latency,
        } as any,
        tenantId
      )
    }

    if (packetLoss > 1) {
      await this.createConnectivityAlert(
        {
          serverId,
          type: 'PACKET_LOSS' as any,
          severity: packetLoss > 5 ? 'CRITICAL' : 'HIGH',
          title: 'Pérdida de paquetes detectada',
          description: `Pérdida de paquetes del ${packetLoss.toFixed(2)}% detectada`,
          threshold: 1,
          actualValue: packetLoss,
        } as any,
        tenantId
      )
    }

    return {
      server,
      metrics,
      summary: {
        latency,
        packetLoss,
        bandwidthIn,
        bandwidthOut,
        status: latency < 100 && packetLoss < 1 ? 'HEALTHY' : 'DEGRADED',
      },
    }
  }
}
