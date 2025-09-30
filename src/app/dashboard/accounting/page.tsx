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
  Calculator,
  Plus,
  FileText,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface DashboardStats {
  totalAccounts: number
  activeAccounts: number
  totalJournalEntries: number
  postedJournalEntries: number
  totalReconciliations: number
  reconciledReconciliations: number
  totalTaxes: number
  activeTaxes: number
}

export default function AccountingDashboard() {
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
      const response = await fetch('/api/accounting/dashboard', {
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
          <h1 className="text-3xl font-bold tracking-tight">Contabilidad</h1>
          <p className="text-muted-foreground">
            Gestión contable completa con plan de cuentas y reportes financieros
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Asiento
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Plan de Cuentas
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalAccounts || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeAccounts || 0} activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Asientos Contables
            </CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalJournalEntries || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.postedJournalEntries || 0} contabilizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conciliaciones
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalReconciliations || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.reconciledReconciliations || 0} conciliadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impuestos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTaxes || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeTaxes || 0} activos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Plan de Cuentas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-500" />
              Plan de Cuentas
            </CardTitle>
            <CardDescription>
              Gestión del plan de cuentas contable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <p className="font-medium">Activos</p>
                  <p className="text-sm text-muted-foreground">
                    Cuentas de activo del balance
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="border-green-200 text-green-600"
                >
                  Activo
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <p className="font-medium">Pasivos</p>
                  <p className="text-sm text-muted-foreground">
                    Cuentas de pasivo del balance
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="border-red-200 text-red-600"
                >
                  Pasivo
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <p className="font-medium">Patrimonio</p>
                  <p className="text-sm text-muted-foreground">
                    Cuentas de patrimonio neto
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="border-blue-200 text-blue-600"
                >
                  Patrimonio
                </Badge>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Gestionar Plan de Cuentas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Asientos Contables */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="mr-2 h-5 w-5 text-green-500" />
              Asientos Contables
            </CardTitle>
            <CardDescription>
              Registro y gestión de asientos contables
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium">Asientos Contabilizados</p>
                    <p className="text-sm text-muted-foreground">
                      {stats?.postedJournalEntries || 0} asientos
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-green-200 text-green-600"
                >
                  Contabilizado
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <div className="flex-1">
                    <p className="font-medium">Asientos Pendientes</p>
                    <p className="text-sm text-muted-foreground">
                      {(stats?.totalJournalEntries || 0) -
                        (stats?.postedJournalEntries || 0)}{' '}
                      asientos
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-yellow-200 text-yellow-600"
                >
                  Pendiente
                </Badge>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Asiento Contable
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conciliación Bancaria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Conciliación Bancaria
          </CardTitle>
          <CardDescription>
            Control y conciliación de cuentas bancarias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <p className="font-medium">Conciliaciones Totales</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.totalReconciliations || 0} conciliaciones
                  </p>
                </div>
                <Badge variant="outline">Total</Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <p className="font-medium">Conciliaciones Pendientes</p>
                  <p className="text-sm text-muted-foreground">
                    {(stats?.totalReconciliations || 0) -
                      (stats?.reconciledReconciliations || 0)}{' '}
                    pendientes
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="border-yellow-200 text-yellow-600"
                >
                  Pendiente
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <p className="font-medium">Conciliaciones Completadas</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.reconciledReconciliations || 0} conciliadas
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="border-green-200 text-green-600"
                >
                  Completada
                </Badge>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Conciliación
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
              <span>Plan de Cuentas</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calculator className="mb-2 h-6 w-6" />
              <span>Asientos Contables</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3 className="mb-2 h-6 w-6" />
              <span>Conciliación Bancaria</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="mb-2 h-6 w-6" />
              <span>Reportes Financieros</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
