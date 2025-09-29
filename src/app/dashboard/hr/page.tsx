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
  DollarSign,
  Calendar,
  TrendingUp,
  UserPlus,
  FileText,
  Clock,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface HRStats {
  totalEmployees: number
  activeEmployees: number
  newEmployeesThisMonth: number
  averageSalary: number
  pendingVacations: number
  totalDepartments: number
  upcomingBirthdays: number
  recentHires: Array<{
    id: string
    firstName: string
    lastName: string
    position: string
    hireDate: string
  }>
  departmentDistribution: Array<{
    department: string
    count: number
    percentage: number
  }>
  salaryDistribution: Array<{
    range: string
    count: number
  }>
  monthlyTrends: Array<{
    month: string
    hires: number
    departures: number
  }>
}

export default function HRDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [hrStats, setHrStats] = useState<HRStats | null>(null)
  const [hrLoading, setHrLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (user) {
      fetchHRStats()
    }
  }, [user])

  const fetchHRStats = async () => {
    try {
      setHrLoading(true)
      const response = await fetch('/api/hr/employees/stats')
      const result = await response.json()

      if (result.success) {
        setHrStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching HR stats:', error)
    } finally {
      setHrLoading(false)
    }
  }

  if (loading || hrLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Cargando dashboard de RRHH...</p>
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
              <h1 className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                Dashboard RRHH
              </h1>
              <p className="text-muted-foreground">
                Panel ejecutivo de Recursos Humanos
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
        {hrStats && (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Empleados
                    </p>
                    <p className="text-2xl font-bold">
                      {hrStats.totalEmployees}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {hrStats.activeEmployees} activos
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
                      Salario Promedio
                    </p>
                    <p className="text-2xl font-bold">
                      ${hrStats.averageSalary.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Promedio mensual
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Vacaciones Pendientes
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {hrStats.pendingVacations}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Requieren aprobación
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Nuevos Empleados
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {hrStats.newEmployeesThisMonth}
                    </p>
                    <p className="text-xs text-muted-foreground">Este mes</p>
                  </div>
                  <UserPlus className="h-8 w-8 text-purple-600" />
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
            <TabsTrigger value="actions">Acciones Rápidas</TabsTrigger>
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
                  <Link href="/dashboard/hr/employees/new">
                    <Button className="w-full justify-start" variant="outline">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Nuevo Empleado
                    </Button>
                  </Link>
                  <Link href="/dashboard/hr/payroll">
                    <Button className="w-full justify-start" variant="outline">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Procesar Nómina
                    </Button>
                  </Link>
                  <Link href="/dashboard/hr/vacations">
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      Aprobar Vacaciones
                    </Button>
                  </Link>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Generar Reportes
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              {hrStats && hrStats.recentHires.length > 0 && (
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle>Contrataciones Recientes</CardTitle>
                    <CardDescription>
                      Últimos empleados agregados al sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {hrStats.recentHires.slice(0, 5).map(hire => (
                        <div
                          key={hire.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div>
                            <p className="font-medium">
                              {hire.firstName} {hire.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {hire.position}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              {new Date(hire.hireDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Department Distribution */}
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="mr-2 h-5 w-5" />
                    Distribución por Departamentos
                  </CardTitle>
                  <CardDescription>
                    Empleados por área de trabajo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {hrStats && hrStats.departmentDistribution.length > 0 ? (
                    <div className="space-y-4">
                      {hrStats.departmentDistribution.map((dept, index) => (
                        <div
                          key={dept.department}
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
                                ][index % 7],
                              }}
                            ></div>
                            <span className="text-sm font-medium">
                              {dept.department}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {dept.count} empleados
                            </span>
                            <span className="text-sm font-medium">
                              {dept.percentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-muted-foreground">
                      No hay datos de departamentos disponibles
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Salary Distribution */}
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Distribución Salarial
                  </CardTitle>
                  <CardDescription>
                    Rangos de salarios por empleados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {hrStats && hrStats.salaryDistribution.length > 0 ? (
                    <div className="space-y-4">
                      {hrStats.salaryDistribution.map((range, index) => (
                        <div
                          key={range.range}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium">
                            {range.range}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-20 rounded-full bg-gray-200">
                              <div
                                className="h-2 rounded-full bg-blue-600"
                                style={{
                                  width: `${(range.count / Math.max(...hrStats.salaryDistribution.map(s => s.count))) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {range.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-muted-foreground">
                      No hay datos de salarios disponibles
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Monthly Trends */}
              <Card className="card-enhanced lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Tendencias Mensuales
                  </CardTitle>
                  <CardDescription>
                    Contrataciones y despidos por mes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {hrStats && hrStats.monthlyTrends.length > 0 ? (
                    <div className="space-y-4">
                      {hrStats.monthlyTrends.slice(-6).map(trend => (
                        <div
                          key={trend.month}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div>
                            <p className="font-medium">{trend.month}</p>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">
                                Contrataciones
                              </p>
                              <p className="text-lg font-bold text-green-600">
                                +{trend.hires}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">
                                Despidos
                              </p>
                              <p className="text-lg font-bold text-red-600">
                                -{trend.departures}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">
                                Neto
                              </p>
                              <p
                                className={`text-lg font-bold ${trend.hires - trend.departures >= 0 ? 'text-green-600' : 'text-red-600'}`}
                              >
                                {trend.hires - trend.departures >= 0 ? '+' : ''}
                                {trend.hires - trend.departures}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-muted-foreground">
                      No hay datos de tendencias disponibles
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Quick Actions Tab */}
          <TabsContent value="actions">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="card-enhanced cursor-pointer transition-shadow hover:shadow-lg">
                <Link href="/dashboard/hr/employees">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Gestión de Empleados</h3>
                        <p className="text-sm text-muted-foreground">
                          Administrar información de empleados
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              <Card className="card-enhanced cursor-pointer transition-shadow hover:shadow-lg">
                <Link href="/dashboard/hr/payroll">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Gestión de Nómina</h3>
                        <p className="text-sm text-muted-foreground">
                          Procesar nómina y salarios
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              <Card className="card-enhanced cursor-pointer transition-shadow hover:shadow-lg">
                <Link href="/dashboard/hr/vacations">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                        <Calendar className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Gestión de Vacaciones</h3>
                        <p className="text-sm text-muted-foreground">
                          Solicitudes y aprobaciones
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              <Card className="card-enhanced cursor-pointer transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                      <TrendingUp className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Evaluaciones</h3>
                      <p className="text-sm text-muted-foreground">
                        Desempeño y reviews
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced cursor-pointer transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <Clock className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Control de Asistencia</h3>
                      <p className="text-sm text-muted-foreground">
                        Registro de horas
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced cursor-pointer transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                      <FileText className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Reportes</h3>
                      <p className="text-sm text-muted-foreground">
                        Análisis y estadísticas
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Reportes de RRHH</CardTitle>
                <CardDescription>
                  Generar y descargar reportes ejecutivos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="mb-2 h-6 w-6" />
                    Reporte de Empleados
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <DollarSign className="mb-2 h-6 w-6" />
                    Reporte de Nómina
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Calendar className="mb-2 h-6 w-6" />
                    Reporte de Vacaciones
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <TrendingUp className="mb-2 h-6 w-6" />
                    Evaluaciones
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <BarChart3 className="mb-2 h-6 w-6" />
                    Estadísticas Generales
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Activity className="mb-2 h-6 w-6" />
                    Tendencias
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
