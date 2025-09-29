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
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  FileText,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats {
  totalCustomers: number
  totalProducts: number
  totalOrders: number
  totalInvoices: number
  totalRevenue: number
  pendingOrders: number
  overdueInvoices: number
}

export default function ReportsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    overdueInvoices: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      // Fetch stats from different APIs
      const [customersRes, productsRes, ordersRes, invoicesRes] =
        await Promise.all([
          fetch('/api/customers'),
          fetch('/api/products'),
          fetch('/api/orders'),
          fetch('/api/invoices'),
        ])

      const [customersData, productsData, ordersData, invoicesData] =
        await Promise.all([
          customersRes.json(),
          productsRes.json(),
          invoicesRes.json(),
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

      setStats({
        totalCustomers: customersData.customers?.length || 0,
        totalProducts: productsData.products?.length || 0,
        totalOrders: ordersData.orders?.length || 0,
        totalInvoices: invoicesData.invoices?.length || 0,
        totalRevenue,
        pendingOrders,
        overdueInvoices: 0, // TODO: Implement overdue invoices
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setStatsLoading(false)
    }
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
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Reportes y Analytics</h1>
              <p className="text-sm text-muted-foreground">
                Análisis y estadísticas del negocio
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button size="sm">
              <BarChart3 className="mr-2 h-4 w-4" />
              Generar Reporte
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold">Resumen General</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  Total Clientes
                </CardTitle>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold">
                    {stats.totalCustomers}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Clientes registrados
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                  <Package className="mr-2 h-4 w-4" />
                  Total Productos
                </CardTitle>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold">
                    {stats.totalProducts}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Productos en inventario
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                  <FileText className="mr-2 h-4 w-4" />
                  Total Órdenes
                </CardTitle>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    Órdenes procesadas
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Ingresos Totales
                </CardTitle>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold">
                    ${stats.totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ingresos generados
                  </p>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Business Metrics */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold">Métricas de Negocio</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                  Órdenes Pendientes
                </CardTitle>
                <CardDescription>
                  Órdenes que requieren atención
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {stats.pendingOrders}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stats.pendingOrders > 0
                    ? 'Requieren procesamiento'
                    : 'Todas las órdenes están procesadas'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingDown className="mr-2 h-5 w-5 text-red-600" />
                  Facturas Vencidas
                </CardTitle>
                <CardDescription>Facturas con pago pendiente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {stats.overdueInvoices}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stats.overdueInvoices > 0
                    ? 'Requieren seguimiento'
                    : 'Todas las facturas están al día'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Reports */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold">Reportes Rápidos</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="cursor-pointer transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-600" />
                  Reporte de Clientes
                </CardTitle>
                <CardDescription>
                  Análisis detallado de la base de clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Generar Reporte
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5 text-green-600" />
                  Reporte de Inventario
                </CardTitle>
                <CardDescription>
                  Estado actual del inventario y stock
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Generar Reporte
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-purple-600" />
                  Reporte Financiero
                </CardTitle>
                <CardDescription>Análisis de ingresos y gastos</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Generar Reporte
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas acciones en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 rounded-lg border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Nuevo cliente registrado</p>
                  <p className="text-sm text-muted-foreground">
                    Cliente Demo agregado al sistema
                  </p>
                </div>
                <Badge variant="outline">Hace 2 horas</Badge>
              </div>

              <div className="flex items-center space-x-4 rounded-lg border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <Package className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Productos actualizados</p>
                  <p className="text-sm text-muted-foreground">
                    3 productos agregados al inventario
                  </p>
                </div>
                <Badge variant="outline">Hace 4 horas</Badge>
              </div>

              <div className="flex items-center space-x-4 rounded-lg border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                  <FileText className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Orden procesada</p>
                  <p className="text-sm text-muted-foreground">
                    ORD-001 completada exitosamente
                  </p>
                </div>
                <Badge variant="outline">Hace 6 horas</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
