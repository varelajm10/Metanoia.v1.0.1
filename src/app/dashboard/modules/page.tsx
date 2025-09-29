'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Settings,
  ToggleLeft,
  ToggleRight,
  Plus,
  Eye,
  EyeOff,
  Shield,
  Users,
  Package,
  Globe,
  Server,
  UserCheck,
  Calculator,
  ShoppingCart,
  BarChart3,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Module {
  id: string
  name: string
  displayName: string
  description: string
  version: string
  category: string
  isCore: boolean
  icon: string
  color: string
  order: number
  isActive: boolean
  isEnabled: boolean
  config: any
  features: any[]
  permissions: any[]
}

export default function ModulesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [modules, setModules] = useState<Module[]>([])
  const [modulesLoading, setModulesLoading] = useState(true)
  const [availableModules, setAvailableModules] = useState<Module[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && user.role === 'SUPER_ADMIN') {
      fetchModules()
      fetchAvailableModules()
    } else if (user) {
      // Si no es super admin, redirigir al dashboard
      router.push('/dashboard')
    }
  }, [user])

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/modules')
      if (response.ok) {
        const data = await response.json()
        setModules(data.modules || [])
      }
    } catch (error) {
      console.error('Error fetching modules:', error)
    } finally {
      setModulesLoading(false)
    }
  }

  const fetchAvailableModules = async () => {
    try {
      const response = await fetch('/api/modules/available')
      if (response.ok) {
        const data = await response.json()
        setAvailableModules(data.modules || [])
      }
    } catch (error) {
      console.error('Error fetching available modules:', error)
    }
  }

  const toggleModule = async (moduleId: string, isActive: boolean) => {
    try {
      const method = isActive ? 'DELETE' : 'POST'
      const response = await fetch(`/api/modules/${moduleId}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: method === 'POST' ? JSON.stringify({}) : undefined,
      })

      if (response.ok) {
        // Actualizar el estado local
        setModules(prev =>
          prev.map(module =>
            module.id === moduleId ? { ...module, isActive: !isActive } : module
          )
        )
      }
    } catch (error) {
      console.error('Error toggling module:', error)
    }
  }

  const getModuleIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Users,
      Package,
      BarChart3,
      Settings,
      UserCheck,
      Calculator,
      ShoppingCart,
      Globe,
      Server,
    }
    return iconMap[iconName] || Package
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      CORE: 'bg-blue-100 text-blue-800',
      BUSINESS: 'bg-green-100 text-green-800',
      FINANCIAL: 'bg-yellow-100 text-yellow-800',
      ANALYTICS: 'bg-purple-100 text-purple-800',
      INTEGRATION: 'bg-orange-100 text-orange-800',
      CUSTOM: 'bg-gray-100 text-gray-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'SUPER_ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h2 className="mb-2 text-xl font-semibold">Acceso Denegado</h2>
          <p className="text-muted-foreground">
            Solo los Super Administradores pueden gestionar módulos
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard">Volver al Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Dashboard
              </Link>
            </Button>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
              <Settings className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Gestión de Módulos</h1>
              <p className="text-sm text-muted-foreground">
                Activa y configura módulos para los tenants
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="border-green-300 text-green-600"
            >
              <Shield className="mr-1 h-3 w-3" />
              Super Administrador
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Módulos
              </CardTitle>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold">
                  {availableModules.length}
                </div>
              </CardContent>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Módulos Activos
              </CardTitle>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-green-600">
                  {modules.filter(m => m.isActive).length}
                </div>
              </CardContent>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Módulos Core
              </CardTitle>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-blue-600">
                  {availableModules.filter(m => m.isCore).length}
                </div>
              </CardContent>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Módulos Opcionales
              </CardTitle>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-orange-600">
                  {availableModules.filter(m => !m.isCore).length}
                </div>
              </CardContent>
            </CardHeader>
          </Card>
        </div>

        {/* Available Modules */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Módulos Disponibles</h2>
              <p className="text-muted-foreground">
                Gestiona qué módulos están disponibles para los tenants
              </p>
            </div>
          </div>

          {modulesLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="mb-2 h-10 w-10 rounded-lg bg-muted"></div>
                    <div className="h-4 w-3/4 rounded bg-muted"></div>
                    <div className="h-3 w-full rounded bg-muted"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-full rounded bg-muted"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableModules.map(module => {
                const IconComponent = getModuleIcon(module.icon)
                const isActive =
                  modules.find(m => m.id === module.id)?.isActive || false

                return (
                  <Card
                    key={module.id}
                    className="transition-all hover:shadow-lg"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div
                          className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${module.color}20` }}
                        >
                          <IconComponent
                            className="h-5 w-5"
                            style={{ color: module.color }}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getCategoryColor(module.category)}>
                            {module.category}
                          </Badge>
                          {module.isCore && (
                            <Badge
                              variant="outline"
                              className="border-blue-300 text-blue-600"
                            >
                              Core
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-lg">
                        {module.displayName}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {module.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Versión:
                          </span>
                          <span className="font-medium">{module.version}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Características:
                          </span>
                          <span className="font-medium">
                            {module.features.length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Estado:
                          </span>
                          <div className="flex items-center space-x-2">
                            {isActive ? (
                              <Badge
                                variant="default"
                                className="bg-green-100 text-green-600"
                              >
                                <Eye className="mr-1 h-3 w-3" />
                                Activo
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="text-gray-600"
                              >
                                <EyeOff className="mr-1 h-3 w-3" />
                                Inactivo
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => toggleModule(module.id, isActive)}
                          variant={isActive ? 'destructive' : 'default'}
                          size="sm"
                          className="w-full"
                          disabled={module.isCore}
                        >
                          {isActive ? (
                            <>
                              <ToggleLeft className="mr-2 h-4 w-4" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <ToggleRight className="mr-2 h-4 w-4" />
                              Activar
                            </>
                          )}
                        </Button>
                        {module.isCore && (
                          <p className="text-center text-xs text-muted-foreground">
                            Los módulos core no pueden ser desactivados
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Module Categories */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold">Categorías de Módulos</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4 text-blue-600" />
                  Core
                </CardTitle>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold text-blue-600">
                    {availableModules.filter(m => m.category === 'CORE').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Módulos esenciales del sistema
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm">
                  <Package className="mr-2 h-4 w-4 text-green-600" />
                  Business
                </CardTitle>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold text-green-600">
                    {
                      availableModules.filter(m => m.category === 'BUSINESS')
                        .length
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Módulos de negocio
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm">
                  <Calculator className="mr-2 h-4 w-4 text-yellow-600" />
                  Financial
                </CardTitle>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold text-yellow-600">
                    {
                      availableModules.filter(m => m.category === 'FINANCIAL')
                        .length
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Módulos financieros
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm">
                  <BarChart3 className="mr-2 h-4 w-4 text-purple-600" />
                  Analytics
                </CardTitle>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold text-purple-600">
                    {
                      availableModules.filter(m => m.category === 'ANALYTICS')
                        .length
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Módulos de análisis
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm">
                  <Server className="mr-2 h-4 w-4 text-orange-600" />
                  Integration
                </CardTitle>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold text-orange-600">
                    {
                      availableModules.filter(m => m.category === 'INTEGRATION')
                        .length
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Módulos de integración
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm">
                  <Settings className="mr-2 h-4 w-4 text-gray-600" />
                  Custom
                </CardTitle>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold text-gray-600">
                    {
                      availableModules.filter(m => m.category === 'CUSTOM')
                        .length
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Módulos personalizados
                  </p>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
