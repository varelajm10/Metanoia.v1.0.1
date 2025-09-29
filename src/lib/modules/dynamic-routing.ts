// ========================================
// SISTEMA DE RUTAS DINÁMICAS
// ========================================

import {
  ModuleRegistry,
  ModuleDefinition,
  ModuleRoute,
} from './module-registry'
import { tenantModuleService } from './tenant-module-service'

export interface DynamicRoute {
  path: string
  component: string
  moduleId: string
  permission?: string
  isActive: boolean
}

export interface RouteConfig {
  path: string
  component: string
  moduleId: string
  permission?: string
  exact?: boolean
  children?: RouteConfig[]
}

export class DynamicRouter {
  private tenantModules: any[] = []
  private tenantId: string | null = null

  /**
   * Inicializar el router con los módulos del tenant
   */
  async initialize(tenantId: string): Promise<void> {
    this.tenantId = tenantId
    this.tenantModules = await tenantModuleService.getTenantModules(tenantId)
  }

  /**
   * Obtener todas las rutas activas para el tenant
   */
  getActiveRoutes(): DynamicRoute[] {
    const routes: DynamicRoute[] = []

    for (const tenantModule of this.tenantModules) {
      if (!tenantModule.isEnabled) continue

      const module = ModuleRegistry.getModuleById(tenantModule.moduleId)
      if (!module) continue

      for (const route of module.routes) {
        routes.push({
          path: route.path,
          component: route.component,
          moduleId: module.id,
          permission: route.permission,
          isActive: true,
        })
      }
    }

    return routes
  }

  /**
   * Obtener rutas de un módulo específico
   */
  getModuleRoutes(moduleId: string): DynamicRoute[] {
    const tenantModule = this.tenantModules.find(tm => tm.moduleId === moduleId)
    if (!tenantModule || !tenantModule.isEnabled) return []

    const module = ModuleRegistry.getModuleById(moduleId)
    if (!module) return []

    return module.routes.map(route => ({
      path: route.path,
      component: route.component,
      moduleId: module.id,
      permission: route.permission,
      isActive: true,
    }))
  }

  /**
   * Verificar si una ruta está disponible
   */
  isRouteAvailable(path: string): boolean {
    const routes = this.getActiveRoutes()
    return routes.some(route => this.matchRoute(route.path, path))
  }

  /**
   * Obtener información de una ruta específica
   */
  getRouteInfo(path: string): DynamicRoute | null {
    const routes = this.getActiveRoutes()
    return routes.find(route => this.matchRoute(route.path, path)) || null
  }

  /**
   * Obtener componente de una ruta
   */
  getRouteComponent(path: string): string | null {
    const routeInfo = this.getRouteInfo(path)
    if (!routeInfo) return null

    const module = ModuleRegistry.getModuleById(routeInfo.moduleId)
    if (!module) return null

    const component = module.components.find(
      c => c.name === routeInfo.component
    )
    return component?.path || null
  }

  /**
   * Verificar permisos de una ruta
   */
  async hasRoutePermission(path: string, userRole: string): Promise<boolean> {
    const routeInfo = this.getRouteInfo(path)
    if (!routeInfo || !routeInfo.permission) return true

    if (!this.tenantId) return false

    return await tenantModuleService.hasModulePermission(
      this.tenantId,
      routeInfo.moduleId,
      routeInfo.permission,
      userRole as any
    )
  }

  /**
   * Obtener menú de navegación basado en módulos activos
   */
  getNavigationMenu(): NavigationItem[] {
    const menu: NavigationItem[] = []

    for (const tenantModule of this.tenantModules) {
      if (!tenantModule.isEnabled) continue

      const module = ModuleRegistry.getModuleById(tenantModule.moduleId)
      if (!module) continue

      const moduleRoutes = this.getModuleRoutes(module.id)
      if (moduleRoutes.length === 0) continue

      const menuItem: NavigationItem = {
        id: module.id,
        label: module.displayName,
        icon: module.icon,
        color: module.color,
        category: module.category,
        order: module.order,
        routes: moduleRoutes.map(route => ({
          path: route.path,
          label: this.getRouteLabel(route.path),
          component: route.component,
          permission: route.permission,
        })),
      }

      menu.push(menuItem)
    }

    return menu.sort((a, b) => a.order - b.order)
  }

  /**
   * Obtener menú agrupado por categorías
   */
  getCategorizedMenu(): Record<string, NavigationItem[]> {
    const menu = this.getNavigationMenu()
    const categorized: Record<string, NavigationItem[]> = {}

    for (const item of menu) {
      if (!categorized[item.category]) {
        categorized[item.category] = []
      }
      categorized[item.category].push(item)
    }

    return categorized
  }

  /**
   * Generar configuración de rutas para Next.js
   */
  generateRouteConfig(): RouteConfig[] {
    const routes: RouteConfig[] = []

    for (const tenantModule of this.tenantModules) {
      if (!tenantModule.isEnabled) continue

      const module = ModuleRegistry.getModuleById(tenantModule.moduleId)
      if (!module) continue

      for (const route of module.routes) {
        routes.push({
          path: route.path,
          component: route.component,
          moduleId: module.id,
          permission: route.permission,
          exact: true,
        })
      }
    }

    return routes
  }

  /**
   * Obtener breadcrumbs para una ruta
   */
  getBreadcrumbs(path: string): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = []
    const routeInfo = this.getRouteInfo(path)

    if (!routeInfo) return breadcrumbs

    const module = ModuleRegistry.getModuleById(routeInfo.moduleId)
    if (!module) return breadcrumbs

    // Agregar módulo como primer nivel
    breadcrumbs.push({
      label: module.displayName,
      path: `/${module.id}`,
      icon: module.icon,
    })

    // Agregar ruta específica
    const routeLabel = this.getRouteLabel(path)
    breadcrumbs.push({
      label: routeLabel,
      path: path,
      current: true,
    })

    return breadcrumbs
  }

  // ========================================
  // MÉTODOS PRIVADOS
  // ========================================

  /**
   * Verificar si una ruta coincide con un patrón
   */
  private matchRoute(pattern: string, path: string): boolean {
    // Convertir patrón de ruta a regex
    const regexPattern = pattern
      .replace(/:\w+/g, '[^/]+') // Parámetros dinámicos
      .replace(/\*/g, '.*') // Wildcards
      .replace(/\//g, '\\/') // Escapar slashes

    const regex = new RegExp(`^${regexPattern}$`)
    return regex.test(path)
  }

  /**
   * Obtener etiqueta legible para una ruta
   */
  private getRouteLabel(path: string): string {
    // Extraer el último segmento de la ruta
    const segments = path.split('/').filter(Boolean)
    const lastSegment = segments[segments.length - 1]

    // Convertir a formato legible
    return lastSegment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }
}

// ========================================
// TIPOS E INTERFACES
// ========================================

export interface NavigationItem {
  id: string
  label: string
  icon: string
  color: string
  category: string
  order: number
  routes: NavigationRoute[]
}

export interface NavigationRoute {
  path: string
  label: string
  component: string
  permission?: string
}

export interface BreadcrumbItem {
  label: string
  path: string
  icon?: string
  current?: boolean
}

// ========================================
// HOOKS PARA REACT
// ========================================

export interface UseDynamicRouterOptions {
  tenantId: string
  userRole: string
}

export interface UseDynamicRouterReturn {
  routes: DynamicRoute[]
  navigation: NavigationItem[]
  categorizedMenu: Record<string, NavigationItem[]>
  isRouteAvailable: (path: string) => boolean
  hasRoutePermission: (path: string) => Promise<boolean>
  getBreadcrumbs: (path: string) => BreadcrumbItem[]
  loading: boolean
  error: string | null
}

// Instancia singleton del router
export const dynamicRouter = new DynamicRouter()
