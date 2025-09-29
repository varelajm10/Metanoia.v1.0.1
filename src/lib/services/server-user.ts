import { PrismaClient } from '@prisma/client'
import {
  CreateServerUserAccessInput,
  UpdateServerUserAccessInput,
  ServerUserQuery,
} from '@/lib/validations/server-user'

const prisma = new PrismaClient()

export interface ServerUserAccessWithRelations {
  id: string
  username: string
  email: string
  fullName: string
  department?: string | null
  jobTitle?: string | null
  accessType: string
  accessLevel: string
  status: string
  sshKey?: string | null
  twoFactorEnabled: boolean
  lastLogin?: Date | null
  lastActivity?: Date | null
  expiresAt?: Date | null
  notes?: string | null
  createdBy?: string | null
  createdAt: Date
  updatedAt: Date
  serverId: string
  tenantId: string
  server: {
    id: string
    name: string
    hostname?: string | null
    ipAddress: string
    status: string
  }
  accessLogs: Array<{
    id: string
    action: string
    ipAddress?: string | null
    success: boolean
    createdAt: Date
  }>
  _count?: {
    accessLogs: number
  }
}

export class ServerUserAccessService {
  static async createUserAccess(
    data: CreateServerUserAccessInput,
    tenantId: string
  ) {
    return await prisma.serverUserAccess.create({
      data: {
        ...data,
        tenantId,
        lastLogin: data.lastLogin ? new Date(data.lastLogin) : null,
        lastActivity: data.lastActivity ? new Date(data.lastActivity) : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
      include: {
        server: {
          select: {
            id: true,
            name: true,
            hostname: true,
            ipAddress: true,
            status: true,
          },
        },
        accessLogs: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            action: true,
            ipAddress: true,
            success: true,
            createdAt: true,
          },
        },
        _count: {
          select: { accessLogs: true },
        },
      },
    })
  }

  static async getUserAccesses(
    tenantId: string,
    options: Partial<ServerUserQuery> = {}
  ) {
    const {
      page = 1,
      limit = 20,
      search,
      serverId,
      status,
      accessType,
      accessLevel,
      sortBy,
      sortOrder,
    } = options
    const skip = (page - 1) * limit

    const where: any = { tenantId }

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } },
        { jobTitle: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (serverId) {
      where.serverId = serverId
    }

    if (status) {
      where.status = status
    }

    if (accessType) {
      where.accessType = accessType
    }

    if (accessLevel) {
      where.accessLevel = accessLevel
    }

    const [userAccesses, total] = await Promise.all([
      prisma.serverUserAccess.findMany({
        where,
        skip,
        take: limit,
        include: {
          server: {
            select: {
              id: true,
              name: true,
              hostname: true,
              ipAddress: true,
              status: true,
            },
          },
          accessLogs: {
            orderBy: { createdAt: 'desc' },
            take: 3,
            select: {
              id: true,
              action: true,
              ipAddress: true,
              success: true,
              createdAt: true,
            },
          },
          _count: {
            select: { accessLogs: true },
          },
        },
        orderBy: { [sortBy as any]: sortOrder },
      }),
      prisma.serverUserAccess.count({ where }),
    ])

    return {
      userAccesses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  static async getUserAccessById(id: string, tenantId: string) {
    return await prisma.serverUserAccess.findFirst({
      where: { id, tenantId },
      include: {
        server: {
          select: {
            id: true,
            name: true,
            hostname: true,
            ipAddress: true,
            status: true,
          },
        },
        accessLogs: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { accessLogs: true },
        },
      },
    })
  }

  static async updateUserAccess(
    id: string,
    data: UpdateServerUserAccessInput,
    tenantId: string
  ) {
    return await prisma.serverUserAccess.update({
      where: { id, tenantId },
      data: {
        ...data,
        lastLogin: data.lastLogin ? new Date(data.lastLogin) : undefined,
        lastActivity: data.lastActivity
          ? new Date(data.lastActivity)
          : undefined,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
      include: {
        server: {
          select: {
            id: true,
            name: true,
            hostname: true,
            ipAddress: true,
            status: true,
          },
        },
        accessLogs: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            action: true,
            ipAddress: true,
            success: true,
            createdAt: true,
          },
        },
        _count: {
          select: { accessLogs: true },
        },
      },
    })
  }

  static async deleteUserAccess(id: string, tenantId: string) {
    return await prisma.serverUserAccess.delete({
      where: { id, tenantId },
    })
  }

  static async toggleUserStatus(id: string, tenantId: string, status: string) {
    return await prisma.serverUserAccess.update({
      where: { id, tenantId },
      data: { status: status as any },
      include: {
        server: {
          select: {
            id: true,
            name: true,
            hostname: true,
            ipAddress: true,
            status: true,
          },
        },
        accessLogs: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            action: true,
            ipAddress: true,
            success: true,
            createdAt: true,
          },
        },
        _count: {
          select: { accessLogs: true },
        },
      },
    })
  }

  static async getUserAccessStats(tenantId: string) {
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      expiredUsers,
      pendingUsers,
      usersByAccessType,
      usersByAccessLevel,
      usersByServer,
      recentUsers,
      recentLogins,
    ] = await Promise.all([
      prisma.serverUserAccess.count({ where: { tenantId } }),
      prisma.serverUserAccess.count({ where: { tenantId, status: 'ACTIVE' } }),
      prisma.serverUserAccess.count({
        where: { tenantId, status: 'INACTIVE' },
      }),
      prisma.serverUserAccess.count({
        where: { tenantId, status: 'SUSPENDED' },
      }),
      prisma.serverUserAccess.count({ where: { tenantId, status: 'EXPIRED' } }),
      prisma.serverUserAccess.count({
        where: { tenantId, status: 'PENDING_APPROVAL' },
      }),
      prisma.serverUserAccess.groupBy({
        by: ['accessType'],
        where: { tenantId },
        _count: { accessType: true },
        orderBy: { _count: { accessType: 'desc' } },
      }),
      prisma.serverUserAccess.groupBy({
        by: ['accessLevel'],
        where: { tenantId },
        _count: { accessLevel: true },
        orderBy: { _count: { accessLevel: 'desc' } },
      }),
      prisma.serverUserAccess.groupBy({
        by: ['serverId'],
        where: { tenantId },
        _count: { serverId: true },
        orderBy: { _count: { serverId: 'desc' } },
      }),
      prisma.serverUserAccess.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          server: {
            select: { id: true, name: true, ipAddress: true },
          },
        },
      }),
      prisma.serverUserAccess.findMany({
        where: {
          tenantId,
          lastLogin: { not: null },
        },
        orderBy: { lastLogin: 'desc' },
        take: 5,
        include: {
          server: {
            select: { id: true, name: true, ipAddress: true },
          },
        },
      }),
    ])

    // Calcular tasa de actividad
    const activityRate =
      totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      expiredUsers,
      pendingUsers,
      activityRate,
      usersByAccessType,
      usersByAccessLevel,
      usersByServer,
      recentUsers,
      recentLogins,
    }
  }

  static async logAccess(
    data: {
      userAccessId: string
      action: string
      ipAddress?: string
      userAgent?: string
      success: boolean
      failureReason?: string
      sessionDuration?: number
      commandsExecuted?: string[]
    },
    tenantId: string
  ) {
    return await prisma.serverAccessLog.create({
      data: {
        ...data,
        tenantId,
      } as any,
    })
  }

  static async getAccessLogs(
    userAccessId: string,
    tenantId: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit

    const [logs, total] = await Promise.all([
      prisma.serverAccessLog.findMany({
        where: { userAccessId, tenantId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.serverAccessLog.count({ where: { userAccessId, tenantId } }),
    ])

    return {
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  static async searchUsers(
    query: string,
    tenantId: string,
    limit: number = 10
  ) {
    if (!query || query.trim().length < 2) {
      return []
    }

    return prisma.serverUserAccess.findMany({
      where: {
        tenantId,
        status: 'ACTIVE',
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { fullName: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        server: {
          select: { id: true, name: true, ipAddress: true },
        },
      },
      orderBy: {
        username: 'asc',
      },
      take: limit,
    })
  }
}
