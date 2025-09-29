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
  ShoppingCart,
  Plus,
  FileText,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Percent,
  Gift,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface DashboardStats {
  totalQuotes: number
  activeQuotes: number
  totalSales: number
  totalSalespeople: number
  activeSalespeople: number
  totalCommissions: number
  pendingCommissions: number
  totalDiscounts: number
  activeDiscounts: number
}

export default function SalesDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/sales/dashboard', {
        headers: {
          'x-tenant-id': user?.tenantId || '',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  if (loading || statsLoading) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ventas</h1>
          <p className="text-muted-foreground">
            Gestión de ventas, cotizaciones y pipeline comercial
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Venta
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cotizaciones</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalQuotes || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeQuotes || 0} activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSales || 0}</div>
            <p className="text-xs text-muted-foreground">
              Ventas realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendedores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSalespeople || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeSalespeople || 0} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comisiones</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCommissions || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.pendingCommissions || 0} pendientes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cotizaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-500" />
              Cotizaciones
            </CardTitle>
            <CardDescription>
              Gestión de cotizaciones y propuestas comerciales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <div className="flex-1">
                    <p className="font-medium">Cotizaciones Activas</p>
                    <p className="text-sm text-muted-foreground">
                      {stats?.activeQuotes || 0} cotizaciones en proceso
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                  Activa
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium">Total Cotizaciones</p>
                    <p className="text-sm text-muted-foreground">
                      {stats?.totalQuotes || 0} cotizaciones creadas
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Total
                </Badge>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Cotización
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Ventas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5 text-green-500" />
              Ventas
            </CardTitle>
            <CardDescription>
              Registro y seguimiento de ventas realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium">Ventas Realizadas</p>
                    <p className="text-sm text-muted-foreground">
                      {stats?.totalSales || 0} ventas completadas
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Completada
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium">Pipeline de Ventas</p>
                    <p className="text-sm text-muted-foreground">
                      Seguimiento de oportunidades
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  Pipeline
                </Badge>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Venta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendedores y Comisiones */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Vendedores
            </CardTitle>
            <CardDescription>
              Gestión del equipo de ventas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <p className="font-medium">Vendedores Activos</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.activeSalespeople || 0} de {stats?.totalSalespeople || 0} vendedores
                  </p>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Activo
                </Badge>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Gestionar Vendedores
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Comisiones
            </CardTitle>
            <CardDescription>
              Control de comisiones y pagos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <div className="flex-1">
                    <p className="font-medium">Comisiones Pendientes</p>
                    <p className="text-sm text-muted-foreground">
                      {stats?.pendingCommissions || 0} comisiones por pagar
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                  Pendiente
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <p className="font-medium">Total Comisiones</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.totalCommissions || 0} comisiones registradas
                  </p>
                </div>
                <Badge variant="outline">
                  Total
                </Badge>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <BarChart3 className="mr-2 h-4 w-4" />
                Ver Comisiones
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Descuentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gift className="mr-2 h-5 w-5" />
            Descuentos y Promociones
          </CardTitle>
          <CardDescription>
            Gestión de descuentos y promociones comerciales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <p className="font-medium">Descuentos Activos</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.activeDiscounts || 0} promociones activas
                  </p>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Activo
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <p className="font-medium">Total Descuentos</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.totalDiscounts || 0} descuentos creados
                  </p>
                </div>
                <Badge variant="outline">
                  Total
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Descuento
              </Button>

              <Button variant="outline" size="sm" className="w-full">
                <Percent className="mr-2 h-4 w-4" />
                Gestionar Promociones
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Accesos directos a las funciones más utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="mb-2 h-6 w-6" />
              <span>Cotizaciones</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <ShoppingCart className="mb-2 h-6 w-6" />
              <span>Ventas</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="mb-2 h-6 w-6" />
              <span>Vendedores</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3 className="mb-2 h-6 w-6" />
              <span>Reportes</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
