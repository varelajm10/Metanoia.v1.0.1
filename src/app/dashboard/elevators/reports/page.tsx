'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Building2,
  Wrench,
  Shield,
  Users,
  DollarSign,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'

interface ReportData {
  elevators: {
    total: number
    operational: number
    underMaintenance: number
    outOfService: number
    byBrand: { brand: string; count: number }[]
    byStatus: { status: string; count: number }[]
  }
  maintenance: {
    totalRecords: number
    completed: number
    scheduled: number
    overdue: number
    byType: { type: string; count: number }[]
    averageCost: number
    totalCost: number
  }
  inspections: {
    total: number
    passed: number
    failed: number
    conditional: number
    averageScore: number
    byType: { type: string; count: number }[]
  }
  technicians: {
    total: number
    active: number
    available: number
    averageRating: number
    bySkillLevel: { level: string; count: number }[]
    topPerformers: { name: string; rating: number; orders: number }[]
  }
  financial: {
    totalRevenue: number
    maintenanceRevenue: number
    installationRevenue: number
    averageOrderValue: number
    monthlyGrowth: number
  }
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30d')
  const [reportType, setReportType] = useState('overview')

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setReportData({
        elevators: {
          total: 156,
          operational: 142,
          underMaintenance: 8,
          outOfService: 6,
          byBrand: [
            { brand: 'Otis', count: 45 },
            { brand: 'Schindler', count: 38 },
            { brand: 'KONE', count: 32 },
            { brand: 'ThyssenKrupp', count: 25 },
            { brand: 'Mitsubishi', count: 16 },
          ],
          byStatus: [
            { status: 'Operativo', count: 142 },
            { status: 'En Mantenimiento', count: 8 },
            { status: 'Fuera de Servicio', count: 6 },
          ],
        },
        maintenance: {
          totalRecords: 245,
          completed: 198,
          scheduled: 35,
          overdue: 12,
          byType: [
            { type: 'Preventivo', count: 156 },
            { type: 'Correctivo', count: 67 },
            { type: 'Emergencia', count: 22 },
          ],
          averageCost: 3200,
          totalCost: 784000,
        },
        inspections: {
          total: 89,
          passed: 72,
          failed: 8,
          conditional: 9,
          averageScore: 87.5,
          byType: [
            { type: 'Anual', count: 45 },
            { type: 'Periódica', count: 32 },
            { type: 'Post-Instalación', count: 12 },
          ],
        },
        technicians: {
          total: 12,
          active: 10,
          available: 8,
          averageRating: 4.7,
          bySkillLevel: [
            { level: 'Maestro', count: 2 },
            { level: 'Senior', count: 3 },
            { level: 'Intermedio', count: 4 },
            { level: 'Junior', count: 3 },
          ],
          topPerformers: [
            { name: 'Carlos Mendoza', rating: 4.9, orders: 45 },
            { name: 'Luis Rodríguez', rating: 4.8, orders: 38 },
            { name: 'María García', rating: 4.6, orders: 32 },
          ],
        },
        financial: {
          totalRevenue: 1250000,
          maintenanceRevenue: 750000,
          installationRevenue: 500000,
          averageOrderValue: 4500,
          monthlyGrowth: 12.5,
        },
      })
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operativo':
        return 'text-green-600'
      case 'En Mantenimiento':
        return 'text-yellow-600'
      case 'Fuera de Servicio':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Preventivo':
        return 'text-blue-600'
      case 'Correctivo':
        return 'text-orange-600'
      case 'Emergencia':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getSkillColor = (level: string) => {
    switch (level) {
      case 'Maestro':
        return 'text-purple-600'
      case 'Senior':
        return 'text-orange-600'
      case 'Intermedio':
        return 'text-blue-600'
      case 'Junior':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!reportData) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Reportes y Análisis
          </h1>
          <p className="text-muted-foreground">
            Análisis detallado del rendimiento del módulo de ascensores
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
              <SelectItem value="1y">Último año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ascensores Totales
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.elevators.total}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (reportData.elevators.operational /
                  reportData.elevators.total) *
                  100
              )}
              % operativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mantenimientos
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.maintenance.totalRecords}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (reportData.maintenance.completed /
                  reportData.maintenance.totalRecords) *
                  100
              )}
              % completados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inspecciones</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.inspections.total}
            </div>
            <p className="text-xs text-muted-foreground">
              Puntuación promedio: {reportData.inspections.averageScore}/100
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${reportData.financial.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{reportData.financial.monthlyGrowth}% vs mes anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Reports */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen General</TabsTrigger>
          <TabsTrigger value="elevators">Ascensores</TabsTrigger>
          <TabsTrigger value="maintenance">Mantenimiento</TabsTrigger>
          <TabsTrigger value="inspections">Inspecciones</TabsTrigger>
          <TabsTrigger value="technicians">Técnicos</TabsTrigger>
          <TabsTrigger value="financial">Financiero</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Estado de Ascensores</CardTitle>
                <CardDescription>
                  Distribución por estado operacional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.elevators.byStatus.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            item.status === 'Operativo'
                              ? 'bg-green-500'
                              : item.status === 'En Mantenimiento'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                        ></div>
                        <span className="text-sm">{item.status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.count}</span>
                        <span className="text-sm text-muted-foreground">
                          (
                          {Math.round(
                            (item.count / reportData.elevators.total) * 100
                          )}
                          %)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Marcas de Ascensores</CardTitle>
                <CardDescription>Distribución por fabricante</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.elevators.byBrand.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{item.brand}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.count}</span>
                        <span className="text-sm text-muted-foreground">
                          (
                          {Math.round(
                            (item.count / reportData.elevators.total) * 100
                          )}
                          %)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="elevators" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de Ascensores</CardTitle>
                <CardDescription>
                  Métricas clave del parque de ascensores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total de Ascensores</span>
                    <span className="font-medium">
                      {reportData.elevators.total}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Operativos</span>
                    <span className="font-medium text-green-600">
                      {reportData.elevators.operational}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">En Mantenimiento</span>
                    <span className="font-medium text-yellow-600">
                      {reportData.elevators.underMaintenance}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fuera de Servicio</span>
                    <span className="font-medium text-red-600">
                      {reportData.elevators.outOfService}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disponibilidad</CardTitle>
                <CardDescription>
                  Tasa de disponibilidad del parque
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">
                    {Math.round(
                      (reportData.elevators.operational /
                        reportData.elevators.total) *
                        100
                    )}
                    %
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Tasa de disponibilidad
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Registros de Mantenimiento</CardTitle>
                <CardDescription>
                  Actividad de mantenimiento por tipo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.maintenance.byType.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{item.type}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.count}</span>
                        <span className="text-sm text-muted-foreground">
                          (
                          {Math.round(
                            (item.count / reportData.maintenance.totalRecords) *
                              100
                          )}
                          %)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Costos de Mantenimiento</CardTitle>
                <CardDescription>
                  Análisis financiero del mantenimiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Costo Total</span>
                    <span className="font-medium">
                      ${reportData.maintenance.totalCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Costo Promedio</span>
                    <span className="font-medium">
                      ${reportData.maintenance.averageCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completados</span>
                    <span className="font-medium text-green-600">
                      {reportData.maintenance.completed}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Vencidos</span>
                    <span className="font-medium text-red-600">
                      {reportData.maintenance.overdue}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inspections" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Resultados de Inspecciones</CardTitle>
                <CardDescription>Distribución de resultados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Aprobadas</span>
                    <span className="font-medium text-green-600">
                      {reportData.inspections.passed}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reprobadas</span>
                    <span className="font-medium text-red-600">
                      {reportData.inspections.failed}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Condicionales</span>
                    <span className="font-medium text-yellow-600">
                      {reportData.inspections.conditional}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Puntuación Promedio</span>
                    <span className="font-medium">
                      {reportData.inspections.averageScore}/100
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tipos de Inspección</CardTitle>
                <CardDescription>
                  Distribución por tipo de inspección
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.inspections.byType.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{item.type}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.count}</span>
                        <span className="text-sm text-muted-foreground">
                          (
                          {Math.round(
                            (item.count / reportData.inspections.total) * 100
                          )}
                          %)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technicians" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Nivel</CardTitle>
                <CardDescription>
                  Técnicos por nivel de habilidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.technicians.bySkillLevel.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{item.level}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.count}</span>
                        <span className="text-sm text-muted-foreground">
                          (
                          {Math.round(
                            (item.count / reportData.technicians.total) * 100
                          )}
                          %)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mejores Técnicos</CardTitle>
                <CardDescription>
                  Técnicos con mejor rendimiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.technicians.topPerformers.map((tech, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{tech.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {tech.orders} órdenes
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-yellow-400" />
                        <span className="font-medium">{tech.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ingresos por Categoría</CardTitle>
                <CardDescription>Distribución de ingresos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mantenimiento</span>
                    <span className="font-medium">
                      $
                      {reportData.financial.maintenanceRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Instalaciones</span>
                    <span className="font-medium">
                      $
                      {reportData.financial.installationRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total</span>
                    <span className="font-medium">
                      ${reportData.financial.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas Financieras</CardTitle>
                <CardDescription>
                  Indicadores clave de rendimiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Valor Promedio por Orden</span>
                    <span className="font-medium">
                      ${reportData.financial.averageOrderValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Crecimiento Mensual</span>
                    <span className="font-medium text-green-600">
                      +{reportData.financial.monthlyGrowth}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
