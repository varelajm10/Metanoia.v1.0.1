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
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  Settings,
  Users,
  Package,
  Globe,
  Server,
  UserCheck,
  Calculator,
  ShoppingCart,
  BarChart3,
  Building2,
  GraduationCap,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'

interface Tenant {
  id: string
  name: string
  slug: string
  domain?: string
  isActive: boolean
  subscriptionPlan: string
  modules: TenantModule[]
}

interface TenantModule {
  id: string
  moduleId: string
  moduleName: string
  displayName: string
  description: string
  icon: string
  color: string
  isActive: boolean
  isEnabled: boolean
  config: any
}

interface Module {
  id: string
  name: string
  displayName: string
  description: string
  icon: string
  color: string
  category: string
  isCore: boolean
}

export default function ModuleManagementPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [availableModules, setAvailableModules] = useState<Module[]>([])
  const [tenantsLoading, setTenantsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [moduleFilter, setModuleFilter] = useState('all')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && user.role === 'SUPER_ADMIN') {
      fetchTenants()
      fetchAvailableModules()
    } else if (user) {
      router.push('/dashboard')
    }
  }, [user])

  const fetchTenants = async () => {
    try {
      setTenantsLoading(true)
      const response = await fetch('/api/admin/tenants')
      if (response.ok) {
        const data = await response.json()
        setTenants(data.tenants || [])
      }
    } catch (error) {
      console.error('Error fetching tenants:', error)
    } finally {
      setTenantsLoading(false)
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

  const toggleModuleForTenant = async (tenantId: string, moduleId: string, isActive: boolean) => {
    try {
      setUpdating(`${tenantId}-${moduleId}`)
      const response = await fetch(`/api/admin/tenants/${tenantId}/modules/${moduleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      })

      if (response.ok) {
        // Actualizar el estado local
        setTenants(prevTenants =>
          prevTenants.map(tenant =>
            tenant.id === tenantId
              ? {
                  ...tenant,
                  modules: tenant.modules.map(module =>
                    module.moduleId === moduleId
                      ? { ...module, isActive }
                      : module
                  ),
                }
              : tenant
          )
        )
      } else {
        alert('Error al actualizar el módulo')
      }
    } catch (error) {
      console.error('Error toggling module:', error)
      alert('Error al actualizar el módulo')
    } finally {
      setUpdating(null)
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
      Building2,
      GraduationCap,
    }
    return iconMap[iconName] || Package
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="badge-success">
        <CheckCircle className="mr-1 h-3 w-3" />
        Activo
      </Badge>
    ) : (
      <Badge variant="outline" className="text-muted-foreground">
        <XCircle className="mr-1 h-3 w-3" />
        Inactivo
      </Badge>
    )
  }

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.slug.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && tenant.isActive) ||
                         (statusFilter === 'inactive' && !tenant.isActive)
    
    const matchesModule = moduleFilter === 'all' ||
                         tenant.modules.some(module => 
                           module.moduleId === moduleFilter && module.isActive
                         )
    
    return matchesSearch && matchesStatus && matchesModule
  })

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
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="btn-ghost-modern"
            >
              <Link href="/dashboard/modules">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Módulos
              </Link>
            </Button>
            <div>
              <h1 className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-3xl font-bold text-transparent">
                Gestión de Módulos por Cliente
              </h1>
              <p className="text-muted-foreground">
                Administra los módulos habilitados para cada cliente
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button
              onClick={fetchTenants}
              variant="outline"
              size="sm"
              className="hover:scale-105 transition-transform duration-200"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualizar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar Cliente</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Nombre o slug del cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-2 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Estado del Cliente</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-12 rounded-xl border-2 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="inactive">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Módulo</label>
                <Select value={moduleFilter} onValueChange={setModuleFilter}>
                  <SelectTrigger className="h-12 rounded-xl border-2 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Filtrar por módulo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los módulos</SelectItem>
                    {availableModules.map(module => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Acciones</label>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => {
                      setSearchTerm('')
                      setStatusFilter('all')
                      setModuleFilter('all')
                    }}
                    variant="outline"
                    size="sm"
                    className="h-12 rounded-xl"
                  >
                    Limpiar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tenants List */}
        <div className="space-y-6">
          {tenantsLoading ? (
            // Loading skeleton
            [1, 2, 3].map(i => (
              <Card key={i} className="card-modern animate-pulse">
                <CardHeader>
                  <div className="h-6 w-1/3 rounded bg-muted mb-2"></div>
                  <div className="h-4 w-1/2 rounded bg-muted"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map(j => (
                      <div key={j} className="flex items-center justify-between">
                        <div className="h-4 w-1/4 rounded bg-muted"></div>
                        <div className="h-6 w-16 rounded bg-muted"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredTenants.length > 0 ? (
            filteredTenants.map(tenant => (
              <Card key={tenant.id} className="card-modern">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{tenant.name}</CardTitle>
                        <CardDescription>
                          {tenant.slug} • {tenant.subscriptionPlan}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(tenant.isActive)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-foreground">
                      Módulos Disponibles
                    </h4>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {availableModules.map(module => {
                        const tenantModule = tenant.modules.find(tm => tm.moduleId === module.id)
                        const isActive = tenantModule?.isActive || false
                        const isUpdating = updating === `${tenant.id}-${module.id}`
                        const IconComponent = getModuleIcon(module.icon)

                        return (
                          <div
                            key={module.id}
                            className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-200"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className="flex h-10 w-10 items-center justify-center rounded-lg shadow-sm"
                                style={{ 
                                  backgroundColor: `${module.color}15`,
                                  border: `2px solid ${module.color}30`
                                }}
                              >
                                <IconComponent
                                  className="h-5 w-5"
                                  style={{ color: module.color }}
                                />
                              </div>
                              <div>
                                <div className="font-medium text-sm">{module.displayName}</div>
                                <div className="text-xs text-muted-foreground">
                                  {module.description}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {isUpdating ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary"></div>
                              ) : (
                                <Switch
                                  checked={isActive}
                                  onCheckedChange={(checked) =>
                                    toggleModuleForTenant(tenant.id, module.id, checked)
                                  }
                                  className={cn(
                                    "data-[state=checked]:bg-success hover:scale-105 transition-all duration-200",
                                    isActive ? "data-[state=checked]:bg-success" : ""
                                  )}
                                />
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="card-modern">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron clientes</h3>
                <p className="text-muted-foreground text-center">
                  No hay clientes que coincidan con los filtros aplicados.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
