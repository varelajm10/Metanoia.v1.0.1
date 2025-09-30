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
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  RefreshCw,
  Building2,
  UserCheck,
  Target,
  Zap
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  Area,
  AreaChart
} from 'recharts'

interface AnalyticsData {
  mrr: {
    current: number
    growth: number
    trend: Array<{ month: string; revenue: number }>
  }
  churn: {
    rate: number
    trend: Array<{ month: string; churn: number }>
  }
  customers: {
    total: number
    active: number
    growth: {
      current: number
      lastMonth: number
      growth: number
    }
  }
  users: {
    total: number
    trend: Array<{ month: string; users: number }>
  }
  modules: Array<{
    name: string
    value: number
    moduleKey: string
  }>
  summary: {
    totalRevenue: number
    averageRevenuePerTenant: number
    moduleAdoptionRate: number
  }
}

export default function SuperAdminAnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user && user.role !== 'SUPER_ADMIN') {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && user.role === 'SUPER_ADMIN') {
      fetchAnalytics()
    }
  }, [user])

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true)
      const response = await fetch('/api/superadmin/analytics')
      const result = await response.json()
      
      if (result.success) {
        setAnalytics(result.data)
      } else {
        console.error('Error fetching analytics:', result.error)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAnalytics()
    setRefreshing(false)
  }

  if (loading || analyticsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Cargando analytics...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'SUPER_ADMIN') {
    return null
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getGrowthColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? TrendingUp : TrendingDown
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16']

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="btn-ghost-modern"
            >
              <Link href="/super-admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Link>
            </Button>
            <div>
              <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-2xl font-bold text-transparent">
                📊 Inteligencia de Negocio
              </h1>
              <p className="text-sm text-muted-foreground">
                Métricas y análisis del ecosistema Metanoia
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Métricas Principales */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* MRR */}
          <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-sm font-medium text-muted-foreground mb-4">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold">MRR</div>
                  <div className="text-xs text-muted-foreground">Ingreso Mensual Recurrente</div>
                </div>
              </CardTitle>
              <CardContent className="pt-0">
                <div className="bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-bold text-transparent mb-2">
                  {analytics ? formatCurrency(analytics.mrr.current) : '--'}
                </div>
                <div className="flex items-center text-xs">
                  {analytics && (
                    <>
                      {(() => {
                        const GrowthIcon = getGrowthIcon(analytics.mrr.growth)
                        return <GrowthIcon className={`mr-1 h-3 w-3 ${getGrowthColor(analytics.mrr.growth)}`} />
                      })()}
                      <span className={getGrowthColor(analytics.mrr.growth)}>
                        {formatPercentage(analytics.mrr.growth)}
                      </span>
                      <span className="ml-1 text-muted-foreground">vs mes anterior</span>
                    </>
                  )}
                </div>
              </CardContent>
            </CardHeader>
          </Card>

          {/* Churn Rate */}
          <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm group hover:shadow-lg hover:shadow-red/10 transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-sm font-medium text-muted-foreground mb-4">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red/20 to-red/10 shadow-lg group-hover:shadow-red/20 transition-all duration-300">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Tasa de Abandono</div>
                  <div className="text-xs text-muted-foreground">Churn Rate</div>
                </div>
              </CardTitle>
              <CardContent className="pt-0">
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {analytics ? `${analytics.churn.rate}%` : '--'}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Activity className="mr-1 h-3 w-3" />
                  <span>Clientes que cancelan</span>
                </div>
              </CardContent>
            </CardHeader>
          </Card>

          {/* Clientes Activos */}
          <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm group hover:shadow-lg hover:shadow-green/10 transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-sm font-medium text-muted-foreground mb-4">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green/20 to-green/10 shadow-lg group-hover:shadow-green/20 transition-all duration-300">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Clientes Activos</div>
                  <div className="text-xs text-muted-foreground">Tenants con suscripción</div>
                </div>
              </CardTitle>
              <CardContent className="pt-0">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {analytics ? analytics.customers.active : '--'}
                </div>
                <div className="flex items-center text-xs">
                  {analytics && (
                    <>
                      {(() => {
                        const GrowthIcon = getGrowthIcon(analytics.customers.growth.growth)
                        return <GrowthIcon className={`mr-1 h-3 w-3 ${getGrowthColor(analytics.customers.growth.growth)}`} />
                      })()}
                      <span className={getGrowthColor(analytics.customers.growth.growth)}>
                        {formatPercentage(analytics.customers.growth.growth)}
                      </span>
                      <span className="ml-1 text-muted-foreground">crecimiento</span>
                    </>
                  )}
                </div>
              </CardContent>
            </CardHeader>
          </Card>

          {/* Total Usuarios */}
          <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm group hover:shadow-lg hover:shadow-blue/10 transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-sm font-medium text-muted-foreground mb-4">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue/20 to-blue/10 shadow-lg group-hover:shadow-blue/20 transition-all duration-300">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Total Usuarios</div>
                  <div className="text-xs text-muted-foreground">Usuarios registrados</div>
                </div>
              </CardTitle>
              <CardContent className="pt-0">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {analytics ? analytics.users.total : '--'}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <UserCheck className="mr-1 h-3 w-3" />
                  <span>En todo el sistema</span>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Módulos Más Populares */}
          <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                Módulos Más Populares
              </CardTitle>
              <CardDescription>
                Distribución de módulos activos entre clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics && (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.modules.slice(0, 6)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [`${value} clientes`, 'Adopción']}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{ 
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tendencias de Ingresos */}
          <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                Tendencias de Ingresos
              </CardTitle>
              <CardDescription>
                Evolución del MRR en los últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics && (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.mrr.trend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value), 'Ingresos']}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{ 
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3B82F6" 
                        fill="#3B82F6"
                        fillOpacity={0.1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tendencias de Usuarios */}
          <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Crecimiento de Usuarios
              </CardTitle>
              <CardDescription>
                Evolución del número de usuarios registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics && (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.users.trend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [`${value} usuarios`, 'Total']}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{ 
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="users" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resumen Ejecutivo */}
          <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-primary" />
                Resumen Ejecutivo
              </CardTitle>
              <CardDescription>
                KPIs clave del ecosistema Metanoia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {analytics && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Ingresos Totales Anuales</span>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(analytics.summary.totalRevenue)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">ARPU (Ingreso por Cliente)</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(analytics.summary.averageRevenuePerTenant)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Tasa de Adopción de Módulos</span>
                    <span className="text-lg font-bold text-blue-600">
                      {analytics.summary.moduleAdoptionRate.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Total de Tenants</span>
                    <span className="text-lg font-bold text-purple-600">
                      {analytics.customers.total}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
