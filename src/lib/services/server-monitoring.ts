import { PrismaClient } from '@prisma/client'
import {
  CreateServerMetricInput,
  CreateMetricThresholdInput,
  UpdateMetricThresholdInput,
  CreateNotificationInput,
  UpdateNotificationInput,
  CreateServerHealthInput,
  UpdateServerHealthInput,
  MetricQuery,
  NotificationQuery,
} from '@/lib/validations/server-monitoring'

const prisma = new PrismaClient()

export interface ServerMetricWithRelations {
  id: string
  metricType: string
  value: number
  unit?: string | null
  timestamp: Date
  source?: string | null
  threshold?: number | null
  isAlert: boolean
  serverId: string
  server: {
    id: string
    name: string
    ipAddress: string
    status: string
  }
}

export interface MetricThresholdWithRelations {
  id: string
  metricType: string
  warningThreshold?: number | null
  criticalThreshold?: number | null
  isEnabled: boolean
  notifyOnWarning: boolean
  notifyOnCritical: boolean
  notificationChannels: string[]
  cooldownMinutes: number
  lastNotification?: Date | null
  serverId: string
  server: {
    id: string
    name: string
    ipAddress: string
    status: string
  }
}

export interface NotificationWithRelations {
  id: string
  type: string
  severity: string
  title: string
  message: string
  channel: string
  status: string
  sentAt?: Date | null
  deliveredAt?: Date | null
  failedAt?: Date | null
  failureReason?: string | null
  metadata?: any
  retryCount: number
  maxRetries: number
  createdAt: Date
  serverId: string
  server: {
    id: string
    name: string
    ipAddress: string
    status: string
  }
}

export interface ServerHealthWithRelations {
  id: string
  overallStatus: string
  lastChecked: Date
  cpuUsage?: number | null
  memoryUsage?: number | null
  diskUsage?: number | null
  networkIn?: number | null
  networkOut?: number | null
  uptime?: number | null
  responseTime?: number | null
  activeAlerts: number
  criticalAlerts: number
  warningAlerts: number
  loadAverage?: number | null
  processes?: number | null
  connections?: number | null
  temperature?: number | null
  serverId: string
  server: {
    id: string
    name: string
    ipAddress: string
    status: string
    client: {
      companyName: string
    }
  }
}

export class ServerMonitoringService {
  // Métricas
  static async createMetric(data: CreateServerMetricInput, tenantId: string) {
    return await prisma.serverMetric.create({
      data: {
        ...data,
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

  static async getMetrics(
    tenantId: string,
    options: Partial<MetricQuery> = {}
  ) {
    const {
      serverId,
      metricType,
      startDate,
      endDate,
      limit = 100,
      interval = '5m',
    } = options

    const where: any = { tenantId }

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

    return await prisma.serverMetric.findMany({
      where,
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
      orderBy: { timestamp: 'desc' },
      take: limit,
    })
  }

  static async getLatestMetrics(tenantId: string, serverId?: string) {
    const where: any = { tenantId }
    if (serverId) {
      where.serverId = serverId
    }

    // Obtener la última métrica de cada tipo para cada servidor
    const servers = await prisma.server.findMany({
      where: { tenantId },
      include: {
        metrics: {
          orderBy: { timestamp: 'desc' },
          take: 1,
          where: serverId ? { serverId } : undefined,
        },
      },
    })

    return servers.filter(server => server.metrics.length > 0)
  }

  // Umbrales
  static async createThreshold(
    data: CreateMetricThresholdInput,
    tenantId: string
  ) {
    return await prisma.metricThreshold.create({
      data: {
        ...data,
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

  static async getThresholds(tenantId: string, serverId?: string) {
    const where: any = { tenantId }
    if (serverId) {
      where.serverId = serverId
    }

    return await prisma.metricThreshold.findMany({
      where,
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
      orderBy: { createdAt: 'desc' },
    })
  }

  static async updateThreshold(
    id: string,
    data: UpdateMetricThresholdInput,
    tenantId: string
  ) {
    return await prisma.metricThreshold.update({
      where: { id, tenantId },
      data,
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

  static async deleteThreshold(id: string, tenantId: string) {
    return await prisma.metricThreshold.delete({
      where: { id, tenantId },
    })
  }

  // Notificaciones
  static async createNotification(
    data: CreateNotificationInput,
    tenantId: string
  ) {
    return await prisma.notification.create({
      data: {
        ...data,
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

  static async getNotifications(
    tenantId: string,
    options: Partial<NotificationQuery> = {}
  ) {
    const {
      serverId,
      type,
      severity,
      channel,
      status,
      page = 1,
      limit = 20,
    } = options

    const where: any = { tenantId }
    const skip = (page - 1) * limit

    if (serverId) {
      where.serverId = serverId
    }

    if (type) {
      where.type = type
    }

    if (severity) {
      where.severity = severity
    }

    if (channel) {
      where.channel = channel
    }

    if (status) {
      where.status = status
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
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
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
    ])

    return {
      notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  static async updateNotification(
    id: string,
    data: UpdateNotificationInput,
    tenantId: string
  ) {
    return await prisma.notification.update({
      where: { id, tenantId },
      data,
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

  // Estado de salud
  static async updateServerHealth(
    data: CreateServerHealthInput,
    tenantId: string
  ) {
    return await prisma.serverHealth.upsert({
      where: {
        serverId_tenantId: {
          serverId: data.serverId,
          tenantId,
        },
      },
      update: {
        ...data,
        lastChecked: new Date(),
      },
      create: {
        ...data,
        tenantId,
        lastChecked: new Date(),
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
                companyName: true,
              },
            },
          },
        },
      },
    })
  }

  static async getServerHealth(tenantId: string, serverId?: string) {
    const where: any = { tenantId }
    if (serverId) {
      where.serverId = serverId
    }

    return await prisma.serverHealth.findMany({
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
                companyName: true,
              },
            },
          },
        },
      },
      orderBy: { lastChecked: 'desc' },
    })
  }

  // Estadísticas de monitoreo
  static async getMonitoringStats(tenantId: string) {
    const [
      totalServers,
      healthyServers,
      warningServers,
      criticalServers,
      offlineServers,
      totalAlerts,
      criticalAlerts,
      warningAlerts,
      totalNotifications,
      pendingNotifications,
      failedNotifications,
      recentMetrics,
      topMetrics,
    ] = await Promise.all([
      prisma.server.count({ where: { tenantId } }),
      prisma.serverHealth.count({
        where: { tenantId, overallStatus: 'HEALTHY' },
      }),
      prisma.serverHealth.count({
        where: { tenantId, overallStatus: 'WARNING' },
      }),
      prisma.serverHealth.count({
        where: { tenantId, overallStatus: 'CRITICAL' },
      }),
      prisma.serverHealth.count({
        where: { tenantId, overallStatus: 'OFFLINE' },
      }),
      prisma.serverAlert.count({ where: { tenantId, status: 'ACTIVE' } }),
      prisma.serverAlert.count({
        where: { tenantId, severity: 'CRITICAL', status: 'ACTIVE' },
      }),
      prisma.serverAlert.count({
        where: { tenantId, severity: 'HIGH', status: 'ACTIVE' },
      }),
      prisma.notification.count({ where: { tenantId } }),
      prisma.notification.count({ where: { tenantId, status: 'PENDING' } }),
      prisma.notification.count({ where: { tenantId, status: 'FAILED' } }),
      prisma.serverMetric.findMany({
        where: { tenantId },
        orderBy: { timestamp: 'desc' },
        take: 10,
        include: {
          server: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.serverMetric.groupBy({
        by: ['metricType'],
        where: {
          tenantId,
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24 horas
          },
        },
        _count: { metricType: true },
        _avg: { value: true },
        orderBy: { _count: { metricType: 'desc' } },
      }),
    ])

    return {
      totalServers,
      healthyServers,
      warningServers,
      criticalServers,
      offlineServers,
      totalAlerts,
      criticalAlerts,
      warningAlerts,
      totalNotifications,
      pendingNotifications,
      failedNotifications,
      recentMetrics,
      topMetrics,
    }
  }

  // Verificar umbrales y crear alertas
  static async checkThresholds(
    tenantId: string,
    serverId: string,
    metricType: string,
    value: number
  ) {
    const threshold = await prisma.metricThreshold.findFirst({
      where: {
        tenantId,
        serverId,
        metricType: metricType as any,
        isEnabled: true,
      },
    })

    if (!threshold) return null

    let alertLevel: 'WARNING' | 'CRITICAL' | null = null
    let shouldNotify = false

    // Verificar umbral crítico
    if (
      threshold.criticalThreshold &&
      value >= Number(threshold.criticalThreshold)
    ) {
      alertLevel = 'CRITICAL'
      shouldNotify = threshold.notifyOnCritical
    }
    // Verificar umbral de advertencia
    else if (
      threshold.warningThreshold &&
      value >= Number(threshold.warningThreshold)
    ) {
      alertLevel = 'WARNING'
      shouldNotify = threshold.notifyOnWarning
    }

    if (!alertLevel) return null

    // Verificar cooldown
    const now = new Date()
    const lastNotification = threshold.lastNotification
    const cooldownMs = threshold.cooldownMinutes * 60 * 1000

    if (
      lastNotification &&
      now.getTime() - lastNotification.getTime() < cooldownMs
    ) {
      shouldNotify = false
    }

    // Crear alerta
    const alert = await prisma.serverAlert.create({
      data: {
        serverId,
        type: 'PERFORMANCE_DEGRADED',
        severity: alertLevel as any,
        title: `Umbral de ${metricType} excedido`,
        description: `${metricType} está en ${value}%, umbral: ${alertLevel === 'CRITICAL' ? threshold.criticalThreshold : threshold.warningThreshold}%`,
        status: 'ACTIVE',
        tenantId,
      },
    })

    // Crear notificación si es necesario
    if (shouldNotify) {
      await prisma.notification.create({
        data: {
          serverId,
          type: 'METRIC_THRESHOLD',
          severity: alertLevel as any,
          title: alert.title,
          message: alert.description,
          channel: (threshold.notificationChannels[0] || 'EMAIL') as any,
          tenantId,
        },
      })

      // Actualizar última notificación
      await prisma.metricThreshold.update({
        where: { id: threshold.id },
        data: { lastNotification: now },
      })
    }

    return alert
  }

  // Obtener métricas agregadas por intervalo
  static async getAggregatedMetrics(
    tenantId: string,
    serverId: string,
    metricType: string,
    interval: '1m' | '5m' | '15m' | '1h' | '1d' = '5m',
    hours: number = 24
  ) {
    const startDate = new Date(Date.now() - hours * 60 * 60 * 1000)

    const metrics = await prisma.serverMetric.findMany({
      where: {
        tenantId,
        serverId,
        metricType: metricType as any,
        timestamp: {
          gte: startDate,
        },
      },
      orderBy: { timestamp: 'asc' },
    })

    // Agregar métricas por intervalo
    const intervalMs = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000,
    }[interval]

    const aggregated: Array<{
      timestamp: Date
      avg: number
      min: number
      max: number
      count: number
    }> = []

    for (let i = 0; i < metrics.length; i += 10) {
      // Agrupar de 10 en 10 para simular agregación
      const group = metrics.slice(i, i + 10)
      if (group.length === 0) continue

      const values = group.map(m => Number(m.value))
      aggregated.push({
        timestamp: group[0].timestamp,
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length,
      })
    }

    return aggregated
  }
}
