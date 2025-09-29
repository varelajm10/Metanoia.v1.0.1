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
  CreditCard,
  Plus,
  FileText,
  TrendingUp,
  DollarSign,
  Receipt,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings,
  Template,
  Percent,
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
  totalPaymentMethods: number
  activePaymentMethods: number
  totalPayments: number
  totalCreditNotes: number
  approvedCreditNotes: number
  totalDebitNotes: number
  approvedDebitNotes: number
  totalTemplates: number
  activeTemplates: number
  totalTaxConfigs: number
  activeTaxConfigs: number
}

export default function BillingDashboard() {
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
      const response = await fetch('/api/billing/dashboard', {
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
          <h1 className="text-3xl font-bold tracking-tight">Facturación</h1>
          <p className="text-muted-foreground">
            Gestión de facturación, pagos y documentos fiscales
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Factura
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Métodos de Pago</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPaymentMethods || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activePaymentMethods || 0} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPayments || 0}</div>
            <p className="text-xs text-muted-foreground">
              Pagos procesados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notas de Crédito</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCreditNotes || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.approvedCreditNotes || 0} aprobadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notas de Débito</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalDebitNotes || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.approvedDebitNotes || 0} aprobadas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Métodos de Pago */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-blue-500" />
              Métodos de Pago
            </CardTitle>
            <CardDescription>
              Configuración de métodos de pago disponibles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <p className="font-medium">Métodos Activos</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.activePaymentMethods || 0} de {stats?.totalPaymentMethods || 0} métodos
                  </p>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Activo
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <p className="font-medium">Configuración</p>
                  <p className="text-sm text-muted-foreground">
                    Gestión de métodos de pago
                  </p>
                </div>
                <Badge variant="outline">
                  Configurar
                </Badge>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Método de Pago
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pagos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-green-500" />
              Pagos
            </CardTitle>
            <CardDescription>
              Registro y seguimiento de pagos recibidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium">Pagos Procesados</p>
                    <p className="text-sm text-muted-foreground">
                      {stats?.totalPayments || 0} pagos registrados
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Procesado
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium">Flujo de Caja</p>
                    <p className="text-sm text-muted-foreground">
                      Seguimiento de ingresos
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  Flujo
                </Badge>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Registrar Pago
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notas de Crédito y Débito */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Receipt className="mr-2 h-5 w-5" />
              Notas de Crédito
            </CardTitle>
            <CardDescription>
              Gestión de notas de crédito y devoluciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium">Notas Aprobadas</p>
                    <p className="text-sm text-muted-foreground">
                      {stats?.approvedCreditNotes || 0} de {stats?.totalCreditNotes || 0} notas
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Aprobada
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <div className="flex-1">
                    <p className="font-medium">Pendientes</p>
                    <p className="text-sm text-muted-foreground">
                      {(stats?.totalCreditNotes || 0) - (stats?.approvedCreditNotes || 0)} por aprobar
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                  Pendiente
                </Badge>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Nota de Crédito
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Notas de Débito
            </CardTitle>
            <CardDescription>
              Gestión de notas de débito y cargos adicionales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium">Notas Aprobadas</p>
                    <p className="text-sm text-muted-foreground">
                      {stats?.approvedDebitNotes || 0} de {stats?.totalDebitNotes || 0} notas
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Aprobada
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <div className="flex-1">
                    <p className="font-medium">Pendientes</p>
                    <p className="text-sm text-muted-foreground">
                      {(stats?.totalDebitNotes || 0) - (stats?.approvedDebitNotes || 0)} por aprobar
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                  Pendiente
                </Badge>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Nota de Débito
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plantillas y Configuración */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Template className="mr-2 h-5 w-5" />
              Plantillas de Factura
            </CardTitle>
            <CardDescription>
              Configuración de plantillas de facturación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <p className="font-medium">Plantillas Activas</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.activeTemplates || 0} de {stats?.totalTemplates || 0} plantillas
                  </p>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Activa
                </Badge>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Gestionar Plantillas
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Percent className="mr-2 h-5 w-5" />
              Configuración de Impuestos
            </CardTitle>
            <CardDescription>
              Gestión de impuestos y tasas fiscales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <p className="font-medium">Configuraciones Activas</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.activeTaxConfigs || 0} de {stats?.totalTaxConfigs || 0} configuraciones
                  </p>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Activa
                </Badge>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Gestionar Impuestos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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
              <span>Facturas</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <DollarSign className="mb-2 h-6 w-6" />
              <span>Pagos</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Receipt className="mb-2 h-6 w-6" />
              <span>Notas de Crédito</span>
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
