// ========================================
// MIDDLEWARE DE AUTORIZACIÓN POR MÓDULO
// ========================================

import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from './auth'
import { tenantModuleService } from '@/lib/modules/tenant-module-service'
import { ModuleRegistry } from '@/lib/modules/module-registry'

export interface ModuleAuthResult {
  error: NextResponse | null
  user: any
  moduleId?: string
  hasPermission?: boolean
}

/**
 * Verificar permisos específicos de un módulo
 */
export async function requireModulePermission(
  request: NextRequest,
  moduleId: string,
  action: string
): Promise<ModuleAuthResult> {
  try {
    // Verificar autenticación básica
    const { error, user } = await requirePermission(request, 'modules', 'read')
    if (error) return { error, user: null }

    const tenantId = getTenantId(user!)

    // Verificar si el módulo existe
    if (!ModuleRegistry.moduleExists(moduleId)) {
      return {
        error: NextResponse.json(
          {
            error: 'Módulo no encontrado',
            message: `El módulo ${moduleId} no existe en el sistema`,
          },
          { status: 404 }
        ),
        user: null,
      }
    }

    // Verificar si el módulo está activo para el tenant
    const isModuleActive = await tenantModuleService.isModuleActive(
      tenantId,
      moduleId
    )
    if (!isModuleActive) {
      return {
        error: NextResponse.json(
          {
            error: 'Módulo no disponible',
            message: `El módulo ${moduleId} no está activado para este tenant`,
          },
          { status: 403 }
        ),
        user: null,
      }
    }

    // Verificar permisos específicos del módulo
    const hasPermission = await tenantModuleService.hasModulePermission(
      tenantId,
      moduleId,
      action,
      user!.role
    )

    if (!hasPermission) {
      return {
        error: NextResponse.json(
          {
            error: 'Permisos insuficientes',
            message: `No tienes permisos para ${action} en el módulo ${moduleId}`,
            requiredModule: moduleId,
            requiredAction: action,
            currentRole: user!.role,
          },
          { status: 403 }
        ),
        user: null,
      }
    }

    return {
      error: null,
      user,
      moduleId,
      hasPermission: true,
    }
  } catch (error) {
    console.error('Error en requireModulePermission:', error)
    return {
      error: NextResponse.json(
        {
          error: 'Error interno del servidor',
          message: 'Error verificando permisos del módulo',
        },
        { status: 500 }
      ),
      user: null,
    }
  }
}

/**
 * Verificar permisos de múltiples módulos (OR lógico)
 */
export async function requireAnyModulePermission(
  request: NextRequest,
  modules: Array<{ moduleId: string; action: string }>
): Promise<ModuleAuthResult> {
  try {
    // Verificar autenticación básica
    const { error, user } = await requirePermission(request, 'modules', 'read')
    if (error) return { error, user: null }

    const tenantId = getTenantId(user!)

    // Verificar al menos uno de los módulos
    for (const { moduleId, action } of modules) {
      const isModuleActive = await tenantModuleService.isModuleActive(
        tenantId,
        moduleId
      )
      if (isModuleActive) {
        const hasPermission = await tenantModuleService.hasModulePermission(
          tenantId,
          moduleId,
          action,
          user!.role
        )
        if (hasPermission) {
          return {
            error: null,
            user,
            moduleId,
            hasPermission: true,
          }
        }
      }
    }

    // Ningún módulo tiene permisos
    return {
      error: NextResponse.json(
        {
          error: 'Permisos insuficientes',
          message: 'No tienes permisos en ninguno de los módulos requeridos',
          requiredModules: modules.map(m => `${m.moduleId}:${m.action}`),
          currentRole: user!.role,
        },
        { status: 403 }
      ),
      user: null,
    }
  } catch (error) {
    console.error('Error en requireAnyModulePermission:', error)
    return {
      error: NextResponse.json(
        {
          error: 'Error interno del servidor',
          message: 'Error verificando permisos de módulos',
        },
        { status: 500 }
      ),
      user: null,
    }
  }
}

/**
 * Verificar permisos de múltiples módulos (AND lógico)
 */
export async function requireAllModulePermissions(
  request: NextRequest,
  modules: Array<{ moduleId: string; action: string }>
): Promise<ModuleAuthResult> {
  try {
    // Verificar autenticación básica
    const { error, user } = await requirePermission(request, 'modules', 'read')
    if (error) return { error, user: null }

    const tenantId = getTenantId(user!)

    // Verificar todos los módulos
    for (const { moduleId, action } of modules) {
      const isModuleActive = await tenantModuleService.isModuleActive(
        tenantId,
        moduleId
      )
      if (!isModuleActive) {
        return {
          error: NextResponse.json(
            {
              error: 'Módulo no disponible',
              message: `El módulo ${moduleId} no está activado para este tenant`,
            },
            { status: 403 }
          ),
          user: null,
        }
      }

      const hasPermission = await tenantModuleService.hasModulePermission(
        tenantId,
        moduleId,
        action,
        user!.role
      )

      if (!hasPermission) {
        return {
          error: NextResponse.json(
            {
              error: 'Permisos insuficientes',
              message: `No tienes permisos para ${action} en el módulo ${moduleId}`,
              requiredModule: moduleId,
              requiredAction: action,
              currentRole: user!.role,
            },
            { status: 403 }
          ),
          user: null,
        }
      }
    }

    return {
      error: null,
      user,
      hasPermission: true,
    }
  } catch (error) {
    console.error('Error en requireAllModulePermissions:', error)
    return {
      error: NextResponse.json(
        {
          error: 'Error interno del servidor',
          message: 'Error verificando permisos de módulos',
        },
        { status: 500 }
      ),
      user: null,
    }
  }
}

/**
 * Middleware para verificar que un módulo esté activo (sin verificar permisos específicos)
 */
export async function requireModuleActive(
  request: NextRequest,
  moduleId: string
): Promise<ModuleAuthResult> {
  try {
    // Verificar autenticación básica
    const { error, user } = await requirePermission(request, 'modules', 'read')
    if (error) return { error, user: null }

    const tenantId = getTenantId(user!)

    // Verificar si el módulo está activo
    const isModuleActive = await tenantModuleService.isModuleActive(
      tenantId,
      moduleId
    )
    if (!isModuleActive) {
      return {
        error: NextResponse.json(
          {
            error: 'Módulo no disponible',
            message: `El módulo ${moduleId} no está activado para este tenant`,
          },
          { status: 403 }
        ),
        user: null,
      }
    }

    return {
      error: null,
      user,
      moduleId,
      hasPermission: true,
    }
  } catch (error) {
    console.error('Error en requireModuleActive:', error)
    return {
      error: NextResponse.json(
        {
          error: 'Error interno del servidor',
          message: 'Error verificando estado del módulo',
        },
        { status: 500 }
      ),
      user: null,
    }
  }
}

/**
 * Obtener información del módulo para el usuario actual
 */
export async function getModuleInfo(
  request: NextRequest,
  moduleId: string
): Promise<{
  error: NextResponse | null
  moduleInfo: any
  user: any
}> {
  try {
    // Verificar autenticación básica
    const { error, user } = await requirePermission(request, 'modules', 'read')
    if (error) return { error, user: null, moduleInfo: null }

    const tenantId = getTenantId(user!)

    // Obtener información del módulo
    const module = ModuleRegistry.getModuleById(moduleId)
    if (!module) {
      return {
        error: NextResponse.json(
          {
            error: 'Módulo no encontrado',
            message: `El módulo ${moduleId} no existe en el sistema`,
          },
          { status: 404 }
        ),
        user: null,
        moduleInfo: null,
      }
    }

    // Obtener configuración del tenant para este módulo
    let tenantConfig = null
    try {
      tenantConfig = await tenantModuleService.getTenantModule(
        tenantId,
        moduleId
      )
    } catch (error) {
      // Módulo no activado para este tenant
      tenantConfig = null
    }

    const moduleInfo = {
      ...module,
      tenantConfig,
      isActive: tenantConfig?.isActive || false,
      isEnabled: tenantConfig?.isEnabled || false,
      userPermissions: tenantConfig
        ? Object.keys(tenantConfig.permissions).filter(action =>
            tenantConfig.permissions[action].includes(user!.role)
          )
        : [],
    }

    return {
      error: null,
      user,
      moduleInfo,
    }
  } catch (error) {
    console.error('Error en getModuleInfo:', error)
    return {
      error: NextResponse.json(
        {
          error: 'Error interno del servidor',
          message: 'Error obteniendo información del módulo',
        },
        { status: 500 }
      ),
      user: null,
      moduleInfo: null,
    }
  }
}

/**
 * Verificar si el usuario tiene acceso a una ruta específica del módulo
 */
export async function requireModuleRouteAccess(
  request: NextRequest,
  moduleId: string,
  routePath: string
): Promise<ModuleAuthResult> {
  try {
    // Obtener rutas del módulo
    const moduleRoutes = ModuleRegistry.getModuleRoutes(moduleId)
    const route = moduleRoutes.find(r => r.path === routePath)

    if (!route) {
      return {
        error: NextResponse.json(
          {
            error: 'Ruta no encontrada',
            message: `La ruta ${routePath} no existe en el módulo ${moduleId}`,
          },
          { status: 404 }
        ),
        user: null,
      }
    }

    // Si la ruta no requiere permisos específicos, solo verificar que el módulo esté activo
    if (!route.permission) {
      return requireModuleActive(request, moduleId)
    }

    // Verificar permisos específicos de la ruta
    return requireModulePermission(request, moduleId, route.permission)
  } catch (error) {
    console.error('Error en requireModuleRouteAccess:', error)
    return {
      error: NextResponse.json(
        {
          error: 'Error interno del servidor',
          message: 'Error verificando acceso a la ruta del módulo',
        },
        { status: 500 }
      ),
      user: null,
    }
  }
}

/**
 * Middleware para APIs que requieren módulos específicos
 */
export function createModuleMiddleware(moduleId: string, action: string) {
  return async (request: NextRequest) => {
    return requireModulePermission(request, moduleId, action)
  }
}

/**
 * Middleware para APIs que requieren múltiples módulos (OR)
 */
export function createAnyModuleMiddleware(
  modules: Array<{ moduleId: string; action: string }>
) {
  return async (request: NextRequest) => {
    return requireAnyModulePermission(request, modules)
  }
}

/**
 * Middleware para APIs que requieren múltiples módulos (AND)
 */
export function createAllModuleMiddleware(
  modules: Array<{ moduleId: string; action: string }>
) {
  return async (request: NextRequest) => {
    return requireAllModulePermissions(request, modules)
  }
}
