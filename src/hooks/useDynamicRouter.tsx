'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import {
  dynamicRouter,
  UseDynamicRouterReturn,
} from '@/lib/modules/dynamic-routing'

export function useDynamicRouter(): UseDynamicRouterReturn {
  const { user } = useAuth()
  const [routes, setRoutes] = useState<any[]>([])
  const [navigation, setNavigation] = useState<any[]>([])
  const [categorizedMenu, setCategorizedMenu] = useState<Record<string, any[]>>(
    {}
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const initializeRouter = useCallback(async () => {
    if (!user?.tenantId) {
      setError('No se pudo obtener el ID del tenant')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Inicializar el router con los módulos del tenant
      await dynamicRouter.initialize(user.tenantId)

      // Obtener rutas activas
      const activeRoutes = dynamicRouter.getActiveRoutes()
      setRoutes(activeRoutes)

      // Obtener menú de navegación
      const navMenu = dynamicRouter.getNavigationMenu()
      setNavigation(navMenu)

      // Obtener menú categorizado
      const categorized = dynamicRouter.getCategorizedMenu()
      setCategorizedMenu(categorized)
    } catch (err) {
      console.error('Error initializing dynamic router:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [user?.tenantId])

  useEffect(() => {
    initializeRouter()
  }, [initializeRouter])

  const isRouteAvailable = useCallback((path: string): boolean => {
    return dynamicRouter.isRouteAvailable(path)
  }, [])

  const hasRoutePermission = useCallback(
    async (path: string): Promise<boolean> => {
      if (!user?.role) return false
      return await dynamicRouter.hasRoutePermission(path, user.role)
    },
    [user?.role]
  )

  const getBreadcrumbs = useCallback((path: string) => {
    return dynamicRouter.getBreadcrumbs(path)
  }, [])

  return {
    routes,
    navigation,
    categorizedMenu,
    isRouteAvailable,
    hasRoutePermission,
    getBreadcrumbs,
    loading,
    error,
  }
}
