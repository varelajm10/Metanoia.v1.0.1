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
  LogOut,
  User,
  Building2,
  Settings,
  BarChart3,
  Package,
  Users,
  UserCheck,
  Calculator,
  ShoppingCart,
  Globe,
  Server,
  Moon,
  Sun,
  GraduationCap,
  Search,
  Sparkles,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { CommandPalette, useCommandPalette } from '@/components/ui/command-palette'
import { AIInsightWidget } from '@/components/ui/ai-insight-widget'

interface DashboardStats {
  totalCustomers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  lowStockProducts: number
}

interface ActiveModule {
  id: string
  name: string
  displayName: string
  description: string
  icon: string
  color: string
  isActive: boolean
}

export default function DashboardPage() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const { CommandPalette } = useCommandPalette()
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)
  const [activeModules, setActiveModules] = useState<ActiveModule[]>([])
  const [modulesLoading, setModulesLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchDashboardStats()
      fetchActiveModules()
    }
  }, [user])

  const fetchDashboardStats = async () => {
    try {
      const [customersRes, productsRes, ordersRes] = await Promise.all([
        fetch('/api/customers-simple'),
        fetch('/api/products-simple'),
        fetch('/api/orders-simple'),
      ])

      const [customersData, productsData, ordersData] = await Promise.all([
        customersRes.json(),
        productsRes.json(),
        ordersRes.json(),
      ])

      const totalRevenue =
        ordersData.orders?.reduce(
          (sum: number, order: any) => sum + (order.total || 0),
          0
        ) || 0

      const pendingOrders =
        ordersData.orders?.filter((order: any) => order.status === 'PENDING')
          .length || 0

      const lowStockProducts =
        productsData.products?.filter(
          (product: any) => product.stock <= product.minStock
        ).length || 0

      setStats({
        totalCustomers: customersData.customers?.length || 0,
        totalProducts: productsData.products?.length || 0,
        totalOrders: ordersData.orders?.length || 0,
        totalRevenue,
        pendingOrders,
        lowStockProducts,
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  const fetchActiveModules = async () => {
    try {
      const response = await fetch('/api/modules-simple')
      if (response.ok) {
        const data = await response.json()
        setActiveModules(data.data || [])
      } else {
        console.error(
          'Modules API error:',
          response.status,
          response.statusText
        )
      }
    } catch (error) {
      console.error('Error fetching active modules:', error)
    } finally {
      setModulesLoading(false)
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

  const getModuleRoute = (moduleId: string) => {
    const routes: { [key: string]: string } = {
      customers: '/dashboard/crm',
      crm: '/dashboard/crm',
      inventory: '/dashboard/inventory',
      accounting: '/dashboard/accounting',
      sales: '/dashboard/sales',
      analytics: '/dashboard/reports',
      foreign_trade: '/dashboard/foreign-trade',
      servers: '/dashboard/servers',
      elevators: '/dashboard/elevators',
      schools: '/dashboard/schools',
    }
    return routes[moduleId] || '/dashboard'
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

  if (!user) {
    return null
  }

  const handleLogout = async () => {
    await logout()
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'default'
      case 'ADMIN':
        return 'secondary'
      case 'MANAGER':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Administrador'
      case 'ADMIN':
        return 'Administrador'
      case 'MANAGER':
        return 'Gerente'
      case 'USER':
        return 'Usuario'
      default:
        return role
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header con Glassmorphism - Reorganizado */}
      <header className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo y nombre a la izquierda */}
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-accent shadow-lg hover:shadow-primary/25 transition-all duration-300">
              <span className="text-xl font-bold text-primary-foreground">
                M
              </span>
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-2xl font-bold text-transparent">
                Metanoia
              </h1>
              <p className="text-sm text-muted-foreground">
                Sistema ERP Modular • Visión AI
              </p>
            </div>
          </div>

          {/* Elementos de la derecha */}
          <div className="flex items-center space-x-4">
            {/* Búsqueda Cmd+K - Icono discreto */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex items-center space-x-2 h-9 px-3 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
              onClick={() => {
                const event = new KeyboardEvent('keydown', {
                  key: 'k',
                  metaKey: true,
                })
                document.dispatchEvent(event)
              }}
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Buscar</span>
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            
            <ThemeToggle />
            
            {/* Información del usuario alineada a la derecha */}
            <div className="text-right">
              <p className="font-medium text-foreground">
                Hola, {user.firstName}!
              </p>
              <Badge
                variant={getRoleBadgeVariant(user.role)}
                className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {getRoleLabel(user.role)}
              </Badge>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="rounded-lg px-4 py-2 font-medium transition-all duration-200 hover:bg-accent/50 hover:text-accent-foreground hover:scale-105"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 relative z-20">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="mb-3 text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            ¡Bienvenido de vuelta!
          </h2>
          <p className="text-lg text-muted-foreground">
            Tu centro de control empresarial con inteligencia artificial
          </p>
        </div>

        {/* AI Insights Section - Sección destacada con ancho completo */}
        <section className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                🤖 Insights Inteligentes
              </h3>
              <p className="text-muted-foreground">
                Análisis automático de tu negocio
              </p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              <Sparkles className="mr-2 h-4 w-4" />
              Preguntar a la IA
            </Button>
          </div>
          <AIInsightWidget isLoading={false} />
        </section>

        {/* Stats Overview - Rejilla de 4 columnas */}
        <section className="mb-8">
          <div className="mb-6">
            <h2 className="mb-2 text-3xl font-semibold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Resumen del Negocio
            </h2>
            <p className="text-muted-foreground">
              Vista general de tu rendimiento empresarial
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-border/20 shadow-sm bg-card/50 backdrop-blur-sm group hover:shadow-md hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02] rounded-lg">
              <CardHeader className="p-6">
                <CardTitle className="flex items-center text-sm font-medium text-muted-foreground mb-4">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm group-hover:shadow-md transition-all duration-300">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Total Clientes</div>
                    <div className="text-xs text-muted-foreground">Clientes registrados</div>
                  </div>
                </CardTitle>
                <CardContent className="pt-0">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {statsLoading ? (
                      <div className="h-10 w-20 bg-muted animate-pulse rounded"></div>
                    ) : (
                      stats.totalCustomers
                    )}
                  </div>
                  <div className="flex items-center text-xs text-success">
                    <div className="mr-1 h-2 w-2 rounded-full bg-success"></div>
                    Activos
                  </div>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="border border-border/20 shadow-sm bg-card/50 backdrop-blur-sm group hover:shadow-md hover:shadow-success/5 transition-all duration-300 hover:scale-[1.02] rounded-lg">
              <CardHeader className="p-6">
                <CardTitle className="flex items-center text-sm font-medium text-muted-foreground mb-4">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-success/20 to-success/10 shadow-sm group-hover:shadow-md transition-all duration-300">
                    <Package className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Total Productos</div>
                    <div className="text-xs text-muted-foreground">Productos en inventario</div>
                  </div>
                </CardTitle>
                <CardContent className="pt-0">
                  <div className="text-4xl font-bold text-success mb-2">
                    {statsLoading ? (
                      <div className="h-10 w-20 bg-muted animate-pulse rounded"></div>
                    ) : (
                      stats.totalProducts
                    )}
                  </div>
                  <div className="flex items-center text-xs text-success">
                    <div className="mr-1 h-2 w-2 rounded-full bg-success"></div>
                    En stock
                  </div>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="border border-border/20 shadow-sm bg-card/50 backdrop-blur-sm group hover:shadow-md hover:shadow-warning/5 transition-all duration-300 hover:scale-[1.02] rounded-lg">
              <CardHeader className="p-6">
                <CardTitle className="flex items-center text-sm font-medium text-muted-foreground mb-4">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-warning/20 to-warning/10 shadow-sm group-hover:shadow-md transition-all duration-300">
                    <BarChart3 className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Total Órdenes</div>
                    <div className="text-xs text-muted-foreground">Órdenes procesadas</div>
                  </div>
                </CardTitle>
                <CardContent className="pt-0">
                  <div className="text-4xl font-bold text-warning mb-2">
                    {statsLoading ? (
                      <div className="h-10 w-20 bg-muted animate-pulse rounded"></div>
                    ) : (
                      stats.totalOrders
                    )}
                  </div>
                  <div className="flex items-center text-xs text-warning">
                    <div className="mr-1 h-2 w-2 rounded-full bg-warning"></div>
                    Procesadas
                  </div>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="border border-border/20 shadow-sm bg-card/50 backdrop-blur-sm group hover:shadow-md hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02] rounded-lg">
              <CardHeader className="p-6">
                <CardTitle className="flex items-center text-sm font-medium text-muted-foreground mb-4">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 shadow-sm group-hover:shadow-md transition-all duration-300">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Ingresos Totales</div>
                    <div className="text-xs text-muted-foreground">Ingresos generados</div>
                  </div>
                </CardTitle>
                <CardContent className="pt-0">
                  <div className="bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-bold text-transparent mb-2">
                    {statsLoading ? (
                      <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
                    ) : (
                      `$${stats.totalRevenue.toLocaleString()}`
                    )}
                  </div>
                  <div className="flex items-center text-xs text-primary">
                    <div className="mr-1 h-2 w-2 rounded-full bg-primary"></div>
                    Generados
                  </div>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Alerts - Rejilla de 2 columnas */}
        {(stats.pendingOrders > 0 || stats.lowStockProducts > 0) && (
          <section className="mb-8">
            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-semibold">Alertas</h2>
              <p className="text-muted-foreground">
                Requieren tu atención inmediata
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.pendingOrders > 0 && (
                <Card className="border border-orange-200/50 shadow-sm bg-orange-50/50 backdrop-blur-sm rounded-lg">
                  <CardHeader className="p-6">
                    <CardTitle className="text-sm font-semibold text-orange-800">
                      Órdenes Pendientes
                    </CardTitle>
                    <CardContent className="pt-0">
                      <div className="text-2xl font-bold text-orange-600">
                        {stats.pendingOrders}
                      </div>
                      <p className="text-xs text-orange-700">
                        Órdenes que requieren atención
                      </p>
                    </CardContent>
                  </CardHeader>
                </Card>
              )}

              {stats.lowStockProducts > 0 && (
                <Card className="border border-red-200/50 shadow-sm bg-red-50/50 backdrop-blur-sm rounded-lg">
                  <CardHeader className="p-6">
                    <CardTitle className="text-sm font-semibold text-red-800">
                      Stock Bajo
                    </CardTitle>
                    <CardContent className="pt-0">
                      <div className="text-2xl font-bold text-red-600">
                        {stats.lowStockProducts}
                      </div>
                      <p className="text-xs text-red-700">
                        Productos que necesitan reposición
                      </p>
                    </CardContent>
                  </CardHeader>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* Módulos Activos - Rejilla de 3 columnas */}
        <section className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-semibold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Módulos Activos
              </h2>
              <p className="text-muted-foreground">
                Accede a los módulos habilitados para tu organización
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                <Sparkles className="mr-2 h-4 w-4" />
                Preguntar a la IA
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/test-navigation">
                  🧪 Prueba Navegación
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/debug-navigation">
                  🔍 Diagnóstico
                </Link>
              </Button>
              {user.role === 'SUPER_ADMIN' && (
                <Button 
                  className="btn-primary-gradient hover:scale-105 transition-transform duration-200"
                  onClick={() => window.location.href = '/dashboard/modules'}
                >
                  <Settings className="mr-2 h-5 w-5" />
                  Gestionar Módulos
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modulesLoading ? (
              // Loading skeleton
              [1, 2, 3].map(i => (
                <Card key={i} className="border border-border/20 shadow-sm bg-card/50 backdrop-blur-sm animate-pulse rounded-lg">
                  <CardHeader className="p-6">
                    <div className="mb-4 h-16 w-16 rounded-2xl bg-muted"></div>
                    <div className="h-6 w-3/4 rounded bg-muted mb-2"></div>
                    <div className="h-4 w-full rounded bg-muted"></div>
                  </CardHeader>
                </Card>
              ))
            ) : activeModules.length > 0 ? (
              // Dynamic modules based on what's active - USING ONCLICK
              activeModules.map((module, index) => {
                const IconComponent = getModuleIcon(module.icon)
                const route = getModuleRoute(module.id)

                const handleModuleClick = () => {
                  console.log(`Navegando a: ${route}`)
                  window.location.href = route
                }

                return (
                  <Card 
                    key={module.id} 
                    className="border border-border/20 shadow-sm bg-card/50 backdrop-blur-sm group hover:shadow-md hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02] h-full cursor-pointer relative z-10 rounded-lg"
                    onClick={handleModuleClick}
                  >
                    <CardHeader className="p-6">
                      <div
                        className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm group-hover:shadow-md transition-all duration-300"
                        style={{ 
                          backgroundColor: `${module.color}20`,
                          border: `2px solid ${module.color}30`
                        }}
                      >
                        <IconComponent
                          className="h-8 w-8 transition-transform duration-300 group-hover:scale-110"
                          style={{ color: module.color }}
                        />
                      </div>
                      <CardTitle className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                        {module.displayName}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {module.description}
                      </CardDescription>
                      <div className="mt-4 flex items-center text-xs text-primary font-medium">
                        <div className="mr-2 h-2 w-2 rounded-full bg-primary"></div>
                        Acceder al módulo
                      </div>
                    </CardHeader>
                  </Card>
                )
              })
            ) : (
              // Fallback modules if no active modules - USING ONCLICK
              <>
                <Card 
                  className="border border-border/20 shadow-sm bg-card/50 backdrop-blur-sm group hover:shadow-md hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02] h-full cursor-pointer rounded-lg"
                  onClick={() => window.location.href = '/dashboard/crm'}
                >
                  <CardHeader className="p-6">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold">
                      Clientes
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Gestiona clientes y contactos
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card 
                  className="border border-border/20 shadow-sm bg-card/50 backdrop-blur-sm group hover:shadow-md hover:shadow-success/5 transition-all duration-300 hover:scale-[1.02] h-full cursor-pointer rounded-lg"
                  onClick={() => window.location.href = '/dashboard/inventory'}
                >
                  <CardHeader className="p-6">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 shadow-sm">
                      <Package className="h-8 w-8 text-success" />
                    </div>
                    <CardTitle className="text-xl font-semibold">
                      Inventario
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Control de productos y stock
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card 
                  className="border border-border/20 shadow-sm bg-card/50 backdrop-blur-sm group hover:shadow-md hover:shadow-warning/5 transition-all duration-300 hover:scale-[1.02] h-full cursor-pointer rounded-lg"
                  onClick={() => window.location.href = '/dashboard/reports'}
                >
                  <CardHeader className="p-6">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10 shadow-sm">
                      <BarChart3 className="h-8 w-8 text-warning" />
                    </div>
                    <CardTitle className="text-xl font-semibold">
                      Reportes
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Análisis y estadísticas
                    </CardDescription>
                  </CardHeader>
                </Card>
              </>
            )}
          </div>
        </section>

        {/* Información del Sistema - Sección agrupada al final */}
        <section className="mb-8">
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-semibold">Información del Sistema</h2>
            <p className="text-muted-foreground">
              Detalles de tu cuenta y organización
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tenant Info */}
            {user.tenant && (
              <Card className="border border-border/20 shadow-sm bg-card/50 backdrop-blur-sm rounded-lg">
                <CardHeader className="p-6">
                  <CardTitle className="flex items-center text-lg font-semibold">
                    <Building2 className="mr-2 h-5 w-5" />
                    Información del Tenant
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Nombre
                      </p>
                      <p className="font-semibold">{user.tenant.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Slug
                      </p>
                      <p className="font-semibold">{user.tenant.slug}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Dominio
                      </p>
                      <p className="font-semibold">{user.tenant.domain || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* User Info */}
            <Card className="border border-border/20 shadow-sm bg-card/50 backdrop-blur-sm rounded-lg">
              <CardHeader className="p-6">
                <CardTitle className="flex items-center text-lg font-semibold">
                  <User className="mr-2 h-5 w-5" />
                  Información del Usuario
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rol</p>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Nombre Completo
                    </p>
                    <p className="font-semibold">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Tenant ID
                    </p>
                    <p className="font-mono text-sm">{user.tenantId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 flex items-center space-x-2 md:mb-0">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-r from-primary to-accent">
                <span className="text-sm font-bold text-primary-foreground">
                  M
                </span>
              </div>
              <span className="font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Metanoia Visión AI
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              <span>
                © 2025 Metanoia{' '}
                <a
                  href="https://metanoia.click"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary transition-colors hover:text-primary/80"
                >
                  metanoia.click
                </a>{' '}
                v1.0.1 • Visión AI
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Command Palette */}
      <CommandPalette />
    </div>
  )
}
