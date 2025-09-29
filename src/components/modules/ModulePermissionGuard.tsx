'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useDynamicRouter } from '@/hooks/useDynamicRouter'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock, AlertTriangle, ArrowLeft, Settings } from 'lucide-react'
import Link from 'next/link'

interface ModulePermissionGuardProps {
  children: React.ReactNode
  moduleId: string
  permission: string
  fallback?: React.ReactNode
  redirectTo?: string
}

export function ModulePermissionGuard({
  children,
  moduleId,
  permission,
  fallback,
  redirectTo = '/dashboard',
}: ModulePermissionGuardProps) {
  const { user } = useAuth()
  const { hasRoutePermission } = useDynamicRouter()
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkPermission = async () => {
      if (!user) {
        setHasPermission(false)
        setLoading(false)
        return
      }

      try {
        // Verificar permisos del módulo
        const permissionGranted = await hasRoutePermission(`/${moduleId}`)
        setHasPermission(permissionGranted)
      } catch (error) {
        console.error('Error checking module permission:', error)
        setHasPermission(false)
      } finally {
        setLoading(false)
      }
    }

    checkPermission()
  }, [user, moduleId, permission, hasRoutePermission])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <span className="ml-2">Verificando permisos...</span>
      </div>
    )
  }

  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="container mx-auto p-6">
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl">Acceso Denegado</CardTitle>
            <CardDescription>
              No tienes permisos para acceder a este módulo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-600" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">
                    Permisos Insuficientes
                  </p>
                  <p className="mt-1 text-yellow-700">
                    Contacta a tu administrador para obtener acceso a este
                    módulo.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button asChild className="flex-1">
                <Link href={redirectTo}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al Dashboard
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/modules">
                  <Settings className="mr-2 h-4 w-4" />
                  Gestionar Módulos
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

interface ModuleRouteGuardProps {
  children: React.ReactNode
  path: string
  fallback?: React.ReactNode
  redirectTo?: string
}

export function ModuleRouteGuard({
  children,
  path,
  fallback,
  redirectTo = '/dashboard',
}: ModuleRouteGuardProps) {
  const { user } = useAuth()
  const { hasRoutePermission, isRouteAvailable } = useDynamicRouter()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setHasAccess(false)
        setLoading(false)
        return
      }

      try {
        // Verificar si la ruta está disponible
        const routeAvailable = isRouteAvailable(path)
        if (!routeAvailable) {
          setHasAccess(false)
          setLoading(false)
          return
        }

        // Verificar permisos de la ruta
        const permissionGranted = await hasRoutePermission(path)
        setHasAccess(permissionGranted)
      } catch (error) {
        console.error('Error checking route access:', error)
        setHasAccess(false)
      } finally {
        setLoading(false)
      }
    }

    checkAccess()
  }, [user, path, hasRoutePermission, isRouteAvailable])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <span className="ml-2">Verificando acceso...</span>
      </div>
    )
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="container mx-auto p-6">
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl">Ruta No Disponible</CardTitle>
            <CardDescription>
              Esta ruta no está disponible o no tienes permisos para acceder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={redirectTo}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
