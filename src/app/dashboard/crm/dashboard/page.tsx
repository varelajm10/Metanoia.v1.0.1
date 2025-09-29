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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  Eye,
  Plus,
  Calendar,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface CustomerStats {
  totalCustomers: number
  activeCustomers: number
  inactiveCustomers: number
  newThisMonth: number
  newThisWeek: number
  activityRate: number
  conversionRate: number
  customersWithOrders: number
  customersWithInvoices: number
  monthlyData: Array<{
    month: string
    count: number
  }>
  topCustomersByOrders: Array<{
    id: string
    name: string
    email: string | null
    ordersCount: number
    isActive: boolean
  }>
}

export default function CustomerDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [stats, setStats] = useState<CustomerStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (user) {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      setStatsLoading(true)
      const response = await fetch('/api/customers/stats')
      const result = await response.json()

      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching customer stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  if (loading || statsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Cargando dashboard de clientes...</p>
        </div>
      </div>
    )
  }

  if (!user) {
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
              <Link href="/dashboard/crm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a CRM
              </Link>
            </Button>
            <div>
              <h1 className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-3xl font-bold text-transparent">
                Dashboard de Clientes
              </h1>
              <p className="text-muted-foreground">
                Panel ejecutivo de gestión de clientes
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Clientes
                    </p>
                    <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                    <p className="text-xs text-muted-foreground">
                      {stats.newThisMonth} nuevos este mes
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Clientes Activos
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.activeCustomers}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stats.activityRate}% del total
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tasa de Conversión
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {stats.conversionRate}%
                    </p>
                    <p className="text-xs text-muted-foreground">Con órdenes</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Con Facturas
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {stats.customersWithInvoices}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Clientes facturados
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="top-customers">Top Clientes</TabsTrigger>
            <TabsTrigger value="trends">Tendencias</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Quick Actions */}
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                  <CardDescription>
                    Acceso directo a las funciones principales
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/dashboard/crm">
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      Gestionar Clientes
                    </Button>
                  </Link>
                  <Link href="/dashboard/crm/leads">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Gestionar Leads
                    </Button>
                  </Link>
                  <Link href="/dashboard/crm/opportunities">
                    <Button className="w-full justify-start" variant="outline">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Gestionar Oportunidades
                    </Button>
                  </Link>
                  <Button className="w-full justify-start" variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar Email Masivo
                  </Button>
                </CardContent>
              </Card>

              {/* Customer Status Overview */}
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Estado de Clientes</CardTitle>
                  <CardDescription>
                    Distribución por estado actual
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium">Activos</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {stats.activeCustomers} clientes
                          </span>
                          <span className="text-sm font-medium">
                            {Math.round(
                              (stats.activeCustomers / stats.totalCustomers) *
                                100
                            )}
                            %
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <span className="text-sm font-medium">Inactivos</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {stats.inactiveCustomers} clientes
                          </span>
                          <span className="text-sm font-medium">
                            {Math.round(
                              (stats.inactiveCustomers / stats.totalCustomers) *
                                100
                            )}
                            %
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm font-medium">
                            Con Órdenes
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {stats.customersWithOrders} clientes
                          </span>
                          <span className="text-sm font-medium">
                            {Math.round(
                              (stats.customersWithOrders /
                                stats.totalCustomers) *
                                100
                            )}
                            %
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                          <span className="text-sm font-medium">
                            Con Facturas
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {stats.customersWithInvoices} clientes
                          </span>
                          <span className="text-sm font-medium">
                            {Math.round(
                              (stats.customersWithInvoices /
                                stats.totalCustomers) *
                                100
                            )}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="card-enhanced lg:col-span-2">
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>Nuevos clientes registrados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="py-12 text-center">
                    <Calendar className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-medium">
                      Actividad Reciente
                    </h3>
                    <p className="mb-4 text-muted-foreground">
                      Esta funcionalidad estará disponible en la próxima versión
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Incluirá timeline de actividades, comunicaciones y
                      seguimientos
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Analytics Avanzados
                </CardTitle>
                <CardDescription>
                  Análisis detallado del rendimiento de clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center">
                  <BarChart3 className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-medium">
                    Analytics Avanzados
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Esta funcionalidad estará disponible en la próxima versión
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Incluirá gráficos interactivos, tendencias de crecimiento y
                    análisis predictivo
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Top Customers Tab */}
          <TabsContent value="top-customers">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Top Clientes por Órdenes
                </CardTitle>
                <CardDescription>
                  Clientes con mayor número de órdenes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats && stats.topCustomersByOrders.length > 0 ? (
                  <div className="space-y-4">
                    {stats.topCustomersByOrders.map((customer, index) => (
                      <div
                        key={customer.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                            <span className="text-sm font-bold text-blue-600">
                              #{index + 1}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold">{customer.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {customer.email || 'Sin email'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {customer.ordersCount} órdenes
                            </p>
                            <Badge
                              variant={
                                customer.isActive ? 'default' : 'secondary'
                              }
                            >
                              {customer.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-muted-foreground">
                    No hay datos de clientes con órdenes
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Tendencias de Crecimiento
                </CardTitle>
                <CardDescription>
                  Evolución de clientes en los últimos meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats && stats.monthlyData.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          Crecimiento Este Mes
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          +{stats.newThisMonth}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          nuevos clientes
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          Crecimiento Esta Semana
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          +{stats.newThisWeek}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          nuevos clientes
                        </p>
                      </div>
                    </div>
                    <div className="pt-4">
                      <p className="mb-2 text-sm font-medium">
                        Distribución Mensual (Últimos 12 meses)
                      </p>
                      <div className="space-y-2">
                        {stats.monthlyData.slice(-6).map((month, index) => (
                          <div
                            key={month.month}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm text-muted-foreground">
                              {month.month}
                            </span>
                            <div className="flex items-center space-x-2">
                              <div className="h-2 w-20 rounded-full bg-gray-200">
                                <div
                                  className="h-2 rounded-full bg-blue-600"
                                  style={{
                                    width: `${(month.count / Math.max(...stats.monthlyData.map(m => m.count))) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="w-8 text-sm font-medium">
                                {month.count}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="py-8 text-center text-muted-foreground">
                    No hay datos de tendencias disponibles
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
