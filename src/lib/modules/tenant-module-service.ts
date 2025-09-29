// ========================================
// SERVICIO DE GESTIÓN DE MÓDULOS POR TENANT
// ========================================

import { PrismaClient, UserRole } from '@prisma/client'
import {
  ModuleRegistry,
  ModuleDefinition,
  CustomField,
} from './module-registry'

const prisma = new PrismaClient()

export interface TenantModuleConfig {
  moduleId: string
  isActive: boolean
  isEnabled: boolean
  config: Record<string, any>
  customFields: Record<string, CustomFieldValue>
  features: Record<string, boolean>
  permissions: Record<string, string[]>
}

export interface CustomFieldValue {
  value: any
  isVisible: boolean
  isEditable: boolean
  validation?: any[]
}

export interface ModuleActivationRequest {
  moduleId: string
  config?: Record<string, any>
  customFields?: Record<string, any>
  features?: Record<string, boolean>
}

export interface ModuleUpdateRequest {
  config?: Record<string, any>
  customFields?: Record<string, any>
  features?: Record<string, boolean>
  isEnabled?: boolean
}

export class TenantModuleService {
  /**
   * Obtener todos los módulos activados para un tenant
   */
  async getTenantModules(tenantId: string): Promise<TenantModuleConfig[]> {
    const tenantModules = await prisma.tenantModule.findMany({
      where: { tenantId, isActive: true },
      include: {
        module: true,
        modulePermissions: true,
      },
    })

    return tenantModules.map(tm => ({
      moduleId: tm.moduleId,
      isActive: tm.isActive,
      isEnabled: tm.isEnabled,
      config: (tm.config as Record<string, any>) || {},
      customFields: {},
      features: {},
      permissions: this.formatPermissions(tm.modulePermissions),
    }))
  }

  /**
   * Obtener módulos disponibles para activar (no activados aún)
   */
  async getAvailableModules(tenantId: string): Promise<ModuleDefinition[]> {
    const activatedModuleIds = await prisma.tenantModule.findMany({
      where: { tenantId, isActive: true },
      select: { moduleId: true },
    })

    const activatedIds = activatedModuleIds.map(tm => tm.moduleId)
    return ModuleRegistry.getAllModules().filter(
      module => !activatedIds.includes(module.id)
    )
  }

  /**
   * Activar un módulo para un tenant
   */
  async activateModule(
    tenantId: string,
    request: ModuleActivationRequest
  ): Promise<TenantModuleConfig> {
    const { moduleId, config, customFields, features } = request

    // Verificar que el módulo existe
    const module = ModuleRegistry.getModuleById(moduleId)
    if (!module) {
      throw new Error(`Módulo ${moduleId} no encontrado`)
    }

    // Verificar que no esté ya activado
    const existingModule = await prisma.tenantModule.findUnique({
      where: {
        tenantId_moduleId: { tenantId, moduleId },
      },
    })

    if (existingModule && existingModule.isActive) {
      throw new Error(`El módulo ${moduleId} ya está activado para este tenant`)
    }

    // Crear o actualizar el módulo del tenant
    const tenantModule = await prisma.tenantModule.upsert({
      where: {
        tenantId_moduleId: { tenantId, moduleId },
      },
      update: {
        isActive: true,
        isEnabled: true,
        config: config || ModuleRegistry.getModuleDefaultConfig(moduleId),
      },
      create: {
        tenantId,
        moduleId,
        isActive: true,
        isEnabled: true,
        config: config || ModuleRegistry.getModuleDefaultConfig(moduleId),
      },
    })

    // Crear permisos por defecto
    await this.createDefaultPermissions(tenantId, tenantModule.id, moduleId)

    // Crear campos personalizables si se proporcionan
    if (customFields) {
      await this.createCustomFields(tenantId, moduleId, customFields)
    }

    // Activar características por defecto
    if (features) {
      await this.updateModuleFeatures(tenantId, moduleId, features)
    } else {
      // Activar características por defecto
      const defaultFeatures = module.features.reduce(
        (acc, feature) => {
          acc[feature.id] = feature.isEnabled
          return acc
        },
        {} as Record<string, boolean>
      )
      await this.updateModuleFeatures(tenantId, moduleId, defaultFeatures)
    }

    return this.getTenantModule(tenantId, moduleId)
  }

  /**
   * Desactivar un módulo para un tenant
   */
  async deactivateModule(tenantId: string, moduleId: string): Promise<void> {
    // Verificar que el módulo no sea core
    const module = ModuleRegistry.getModuleById(moduleId)
    if (module?.isCore) {
      throw new Error(`No se puede desactivar el módulo core ${moduleId}`)
    }

    await prisma.tenantModule.update({
      where: {
        tenantId_moduleId: { tenantId, moduleId },
      },
      data: {
        isActive: false,
        isEnabled: false,
      },
    })
  }

  /**
   * Actualizar configuración de un módulo
   */
  async updateModule(
    tenantId: string,
    moduleId: string,
    request: ModuleUpdateRequest
  ): Promise<TenantModuleConfig> {
    const { config, customFields, features, isEnabled } = request

    // Actualizar configuración del módulo
    if (config !== undefined || isEnabled !== undefined) {
      await prisma.tenantModule.update({
        where: {
          tenantId_moduleId: { tenantId, moduleId },
        },
        data: {
          ...(config !== undefined && { config }),
          ...(isEnabled !== undefined && { isEnabled }),
        },
      })
    }

    // Actualizar campos personalizables
    if (customFields) {
      await this.updateCustomFields(tenantId, moduleId, customFields)
    }

    // Actualizar características
    if (features) {
      await this.updateModuleFeatures(tenantId, moduleId, features)
    }

    return this.getTenantModule(tenantId, moduleId)
  }

  /**
   * Obtener configuración específica de un módulo para un tenant
   */
  async getTenantModule(
    tenantId: string,
    moduleId: string
  ): Promise<TenantModuleConfig> {
    const tenantModule = await prisma.tenantModule.findUnique({
      where: {
        tenantId_moduleId: { tenantId, moduleId },
      },
      include: {
        module: true,
        modulePermissions: true,
      },
    })

    if (!tenantModule) {
      throw new Error(`Módulo ${moduleId} no encontrado para el tenant`)
    }

    return {
      moduleId: tenantModule.moduleId,
      isActive: tenantModule.isActive,
      isEnabled: tenantModule.isEnabled,
      config: (tenantModule.config as Record<string, any>) || {},
      customFields: await this.getCustomFields(tenantId, moduleId),
      features: await this.getModuleFeatures(tenantId, moduleId),
      permissions: this.formatPermissions(tenantModule.modulePermissions),
    }
  }

  /**
   * Verificar si un módulo está activo para un tenant
   */
  async isModuleActive(tenantId: string, moduleId: string): Promise<boolean> {
    const tenantModule = await prisma.tenantModule.findUnique({
      where: {
        tenantId_moduleId: { tenantId, moduleId },
      },
    })

    return (tenantModule?.isActive && tenantModule?.isEnabled) || false
  }

  /**
   * Verificar permisos de un usuario en un módulo
   */
  async hasModulePermission(
    tenantId: string,
    moduleId: string,
    action: string,
    userRole: UserRole
  ): Promise<boolean> {
    const tenantModule = await prisma.tenantModule.findUnique({
      where: {
        tenantId_moduleId: { tenantId, moduleId },
      },
      include: {
        modulePermissions: {
          where: {
            userRole,
            permission: action,
            isGranted: true,
          },
        },
      },
    })

    return (tenantModule?.modulePermissions?.length || 0) > 0
  }

  /**
   * Aplicar template de negocio a un tenant
   */
  async applyBusinessTemplate(
    tenantId: string,
    templateId: string
  ): Promise<void> {
    const template = await prisma.businessTemplate.findUnique({
      where: { id: templateId },
      include: {
        templateModules: {
          include: {
            module: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!template) {
      throw new Error(`Template ${templateId} no encontrado`)
    }

    // Activar todos los módulos del template
    for (const templateModule of template.templateModules) {
      try {
        await this.activateModule(tenantId, {
          moduleId: templateModule.moduleId,
          config: (templateModule.config as Record<string, any>) || {},
        })
      } catch (error) {
        console.warn(
          `Error activando módulo ${templateModule.moduleId}:`,
          error
        )
      }
    }
  }

  // ========================================
  // MÉTODOS PRIVADOS
  // ========================================

  /**
   * Crear permisos por defecto para un módulo
   */
  private async createDefaultPermissions(
    tenantId: string,
    tenantModuleId: string,
    moduleId: string
  ): Promise<void> {
    const module = ModuleRegistry.getModuleById(moduleId)
    if (!module) return

    const permissions = []
    for (const permission of module.permissions) {
      for (const role of permission.roles) {
        permissions.push({
          tenantId,
          tenantModuleId,
          permission: permission.action,
          userRole: role as UserRole,
          isGranted: true,
        })
      }
    }

    await prisma.tenantModulePermission.createMany({
      data: permissions,
    })
  }

  /**
   * Crear campos personalizables
   */
  private async createCustomFields(
    tenantId: string,
    moduleId: string,
    customFields: Record<string, any>
  ): Promise<void> {
    const module = ModuleRegistry.getModuleById(moduleId)
    if (!module) return

    for (const field of module.config.customizableFields) {
      const value = customFields[field.name]
      if (value !== undefined) {
        await prisma.tenantModuleFieldValue.upsert({
          where: {
            tenantId_fieldId_entityType_entityId: {
              tenantId,
              fieldId: field.name, // Usar el nombre como ID temporal
              entityType: null as any,
              entityId: null as any,
            },
          },
          update: { value },
          create: {
            tenantId,
            fieldId: field.name,
            value,
            entityType: null as any,
            entityId: null as any,
          },
        })
      }
    }
  }

  /**
   * Actualizar campos personalizables
   */
  private async updateCustomFields(
    tenantId: string,
    moduleId: string,
    customFields: Record<string, any>
  ): Promise<void> {
    for (const [fieldName, value] of Object.entries(customFields)) {
      await prisma.tenantModuleFieldValue.upsert({
        where: {
          tenantId_fieldId_entityType_entityId: {
            tenantId,
            fieldId: fieldName,
            entityType: null as any,
            entityId: null as any,
          },
        },
        update: { value },
        create: {
          tenantId,
          fieldId: fieldName,
          value,
          entityType: null,
          entityId: null,
        },
      })
    }
  }

  /**
   * Actualizar características del módulo
   */
  private async updateModuleFeatures(
    tenantId: string,
    moduleId: string,
    features: Record<string, boolean>
  ): Promise<void> {
    // Por ahora almacenamos las características en la configuración del módulo
    const tenantModule = await prisma.tenantModule.findUnique({
      where: {
        tenantId_moduleId: { tenantId, moduleId },
      },
    })

    if (tenantModule) {
      const currentConfig = (tenantModule.config as Record<string, any>) || {}
      await prisma.tenantModule.update({
        where: {
          tenantId_moduleId: { tenantId, moduleId },
        },
        data: {
          config: {
            ...currentConfig,
            features,
          },
        },
      })
    }
  }

  /**
   * Obtener campos personalizables
   */
  private async getCustomFields(
    tenantId: string,
    moduleId: string
  ): Promise<Record<string, CustomFieldValue>> {
    const fieldValues = await prisma.tenantModuleFieldValue.findMany({
      where: {
        tenantId,
        fieldId: { startsWith: moduleId },
        entityType: null,
        entityId: null,
      },
    })

    const customFields: Record<string, CustomFieldValue> = {}
    for (const fieldValue of fieldValues) {
      customFields[fieldValue.fieldId] = {
        value: fieldValue.value,
        isVisible: true,
        isEditable: true,
      }
    }

    return customFields
  }

  /**
   * Obtener características del módulo
   */
  private async getModuleFeatures(
    tenantId: string,
    moduleId: string
  ): Promise<Record<string, boolean>> {
    const tenantModule = await prisma.tenantModule.findUnique({
      where: {
        tenantId_moduleId: { tenantId, moduleId },
      },
    })

    if (tenantModule?.config) {
      const config = tenantModule.config as Record<string, any>
      return config.features || {}
    }

    return {}
  }

  /**
   * Formatear permisos
   */
  private formatPermissions(
    modulePermissions: any[]
  ): Record<string, string[]> {
    const permissions: Record<string, string[]> = {}

    for (const permission of modulePermissions) {
      if (!permissions[permission.permission]) {
        permissions[permission.permission] = []
      }
      permissions[permission.permission].push(permission.userRole)
    }

    return permissions
  }
}

// Instancia singleton del servicio
export const tenantModuleService = new TenantModuleService()
