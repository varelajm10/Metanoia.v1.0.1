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
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'

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
        console.log('Modules API response:', data) // Debug log
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-accent shadow-lg">
              <span className="text-lg font-bold text-primary-foreground">
                M
              </span>
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-2xl font-bold text-transparent">
                Metanoia
              </h1>
              <p className="text-sm text-muted-foreground">
                Sistema ERP Modular Matias 1.0.1
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="text-right">
              <p className="font-medium">
                {user.firstName} {user.lastName}
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
              className="rounded-lg px-4 py-2 font-medium transition-all duration-200 hover:bg-accent/50 hover:text-accent-foreground"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold">
            ¡Bienvenido, {user.firstName}!
          </h2>
          <p className="text-muted-foreground">
            Gestiona tu negocio desde el panel de control de Matias
          </p>
        </div>

        {/* Stats Overview */}
        <div className="mb-12">
          <h2 className="mb-8 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-3xl font-bold text-transparent">
            Resumen del Negocio
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:transform hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  Total Clientes
                </CardTitle>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-primary">
                    {statsLoading ? '...' : stats.totalCustomers}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Clientes registrados
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="rounded-xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:transform hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                    <Package className="h-4 w-4 text-success" />
                  </div>
                  Total Productos
                </CardTitle>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-success">
                    {statsLoading ? '...' : stats.totalProducts}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Productos en inventario
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="rounded-xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:transform hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
                    <BarChart3 className="h-4 w-4 text-warning" />
                  </div>
                  Total Órdenes
                </CardTitle>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-warning">
                    {statsLoading ? '...' : stats.totalOrders}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Órdenes procesadas
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="rounded-xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:transform hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-accent">
                    <Building2 className="h-4 w-4 text-primary-foreground" />
                  </div>
                  Ingresos Totales
                </CardTitle>
                <CardContent className="pt-0">
                  <div className="bg-gradient-to-r from-primary to-accent bg-clip-text text-3xl font-bold text-transparent">
                    {statsLoading
                      ? '...'
                      : `$${stats.totalRevenue.toLocaleString()}`}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ingresos generados
                  </p>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Alerts */}
        {(stats.pendingOrders > 0 || stats.lowStockProducts > 0) && (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold">Alertas</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {stats.pendingOrders > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-orange-800">
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
                <Card className="border-red-200 bg-red-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-red-800">
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
          </div>
        )}

        {/* Tenant Info */}
        {user.tenant && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="mr-2 h-5 w-5" />
                Información del Tenant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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

        {/* Active Modules */}
        <div className="mb-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-3xl font-bold text-transparent">
                Módulos Activos
              </h2>
              <p className="text-muted-foreground">
                Accede a los módulos habilitados para tu organización
              </p>
            </div>
            {user.role === 'SUPER_ADMIN' && (
              <Button asChild className="btn-primary-gradient">
                <Link href="/dashboard/modules">
                  <Settings className="mr-2 h-4 w-4" />
                  Gestionar Módulos
                </Link>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {modulesLoading ? (
              // Loading skeleton
              [1, 2, 3, 4].map(i => (
                <Card key={i} className="card-enhanced animate-pulse">
                  <CardHeader className="pb-4">
                    <div className="mb-3 h-12 w-12 rounded-xl bg-muted"></div>
                    <div className="h-5 w-3/4 rounded bg-muted"></div>
                    <div className="h-3 w-full rounded bg-muted"></div>
                  </CardHeader>
                </Card>
              ))
            ) : activeModules.length > 0 ? (
              // Dynamic modules based on what's active
              activeModules.map((module, index) => {
                const IconComponent = getModuleIcon(module.icon)
                const route = getModuleRoute(module.id)

                return (
                  <Link href={route} key={module.id}>
                    <Card className="card-enhanced hover-lift transition-smooth animate-fade-in-up h-full cursor-pointer">
                      <CardHeader className="pb-4">
                        <div
                          className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl shadow-lg"
                          style={{ backgroundColor: `${module.color}15` }}
                        >
                          <IconComponent
                            className="h-6 w-6"
                            style={{ color: module.color }}
                          />
                        </div>
                        <CardTitle className="text-lg font-semibold">
                          {module.displayName}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {module.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                )
              })
            ) : (
              // Fallback modules if no active modules
              <>
                <Link href="/dashboard/crm">
                  <Card className="card-enhanced hover-lift transition-smooth h-full cursor-pointer">
                    <CardHeader className="pb-4">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shadow-lg">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg font-semibold">
                        Clientes
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Gestiona clientes y contactos
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/dashboard/inventory">
                  <Card className="card-enhanced hover-lift transition-smooth h-full cursor-pointer">
                    <CardHeader className="pb-4">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 shadow-lg">
                        <Package className="h-6 w-6 text-success" />
                      </div>
                      <CardTitle className="text-lg font-semibold">
                        Inventario
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Control de productos y stock
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/dashboard/reports">
                  <Card className="card-enhanced hover-lift transition-smooth h-full cursor-pointer">
                    <CardHeader className="pb-4">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 shadow-lg">
                        <BarChart3 className="h-6 w-6 text-warning" />
                      </div>
                      <CardTitle className="text-lg font-semibold">
                        Reportes
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Análisis y estadísticas
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/dashboard/settings">
                  <Card className="card-enhanced hover-lift transition-smooth h-full cursor-pointer">
                    <CardHeader className="pb-4">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted/20 shadow-lg">
                        <Settings className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-lg font-semibold">
                        Configuración
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Ajustes del sistema
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Información del Usuario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 flex items-center space-x-2 md:mb-0">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <span className="text-sm font-bold text-primary-foreground">
                  M
                </span>
              </div>
              <span className="font-semibold">Matias 1.0.1</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <span>
                © 2025{' '}
                <a
                  href="https://metanoia.click"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary transition-colors hover:text-primary/80"
                >
                  metanoia.click
                </a>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
