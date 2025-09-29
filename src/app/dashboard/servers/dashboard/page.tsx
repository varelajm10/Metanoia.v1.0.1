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
  Server,
  Users,
  AlertTriangle,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  Clock,
  DollarSign,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface ServerStats {
  totalServers: number
  onlineServers: number
  offlineServers: number
  maintenanceServers: number
  warningServers: number
  totalClients: number
  activeClients: number
  totalRevenue: number
  recentAlerts: number
  serversByType: Array<{
    type: string
    _count: { type: number }
  }>
  serversByClient: Array<{
    clientId: string
    _count: { clientId: number }
  }>
  clientsWithServers: Array<{
    id: string
    companyName: string
    monthlyFee: number | null
    servers: Array<{
      id: string
      name: string
      status: string
    }>
  }>
}

export default function ServersDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [serverStats, setServerStats] = useState<ServerStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (user) {
      fetchServerStats()
    }
  }, [user])

  const fetchServerStats = async () => {
    try {
      setStatsLoading(true)
      const response = await fetch('/api/servers/stats')
      const result = await response.json()

      if (result.success) {
        setServerStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching server stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  if (loading || statsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Cargando dashboard de servidores...</p>
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
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-3xl font-bold text-transparent">
                Dashboard de Servidores
              </h1>
              <p className="text-muted-foreground">
                Panel ejecutivo de infraestructura y monitoreo
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
        {serverStats && (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Servidores
                    </p>
                    <p className="text-2xl font-bold">
                      {serverStats.totalServers}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {serverStats.onlineServers} en línea
                    </p>
                  </div>
                  <Server className="h-8 w-8 text-blue-600" />
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
                      {serverStats.activeClients}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {serverStats.totalClients} totales
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Alertas Recientes
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {serverStats.recentAlerts}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Últimas 24 horas
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Ingresos Mensuales
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      ${serverStats.totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total facturado
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-600" />
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
            <TabsTrigger value="analytics">Análisis</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoreo</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
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
                  <Link href="/dashboard/servers">
                    <Button className="w-full justify-start" variant="outline">
                      <Server className="mr-2 h-4 w-4" />
                      Gestionar Servidores
                    </Button>
                  </Link>
                  <Link href="/dashboard/servers/clients">
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      Gestionar Clientes
                    </Button>
                  </Link>
                  <Link href="/dashboard/servers/alerts">
                    <Button className="w-full justify-start" variant="outline">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Ver Alertas
                    </Button>
                  </Link>
                  <Button className="w-full justify-start" variant="outline">
                    <Activity className="mr-2 h-4 w-4" />
                    Monitoreo en Tiempo Real
                  </Button>
                </CardContent>
              </Card>

              {/* Server Status Overview */}
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Estado de Servidores</CardTitle>
                  <CardDescription>
                    Distribución por estado actual
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {serverStats && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium">En Línea</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {serverStats.onlineServers} servidores
                          </span>
                          <span className="text-sm font-medium">
                            {serverStats.totalServers > 0
                              ? Math.round(
                                  (serverStats.onlineServers /
                                    serverStats.totalServers) *
                                    100
                                )
                              : 0}
                            %
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                          <span className="text-sm font-medium">
                            Advertencia
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {serverStats.warningServers} servidores
                          </span>
                          <span className="text-sm font-medium">
                            {serverStats.totalServers > 0
                              ? Math.round(
                                  (serverStats.warningServers /
                                    serverStats.totalServers) *
                                    100
                                )
                              : 0}
                            %
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                          <span className="text-sm font-medium">
                            Mantenimiento
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {serverStats.maintenanceServers} servidores
                          </span>
                          <span className="text-sm font-medium">
                            {serverStats.totalServers > 0
                              ? Math.round(
                                  (serverStats.maintenanceServers /
                                    serverStats.totalServers) *
                                    100
                                )
                              : 0}
                            %
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <span className="text-sm font-medium">
                            Desconectados
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {serverStats.offlineServers} servidores
                          </span>
                          <span className="text-sm font-medium">
                            {serverStats.totalServers > 0
                              ? Math.round(
                                  (serverStats.offlineServers /
                                    serverStats.totalServers) *
                                    100
                                )
                              : 0}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Clients */}
              <Card className="card-enhanced lg:col-span-2">
                <CardHeader>
                  <CardTitle>Clientes Principales</CardTitle>
                  <CardDescription>
                    Top clientes por número de servidores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {serverStats && serverStats.clientsWithServers.length > 0 ? (
                    <div className="space-y-4">
                      {serverStats.clientsWithServers
                        .slice(0, 5)
                        .map(client => (
                          <div
                            key={client.id}
                            className="flex items-center justify-between rounded-lg border p-4"
                          >
                            <div>
                              <p className="font-medium">
                                {client.companyName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {client.servers.length} servidor(es)
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                ${client.monthlyFee?.toLocaleString() || '0'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                mensual
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-muted-foreground">
                      No hay clientes registrados
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Server Types Distribution */}
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="mr-2 h-5 w-5" />
                    Tipos de Servidores
                  </CardTitle>
                  <CardDescription>
                    Distribución por tipo de servidor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {serverStats && serverStats.serversByType.length > 0 ? (
                    <div className="space-y-4">
                      {serverStats.serversByType.map((type, index) => (
                        <div
                          key={type.type}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{
                                backgroundColor: [
                                  '#3B82F6',
                                  '#10B981',
                                  '#F59E0B',
                                  '#EF4444',
                                  '#8B5CF6',
                                  '#06B6D4',
                                  '#84CC16',
                                  '#F97316',
                                ][index % 8],
                              }}
                            ></div>
                            <span className="text-sm font-medium">
                              {type.type}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {type._count.type} servidores
                            </span>
                            <span className="text-sm font-medium">
                              {serverStats.totalServers > 0
                                ? Math.round(
                                    (type._count.type /
                                      serverStats.totalServers) *
                                      100
                                  )
                                : 0}
                              %
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-muted-foreground">
                      No hay datos de tipos de servidores
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Métricas de Rendimiento
                  </CardTitle>
                  <CardDescription>
                    Indicadores clave de rendimiento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Uptime Promedio
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-20 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-green-600"
                            style={{ width: '98.5%' }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          98.5%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Tiempo de Respuesta
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-20 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: '85%' }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          45ms
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">CPU Promedio</span>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-20 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-orange-600"
                            style={{ width: '65%' }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          65%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Memoria Promedio
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-20 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-purple-600"
                            style={{ width: '72%' }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          72%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Analytics */}
              <Card className="card-enhanced lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Análisis de Ingresos
                  </CardTitle>
                  <CardDescription>
                    Tendencias de facturación y crecimiento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        +12.5%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Crecimiento mensual
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {serverStats ? serverStats.activeClients : 0}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Clientes activos
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        $
                        {serverStats
                          ? Math.round(
                              serverStats.totalRevenue /
                                (serverStats.activeClients || 1)
                            )
                          : 0}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Ingreso promedio por cliente
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Monitoreo en Tiempo Real</CardTitle>
                <CardDescription>
                  Estado actual de todos los servidores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center">
                  <Activity className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-medium">
                    Monitoreo en Tiempo Real
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Esta funcionalidad estará disponible en la próxima versión
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Incluirá métricas en tiempo real, alertas automáticas y
                    dashboards de monitoreo
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Reportes de Infraestructura</CardTitle>
                <CardDescription>
                  Generar y descargar reportes ejecutivos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Button variant="outline" className="h-20 flex-col">
                    <Server className="mb-2 h-6 w-6" />
                    Reporte de Servidores
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Users className="mb-2 h-6 w-6" />
                    Reporte de Clientes
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <AlertTriangle className="mb-2 h-6 w-6" />
                    Reporte de Alertas
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <TrendingUp className="mb-2 h-6 w-6" />
                    Análisis de Rendimiento
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <DollarSign className="mb-2 h-6 w-6" />
                    Reporte Financiero
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Activity className="mb-2 h-6 w-6" />
                    Reporte de Uptime
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
