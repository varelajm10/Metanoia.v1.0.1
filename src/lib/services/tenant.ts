import { PrismaClient } from '@prisma/client'
import {
  CreateTenantInput,
  UpdateTenantInput,
  ToggleModuleInput,
  ChangeSubscriptionInput,
} from '@/lib/validations/tenant'

const prisma = new PrismaClient()

export interface TenantWithModules {
  id: string
  name: string
  slug: string
  email: string
  phone?: string | null
  address?: string | null
  city?: string | null
  country?: string | null
  timezone: string
  currency: string
  contactName: string
  contactEmail: string
  contactPhone?: string | null
  isActive: boolean
  subscriptionPlan: string
  subscriptionStartDate: Date
  subscriptionEndDate?: Date | null
  maxUsers: number
  maxServers: number
  maxStorageGB: number
  notes?: string | null
  customDomain?: string | null
  createdAt: Date
  updatedAt: Date
  enabledModules: string[]
  modules: Array<{
    id: string
    name: string
    category: string
    isEnabled: boolean
    enabledAt?: Date | null
    disabledAt?: Date | null
  }>
  _count?: {
    users: number
    servers: number
    customers: number
  }
}

export class TenantService {
  static async createTenant(data: CreateTenantInput) {
    const tenant = await prisma.tenant.create({
      data: {
        name: data.name,
        slug: data.slug,
        email: data.email,
        phone: data.phone || null,
        address: data.address || null,
        city: data.city || null,
        country: data.country || null,
        timezone: data.timezone,
        currency: data.currency,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone || null,
        isActive: data.isActive,
        subscriptionPlan: data.subscriptionPlan as any,
        subscriptionStartDate: new Date(data.subscriptionStartDate),
        subscriptionEndDate: data.subscriptionEndDate
          ? new Date(data.subscriptionEndDate)
          : null,
        maxUsers: data.maxUsers,
        maxServers: data.maxServers,
        maxStorageGB: data.maxStorageGB,
        notes: data.notes || null,
        customDomain: data.customDomain || null,
      },
    })

    // Habilitar módulos especificados
    if (data.enabledModules.length > 0) {
      await this.enableModules(tenant.id, data.enabledModules)
    }

    return await this.getTenantById(tenant.id)
  }

  static async getTenants(
    page: number = 1,
    limit: number = 20,
    filters: any = {}
  ) {
    const skip = (page - 1) * limit
    const where: any = {}

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { slug: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive
    }

    if (filters.subscriptionPlan) {
      where.subscriptionPlan = filters.subscriptionPlan
    }

    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({
        where,
        skip,
        take: limit,
        include: {
          tenantModules: {
            include: {
              module: true,
            },
          },
          _count: {
            select: {
              users: true,
              servers: true,
              customers: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.tenant.count({ where }),
    ])

    const formattedTenants = tenants.map(tenant => ({
      ...tenant,
      enabledModules: tenant.tenantModules
        .filter(tm => tm.isEnabled)
        .map(tm => tm.module.key),
      modules: tenant.tenantModules.map(tm => ({
        id: tm.module.key,
        name: tm.module.name,
        category: tm.module.category,
        isEnabled: tm.isEnabled,
        enabledAt: tm.enabledAt,
        disabledAt: tm.disabledAt,
      })),
    }))

    return {
      tenants: formattedTenants,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  static async getTenantById(id: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        tenantModules: {
          include: {
            module: true,
          },
        },
        _count: {
          select: {
            users: true,
            servers: true,
            customers: true,
          },
        },
      },
    })

    if (!tenant) return null

    return {
      ...tenant,
      enabledModules: tenant.tenantModules
        .filter(tm => tm.isEnabled)
        .map(tm => tm.module.key),
      modules: tenant.tenantModules.map(tm => ({
        id: tm.module.key,
        name: tm.module.name,
        category: tm.module.category,
        isEnabled: tm.isEnabled,
        enabledAt: tm.enabledAt,
        disabledAt: tm.disabledAt,
      })),
    }
  }

  static async getTenantBySlug(slug: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      include: {
        tenantModules: {
          include: {
            module: true,
          },
        },
      },
    })

    if (!tenant) return null

    return {
      ...tenant,
      enabledModules: tenant.tenantModules
        .filter(tm => tm.isEnabled)
        .map(tm => tm.module.key),
      modules: tenant.tenantModules.map(tm => ({
        id: tm.module.key,
        name: tm.module.name,
        category: tm.module.category,
        isEnabled: tm.isEnabled,
        enabledAt: tm.enabledAt,
        disabledAt: tm.disabledAt,
      })),
    }
  }

  static async updateTenant(id: string, data: UpdateTenantInput) {
    const updateData: any = { ...data }

    if (data.subscriptionStartDate) {
      updateData.subscriptionStartDate = new Date(data.subscriptionStartDate)
    }
    if (data.subscriptionEndDate) {
      updateData.subscriptionEndDate = new Date(data.subscriptionEndDate)
    }

    const tenant = await prisma.tenant.update({
      where: { id },
      data: updateData,
    })

    // Actualizar módulos si se especificaron
    if (data.enabledModules) {
      await this.updateTenantModules(id, data.enabledModules)
    }

    return await this.getTenantById(id)
  }

  static async toggleModule(tenantId: string, data: ToggleModuleInput) {
    const module = await prisma.module.findFirst({
      where: { key: data.moduleId },
    })

    if (!module) {
      throw new Error('Módulo no encontrado')
    }

    const tenantModule = await prisma.tenantModule.findFirst({
      where: {
        tenantId,
        moduleId: module.id,
      },
    })

    if (tenantModule) {
      // Actualizar estado existente
      await prisma.tenantModule.update({
        where: { id: tenantModule.id },
        data: {
          isEnabled: data.isEnabled,
          enabledAt: data.isEnabled ? new Date() : null,
          disabledAt: !data.isEnabled ? new Date() : null,
          reason: data.reason,
        },
      })
    } else {
      // Crear nueva relación
      await prisma.tenantModule.create({
        data: {
          tenantId,
          moduleId: module.id,
          isEnabled: data.isEnabled,
          enabledAt: data.isEnabled ? new Date() : null,
          disabledAt: !data.isEnabled ? new Date() : null,
          reason: data.reason,
        },
      })
    }

    return await this.getTenantById(tenantId)
  }

  static async enableModules(tenantId: string, moduleIds: string[]) {
    for (const moduleId of moduleIds) {
      await this.toggleModule(tenantId, {
        moduleId,
        isEnabled: true,
        reason: 'Habilitado durante la creación del tenant',
      })
    }
  }

  static async updateTenantModules(
    tenantId: string,
    enabledModuleIds: string[]
  ) {
    // Obtener todos los módulos del tenant
    const tenantModules = await prisma.tenantModule.findMany({
      where: { tenantId },
      include: { module: true },
    })

    // Deshabilitar módulos que no están en la lista
    for (const tenantModule of tenantModules) {
      const shouldBeEnabled = enabledModuleIds.includes(tenantModule.module.key)
      if (tenantModule.isEnabled !== shouldBeEnabled) {
        await prisma.tenantModule.update({
          where: { id: tenantModule.id },
          data: {
            isEnabled: shouldBeEnabled,
            enabledAt: shouldBeEnabled ? new Date() : null,
            disabledAt: !shouldBeEnabled ? new Date() : null,
            reason: shouldBeEnabled
              ? 'Habilitado por administrador'
              : 'Deshabilitado por administrador',
          },
        })
      }
    }

    // Habilitar módulos nuevos
    const enabledModules = tenantModules
      .filter(tm => tm.isEnabled)
      .map(tm => tm.module.key)

    const newModules = enabledModuleIds.filter(
      id => !enabledModules.includes(id)
    )
    for (const moduleId of newModules) {
      await this.toggleModule(tenantId, {
        moduleId,
        isEnabled: true,
        reason: 'Habilitado por administrador',
      })
    }
  }

  static async getTenantStats(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        _count: {
          select: {
            users: true,
            servers: true,
            customers: true,
            products: true,
            orders: true,
            invoices: true,
          },
        },
      },
    })

    if (!tenant) return null

    return {
      tenant,
      usage: {
        users: {
          current: tenant._count.users,
          limit: tenant.maxUsers,
          percentage:
            tenant.maxUsers === -1
              ? 0
              : Math.round((tenant._count.users / tenant.maxUsers) * 100),
        },
        servers: {
          current: tenant._count.servers,
          limit: tenant.maxServers,
          percentage:
            tenant.maxServers === -1
              ? 0
              : Math.round((tenant._count.servers / tenant.maxServers) * 100),
        },
      },
    }
  }

  static async deleteTenant(id: string) {
    // Verificar que no tenga datos asociados
    const counts = await prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            servers: true,
            customers: true,
            products: true,
            orders: true,
            invoices: true,
          },
        },
      },
    })

    if (!counts) {
      throw new Error('Tenant no encontrado')
    }

    const totalRecords =
      counts._count.users +
      counts._count.servers +
      counts._count.customers +
      counts._count.products +
      counts._count.orders +
      counts._count.invoices

    if (totalRecords > 0) {
      throw new Error(
        'No se puede eliminar el tenant porque tiene datos asociados'
      )
    }

    // Eliminar relaciones de módulos
    await prisma.tenantModule.deleteMany({
      where: { tenantId: id },
    })

    // Eliminar el tenant
    await prisma.tenant.delete({
      where: { id },
    })

    return { success: true }
  }

  static async getTenantModuleHistory(tenantId: string) {
    const history = await prisma.tenantModule.findMany({
      where: { tenantId },
      include: {
        module: true,
      },
      orderBy: { updatedAt: 'desc' },
    })

    return history.map(h => ({
      id: h.id,
      moduleId: h.module.key,
      moduleName: h.module.name,
      isEnabled: h.isEnabled,
      enabledAt: h.enabledAt,
      disabledAt: h.disabledAt,
      reason: h.reason,
      updatedAt: h.updatedAt,
    }))
  }

  static async getTenantsByModule(moduleId: string) {
    const tenants = await prisma.tenantModule.findMany({
      where: {
        module: { key: moduleId },
        isEnabled: true,
      },
      include: {
        tenant: true,
        module: true,
      },
    })

    return tenants.map(t => ({
      tenantId: t.tenant.id,
      tenantName: t.tenant.name,
      tenantSlug: t.tenant.slug,
      enabledAt: t.enabledAt,
      reason: t.reason,
    }))
  }

  static async getSystemStats() {
    const [totalTenants, activeTenants, tenantsByPlan, modulesUsage] =
      await Promise.all([
        prisma.tenant.count(),
        prisma.tenant.count({ where: { isActive: true } }),
        prisma.tenant.groupBy({
          by: ['subscriptionPlan'],
          _count: { subscriptionPlan: true },
        }),
        prisma.tenantModule.groupBy({
          by: ['moduleId'],
          where: { isEnabled: true },
          _count: { moduleId: true },
          _max: { enabledAt: true },
        }),
      ])

    return {
      totalTenants,
      activeTenants,
      inactiveTenants: totalTenants - activeTenants,
      tenantsByPlan,
      modulesUsage,
    }
  }
}
