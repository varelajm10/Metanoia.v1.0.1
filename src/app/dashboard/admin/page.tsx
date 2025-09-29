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
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Building,
  Settings,
  Plus,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface AdminStats {
  totalClients: number
  activeClients: number
  totalModules: number
  totalRevenue: number
  monthlyRevenue: number
  clientsThisMonth: number
  recentActivity?: Array<{
    id: string
    type: string
    message: string
    timestamp: string
    metadata: {
      clientName: string
      modules: string[]
    }
  }>
}

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats>({
    totalClients: 0,
    activeClients: 0,
    totalModules: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    clientsThisMonth: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user && user.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchAdminStats()
    }
  }, [user])

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (!response.ok) {
        throw new Error('Error al cargar estadísticas')
      }

      const data = await response.json()
      if (data.success) {
        setStats({
          totalClients: data.data.totalClients,
          activeClients: data.data.activeClients,
          totalModules: data.data.totalModules,
          totalRevenue: data.data.totalRevenue,
          monthlyRevenue: data.data.monthlyRevenue,
          clientsThisMonth: data.data.clientsThisMonth,
          recentActivity: data.data.recentActivity,
        })
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      // Fallback a datos por defecto en caso de error
      setStats({
        totalClients: 0,
        activeClients: 0,
        totalModules: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        clientsThisMonth: 0,
      })
    } finally {
      setStatsLoading(false)
    }
  }

  if (loading || statsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">
            Cargando dashboard de administración...
          </p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
              <div className="flex items-center gap-2">
                <Settings className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">
                  Panel de Administración - Metanoia
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
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
          <p className="text-lg text-muted-foreground">
            Gestiona tu plataforma ERP y todos tus clientes desde aquí
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Clientes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clientes
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.clientsThisMonth} este mes
              </p>
            </CardContent>
          </Card>

          {/* Clientes Activos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Clientes Activos
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeClients}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.activeClients / stats.totalClients) * 100)}%
                del total
              </p>
            </CardContent>
          </Card>

          {/* Módulos Disponibles */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Módulos Disponibles
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalModules}</div>
              <p className="text-xs text-muted-foreground">
                Módulos ERP activos
              </p>
            </CardContent>
          </Card>

          {/* Ingresos Mensuales */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos Mensuales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.monthlyRevenue}</div>
              <p className="text-xs text-muted-foreground">
                Total: ${stats.totalRevenue}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Gestión de Clientes */}
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestión de Clientes
              </CardTitle>
              <CardDescription>
                Administra todos tus clientes (ferreterías, empresas, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total clientes:
                  </span>
                  <Badge variant="secondary">{stats.totalClients}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Activos:
                  </span>
                  <Badge variant="default">{stats.activeClients}</Badge>
                </div>
                <Button
                  className="mt-4 w-full"
                  onClick={() => router.push('/dashboard/admin/tenants')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Gestionar Clientes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Gestión de Módulos */}
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Gestión de Módulos
              </CardTitle>
              <CardDescription>
                Configura y administra todos los módulos ERP disponibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Módulos disponibles:
                  </span>
                  <Badge variant="secondary">{stats.totalModules}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Categorías:
                  </span>
                  <Badge variant="outline">5</Badge>
                </div>
                <Button
                  className="mt-4 w-full"
                  onClick={() => router.push('/dashboard/modules')}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Gestionar Módulos
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Crear Nuevo Cliente */}
          <Card className="cursor-pointer border-dashed transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nuevo Cliente
              </CardTitle>
              <CardDescription>
                Agregar una nueva empresa cliente a la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Crear una nueva cuenta para una empresa que necesita módulos
                  ERP
                </div>
                <Button
                  className="mt-4 w-full"
                  onClick={() =>
                    router.push('/dashboard/admin/tenants?action=create')
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Cliente
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>
              Últimas acciones y cambios en la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity
                  .slice(0, 5)
                  .map((activity: any, index: number) => (
                    <div
                      key={activity.id || index}
                      className="flex items-center gap-4 rounded-lg border p-4"
                    >
                      <div className="rounded-lg bg-green-100 p-2">
                        <Building className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.message}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString(
                            'es-ES',
                            {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}{' '}
                          •{' '}
                          {activity.metadata?.modules?.join(', ') ||
                            'Sin módulos'}
                        </p>
                      </div>
                      <Badge variant={index === 0 ? 'default' : 'outline'}>
                        {index === 0 ? 'Nuevo' : 'Reciente'}
                      </Badge>
                    </div>
                  ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <Building className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p>No hay actividad reciente</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
