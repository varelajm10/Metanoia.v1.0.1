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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  Activity,
  Server,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Bell,
  Settings,
  RefreshCw,
  Eye,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface MonitoringStats {
  totalServers: number
  healthyServers: number
  warningServers: number
  criticalServers: number
  offlineServers: number
  totalAlerts: number
  criticalAlerts: number
  warningAlerts: number
  totalNotifications: number
  pendingNotifications: number
  failedNotifications: number
  recentMetrics: Array<{
    id: string
    metricType: string
    value: number
    unit?: string | null
    timestamp: string
    server: { id: string; name: string }
  }>
  topMetrics: Array<{
    metricType: string
    _count: { metricType: number }
    _avg: { value: number | null }
  }>
}

interface ServerHealth {
  id: string
  overallStatus: string
  lastChecked: string
  cpuUsage?: number | null
  memoryUsage?: number | null
  diskUsage?: number | null
  networkIn?: number | null
  networkOut?: number | null
  uptime?: number | null
  responseTime?: number | null
  activeAlerts: number
  criticalAlerts: number
  warningAlerts: number
  server: {
    id: string
    name: string
    ipAddress: string
    status: string
    client: { companyName: string }
  }
}

export default function MonitoringDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [stats, setStats] = useState<MonitoringStats | null>(null)
  const [serverHealth, setServerHealth] = useState<ServerHealth[]>([])
  const [statsLoading, setStatsLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState('CPU_USAGE')
  const [selectedInterval, setSelectedInterval] = useState('5m')
  const [activeTab, setActiveTab] = useState('overview')
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    if (user) {
      fetchStats()
      fetchServerHealth()
    }
  }, [user])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (autoRefresh && user) {
      interval = setInterval(() => {
        fetchStats()
        fetchServerHealth()
      }, 30000) // Refresh cada 30 segundos
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh, user])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/servers/monitoring/stats')
      const result = await response.json()

      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching monitoring stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  const fetchServerHealth = async () => {
    try {
      const response = await fetch('/api/servers/monitoring/health')
      const result = await response.json()

      if (result.success) {
        setServerHealth(result.data)
      }
    } catch (error) {
      console.error('Error fetching server health:', error)
    }
  }

  const formatMetricType = (type: string) => {
    const types: { [key: string]: string } = {
      CPU_USAGE: 'CPU',
      MEMORY_USAGE: 'Memoria',
      DISK_USAGE: 'Disco',
      NETWORK_IN: 'Red In',
      NETWORK_OUT: 'Red Out',
      UPTIME: 'Uptime',
      RESPONSE_TIME: 'Respuesta',
      TEMPERATURE: 'Temperatura',
      POWER_CONSUMPTION: 'Energía',
    }
    return types[type] || type
  }

  const formatMetricValue = (
    type: string,
    value: number,
    unit?: string | null
  ) => {
    switch (type) {
      case 'CPU_USAGE':
      case 'MEMORY_USAGE':
      case 'DISK_USAGE':
        return `${value.toFixed(1)}%`
      case 'RESPONSE_TIME':
        return `${value.toFixed(0)}ms`
      case 'TEMPERATURE':
        return `${value.toFixed(1)}°C`
      case 'UPTIME':
        return formatUptime(value)
      case 'NETWORK_IN':
      case 'NETWORK_OUT':
        return `${value.toFixed(2)}MB/s`
      default:
        return `${value}${unit || ''}`
    }
  }

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  const getHealthStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      HEALTHY: 'bg-green-100 text-green-800',
      WARNING: 'bg-yellow-100 text-yellow-800',
      CRITICAL: 'bg-red-100 text-red-800',
      OFFLINE: 'bg-gray-100 text-gray-800',
      MAINTENANCE: 'bg-blue-100 text-blue-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'WARNING':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'CRITICAL':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'OFFLINE':
        return <XCircle className="h-5 w-5 text-gray-600" />
      case 'MAINTENANCE':
        return <Clock className="h-5 w-5 text-blue-600" />
      default:
        return <Activity className="h-5 w-5 text-gray-600" />
    }
  }

  if (loading || statsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Cargando dashboard de monitoreo...</p>
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
              <Link href="/dashboard/servers">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Servidores
              </Link>
            </Button>
            <div>
              <h1 className="bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-3xl font-bold text-transparent">
                Monitoreo en Tiempo Real
              </h1>
              <p className="text-muted-foreground">
                Dashboard de métricas y salud del sistema
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant={autoRefresh ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`}
              />
              Auto Refresh
            </Button>
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
                      Servidores Saludables
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.healthyServers}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      de {stats.totalServers} total
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Alertas Activas
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {stats.totalAlerts}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stats.criticalAlerts} críticas
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Notificaciones
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.totalNotifications}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stats.pendingNotifications} pendientes
                    </p>
                  </div>
                  <Bell className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Servidores Críticos
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {stats.criticalServers}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Requieren atención
                    </p>
                  </div>
                  <XCircle className="h-8 w-8 text-orange-600" />
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
            <TabsTrigger value="health">Salud</TabsTrigger>
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Métricas Recientes */}
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Métricas Recientes
                  </CardTitle>
                  <CardDescription>
                    Últimas métricas recibidas del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats && stats.recentMetrics.length > 0 ? (
                    <div className="space-y-4">
                      {stats.recentMetrics.slice(0, 8).map(metric => (
                        <div
                          key={metric.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                              <Activity className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {metric.server.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatMetricType(metric.metricType)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {formatMetricValue(
                                metric.metricType,
                                metric.value,
                                metric.unit
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(metric.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-muted-foreground">
                      No hay métricas recientes
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Top Métricas */}
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Métricas Más Activas
                  </CardTitle>
                  <CardDescription>
                    Tipos de métricas con más actividad
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats && stats.topMetrics.length > 0 ? (
                    <div className="space-y-4">
                      {stats.topMetrics.slice(0, 6).map((metric, index) => (
                        <div
                          key={metric.metricType}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                              <span className="text-sm font-bold text-purple-600">
                                #{index + 1}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                {formatMetricType(metric.metricType)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {metric._count.metricType} mediciones
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-20 rounded-full bg-gray-200">
                              <div
                                className="h-2 rounded-full bg-purple-600"
                                style={{
                                  width: `${(metric._count.metricType / stats.topMetrics[0]._count.metricType) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="w-12 text-sm font-medium">
                              {metric._avg.value
                                ? metric._avg.value.toFixed(1)
                                : 'N/A'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-muted-foreground">
                      No hay datos de métricas disponibles
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Health Tab */}
          <TabsContent value="health">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Estado de Salud de Servidores
                </CardTitle>
                <CardDescription>
                  Estado actual de todos los servidores monitoreados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {serverHealth.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {serverHealth.map(health => (
                      <Card
                        key={health.id}
                        className="transition-shadow hover:shadow-md"
                      >
                        <CardContent className="p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <h3 className="font-semibold">
                              {health.server.name}
                            </h3>
                            <Badge
                              className={getHealthStatusColor(
                                health.overallStatus
                              )}
                            >
                              {getHealthStatusIcon(health.overallStatus)}
                              <span className="ml-1">
                                {health.overallStatus}
                              </span>
                            </Badge>
                          </div>

                          <div className="mb-3 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>CPU:</span>
                              <span
                                className={
                                  health.cpuUsage && health.cpuUsage > 80
                                    ? 'text-red-600'
                                    : ''
                                }
                              >
                                {health.cpuUsage
                                  ? `${health.cpuUsage.toFixed(1)}%`
                                  : 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Memoria:</span>
                              <span
                                className={
                                  health.memoryUsage && health.memoryUsage > 80
                                    ? 'text-red-600'
                                    : ''
                                }
                              >
                                {health.memoryUsage
                                  ? `${health.memoryUsage.toFixed(1)}%`
                                  : 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Disco:</span>
                              <span
                                className={
                                  health.diskUsage && health.diskUsage > 90
                                    ? 'text-red-600'
                                    : ''
                                }
                              >
                                {health.diskUsage
                                  ? `${health.diskUsage.toFixed(1)}%`
                                  : 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Tiempo de Respuesta:</span>
                              <span
                                className={
                                  health.responseTime &&
                                  health.responseTime > 2000
                                    ? 'text-red-600'
                                    : ''
                                }
                              >
                                {health.responseTime
                                  ? `${health.responseTime.toFixed(0)}ms`
                                  : 'N/A'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t pt-2">
                            <div className="text-xs text-muted-foreground">
                              {health.server.client.companyName}
                            </div>
                            <div className="flex space-x-1">
                              {health.criticalAlerts > 0 && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  {health.criticalAlerts} Críticas
                                </Badge>
                              )}
                              {health.warningAlerts > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {health.warningAlerts} Advertencias
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-muted-foreground">
                    No hay datos de salud de servidores disponibles
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Análisis de Métricas
                </CardTitle>
                <CardDescription>
                  Configuración y análisis de métricas del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex items-center space-x-4">
                  <div>
                    <label className="text-sm font-medium">
                      Tipo de Métrica:
                    </label>
                    <Select
                      value={selectedMetric}
                      onValueChange={setSelectedMetric}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CPU_USAGE">Uso de CPU</SelectItem>
                        <SelectItem value="MEMORY_USAGE">
                          Uso de Memoria
                        </SelectItem>
                        <SelectItem value="DISK_USAGE">Uso de Disco</SelectItem>
                        <SelectItem value="NETWORK_IN">Red Entrada</SelectItem>
                        <SelectItem value="NETWORK_OUT">Red Salida</SelectItem>
                        <SelectItem value="RESPONSE_TIME">
                          Tiempo de Respuesta
                        </SelectItem>
                        <SelectItem value="TEMPERATURE">Temperatura</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Intervalo:</label>
                    <Select
                      value={selectedInterval}
                      onValueChange={setSelectedInterval}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1m">1 minuto</SelectItem>
                        <SelectItem value="5m">5 minutos</SelectItem>
                        <SelectItem value="15m">15 minutos</SelectItem>
                        <SelectItem value="1h">1 hora</SelectItem>
                        <SelectItem value="1d">1 día</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Gráfico
                  </Button>
                </div>

                <div className="py-12 text-center">
                  <BarChart3 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">
                    Gráficos de Métricas
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Los gráficos de tendencias se mostrarán aquí
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Selecciona un tipo de métrica y un intervalo para ver los
                    datos
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Sistema de Alertas
                </CardTitle>
                <CardDescription>
                  Configuración y gestión de alertas automáticas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold">Umbrales de Métricas</h3>
                        <Settings className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Configura umbrales de alerta para diferentes métricas
                      </p>
                      <Button className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        Configurar Umbrales
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold">
                          Canal de Notificaciones
                        </h3>
                        <Bell className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Configura cómo recibir las alertas
                      </p>
                      <Button className="w-full">
                        <Bell className="mr-2 h-4 w-4" />
                        Configurar Notificaciones
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold">Historial de Alertas</h3>
                        <Activity className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Revisa el historial completo de alertas
                      </p>
                      <Button className="w-full">
                        <Activity className="mr-2 h-4 w-4" />
                        Ver Historial
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
