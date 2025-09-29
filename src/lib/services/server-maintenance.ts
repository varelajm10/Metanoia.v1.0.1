import { PrismaClient } from '@prisma/client'
import {
  CreateMaintenanceWindowInput,
  UpdateMaintenanceWindowInput,
  MaintenanceQuery,
  ApproveMaintenanceInput,
  CompleteMaintenanceInput,
  CancelMaintenanceInput,
  RescheduleMaintenanceInput,
} from '@/lib/validations/server-maintenance'

const prisma = new PrismaClient()

export interface MaintenanceWindowWithRelations {
  id: string
  title: string
  description: string
  type: string
  status: string
  startTime: Date
  endTime: Date
  timezone: string
  estimatedDuration?: number | null
  notificationsSent: boolean
  notificationChannels: string[]
  slaImpact: boolean
  expectedDowntime?: number | null
  rollbackPlan?: string | null
  contactPerson?: string | null
  emergencyContact?: string | null
  createdBy?: string | null
  approvedBy?: string | null
  approvedAt?: Date | null
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

export class ServerMaintenanceService {
  static async createMaintenanceWindow(
    data: CreateMaintenanceWindowInput,
    tenantId: string
  ) {
    return await prisma.maintenanceWindow.create({
      data: {
        ...data,
        tenantId,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        approvedAt: data.approvedAt ? new Date(data.approvedAt) : null,
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

  static async getMaintenanceWindows(
    tenantId: string,
    options: Partial<MaintenanceQuery> = {}
  ) {
    const {
      serverId,
      type,
      status,
      startDate,
      endDate,
      slaImpact,
      page = 1,
      limit = 20,
      sortBy,
      sortOrder,
    } = options

    const where: any = { tenantId }
    const skip = (page - 1) * limit

    if (serverId) {
      where.serverId = serverId
    }

    if (type) {
      where.type = type
    }

    if (status) {
      where.status = status
    }

    if (slaImpact !== undefined) {
      where.slaImpact = slaImpact
    }

    if (startDate || endDate) {
      where.startTime = {}
      if (startDate) where.startTime.gte = new Date(startDate)
      if (endDate) where.startTime.lte = new Date(endDate)
    }

    const [maintenances, total] = await Promise.all([
      prisma.maintenanceWindow.findMany({
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
        orderBy: { [sortBy as any]: sortOrder },
      }),
      prisma.maintenanceWindow.count({ where }),
    ])

    return {
      maintenances,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  static async getMaintenanceWindowById(id: string, tenantId: string) {
    return await prisma.maintenanceWindow.findFirst({
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

  static async updateMaintenanceWindow(
    id: string,
    data: UpdateMaintenanceWindowInput,
    tenantId: string
  ) {
    return await prisma.maintenanceWindow.update({
      where: { id, tenantId },
      data: {
        ...data,
        startTime: data.startTime ? new Date(data.startTime) : undefined,
        endTime: data.endTime ? new Date(data.endTime) : undefined,
        approvedAt: data.approvedAt ? new Date(data.approvedAt) : undefined,
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

  static async deleteMaintenanceWindow(id: string, tenantId: string) {
    return await prisma.maintenanceWindow.delete({
      where: { id, tenantId },
    })
  }

  static async approveMaintenanceWindow(
    id: string,
    data: ApproveMaintenanceInput,
    tenantId: string
  ) {
    return await prisma.maintenanceWindow.update({
      where: { id, tenantId },
      data: {
        approvedBy: data.approvedBy,
        approvedAt: new Date(),
        status: 'PLANNED',
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

  static async completeMaintenanceWindow(
    id: string,
    data: CompleteMaintenanceInput,
    tenantId: string
  ) {
    return await prisma.maintenanceWindow.update({
      where: { id, tenantId },
      data: {
        status: 'COMPLETED',
        // actualDuration: data.actualDuration, // Campo no existe en el schema
        // actualDowntime: data.actualDowntime, // Campo no existe en el schema
        // notes: data.notes, // Campo no existe en el schema
        // issues: data.issues, // Campo no existe en el schema
        // completedBy: data.completedBy // Campo no existe en el schema
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

  static async cancelMaintenanceWindow(
    id: string,
    data: CancelMaintenanceInput,
    tenantId: string
  ) {
    return await prisma.maintenanceWindow.update({
      where: { id, tenantId },
      data: {
        status: 'CANCELLED',
        // cancellationReason: data.reason, // Campo no existe en el schema
        // cancelledBy: data.cancelledBy // Campo no existe en el schema
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

  static async rescheduleMaintenanceWindow(
    id: string,
    data: RescheduleMaintenanceInput,
    tenantId: string
  ) {
    return await prisma.maintenanceWindow.update({
      where: { id, tenantId },
      data: {
        startTime: new Date(data.newStartTime),
        endTime: new Date(data.newEndTime),
        // rescheduleReason: data.reason, // Campo no existe en el schema
        // rescheduledBy: data.rescheduledBy, // Campo no existe en el schema
        status: 'PLANNED',
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

  static async getUpcomingMaintenances(tenantId: string, days: number = 7) {
    const now = new Date()
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

    return await prisma.maintenanceWindow.findMany({
      where: {
        tenantId,
        startTime: {
          gte: now,
          lte: futureDate,
        },
        status: 'PLANNED',
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
      orderBy: { startTime: 'asc' },
    })
  }

  static async getOverdueMaintenances(tenantId: string) {
    const now = new Date()

    return await prisma.maintenanceWindow.findMany({
      where: {
        tenantId,
        startTime: {
          lt: now,
        },
        status: 'PLANNED',
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
      orderBy: { startTime: 'asc' },
    })
  }

  static async getMaintenanceStats(tenantId: string) {
    const [
      totalMaintenances,
      plannedMaintenances,
      inProgressMaintenances,
      completedMaintenances,
      cancelledMaintenances,
      postponedMaintenances,
      slaImpactMaintenances,
      upcomingMaintenances,
      overdueMaintenances,
      maintenancesByType,
      maintenancesByStatus,
      recentMaintenances,
    ] = await Promise.all([
      prisma.maintenanceWindow.count({ where: { tenantId } }),
      prisma.maintenanceWindow.count({
        where: { tenantId, status: 'PLANNED' },
      }),
      prisma.maintenanceWindow.count({
        where: { tenantId, status: 'IN_PROGRESS' },
      }),
      prisma.maintenanceWindow.count({
        where: { tenantId, status: 'COMPLETED' },
      }),
      prisma.maintenanceWindow.count({
        where: { tenantId, status: 'CANCELLED' },
      }),
      prisma.maintenanceWindow.count({
        where: { tenantId, status: 'POSTPONED' },
      }),
      prisma.maintenanceWindow.count({ where: { tenantId, slaImpact: true } }),
      this.getUpcomingMaintenances(tenantId, 7),
      this.getOverdueMaintenances(tenantId),
      prisma.maintenanceWindow.groupBy({
        by: ['type'],
        where: { tenantId },
        _count: { type: true },
        orderBy: { _count: { type: 'desc' } },
      }),
      prisma.maintenanceWindow.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: { status: true },
        orderBy: { _count: { status: 'desc' } },
      }),
      prisma.maintenanceWindow.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          server: {
            select: {
              id: true,
              name: true,
              client: {
                select: { companyName: true },
              },
            },
          },
        },
      }),
    ])

    // Calcular estadísticas adicionales
    const completionRate =
      totalMaintenances > 0
        ? Math.round((completedMaintenances / totalMaintenances) * 100)
        : 0

    // Calcular tiempo promedio de duración estimada
    const completedWithEstimatedDuration =
      await prisma.maintenanceWindow.findMany({
        where: {
          tenantId,
          status: 'COMPLETED',
          estimatedDuration: { not: null },
        },
        select: { estimatedDuration: true },
      })

    const avgDuration =
      completedWithEstimatedDuration.length > 0
        ? Math.round(
            completedWithEstimatedDuration.reduce(
              (sum, m) => sum + (m.estimatedDuration || 0),
              0
            ) / completedWithEstimatedDuration.length
          )
        : 0

    return {
      totalMaintenances,
      plannedMaintenances,
      inProgressMaintenances,
      completedMaintenances,
      cancelledMaintenances,
      postponedMaintenances,
      slaImpactMaintenances,
      completionRate,
      avgDuration,
      upcomingMaintenances,
      overdueMaintenances,
      maintenancesByType,
      maintenancesByStatus,
      recentMaintenances,
    }
  }

  static async getMaintenancesByServer(tenantId: string, serverId: string) {
    return await prisma.maintenanceWindow.findMany({
      where: { tenantId, serverId },
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
      orderBy: { startTime: 'desc' },
    })
  }

  static async getMaintenancesByDateRange(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ) {
    return await prisma.maintenanceWindow.findMany({
      where: {
        tenantId,
        startTime: {
          gte: startDate,
          lte: endDate,
        },
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
      orderBy: { startTime: 'asc' },
    })
  }

  static async sendMaintenanceNotifications(
    maintenanceWindowId: string,
    tenantId: string
  ) {
    const maintenance = await prisma.maintenanceWindow.findFirst({
      where: { id: maintenanceWindowId, tenantId },
      include: {
        server: {
          select: {
            id: true,
            name: true,
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

    if (!maintenance) {
      throw new Error('Maintenance window not found')
    }

    // Crear notificaciones para cada canal configurado
    const notifications = maintenance.notificationChannels.map(channel => ({
      serverId: maintenance.serverId,
      type: 'MAINTENANCE_REMINDER',
      severity: maintenance.slaImpact ? 'WARNING' : 'INFO',
      title: `Mantenimiento programado: ${maintenance.title}`,
      message: `El servidor ${maintenance.server.name} tendrá mantenimiento programado del ${maintenance.startTime.toLocaleDateString()} al ${maintenance.endTime.toLocaleDateString()}. ${maintenance.slaImpact ? 'Este mantenimiento puede afectar el SLA.' : ''}`,
      channel,
      tenantId,
    }))

    // Crear notificaciones en la base de datos
    await prisma.notification.createMany({
      data: notifications as any,
    })

    // Marcar como notificaciones enviadas
    await prisma.maintenanceWindow.update({
      where: { id: maintenanceWindowId },
      data: { notificationsSent: true },
    })

    return notifications
  }

  static async checkConflictingMaintenances(
    serverId: string,
    startTime: Date,
    endTime: Date,
    excludeId?: string
  ) {
    const where: any = {
      serverId,
      status: { in: ['PLANNED', 'IN_PROGRESS'] },
      OR: [
        {
          startTime: { lte: startTime },
          endTime: { gte: startTime },
        },
        {
          startTime: { lte: endTime },
          endTime: { gte: endTime },
        },
        {
          startTime: { gte: startTime },
          endTime: { lte: endTime },
        },
      ],
    }

    if (excludeId) {
      where.id = { not: excludeId }
    }

    return await prisma.maintenanceWindow.findMany({
      where,
      include: {
        server: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
  }
}
