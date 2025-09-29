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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  Users,
  Download,
  Plus,
  Filter,
  Search,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface Payroll {
  id: string
  employeeId: string
  employee: {
    id: string
    firstName: string
    lastName: string
    employeeNumber: string
    position: string
    department: string
  }
  period: string
  startDate: string
  endDate: string
  grossSalary: number
  basicSalary: number
  overtime: number
  bonuses: number
  deductions: number
  netSalary: number
  status: string
  paymentDate?: string
  createdAt: string
}

interface PayrollStats {
  totalEmployees: number
  totalGrossSalary: number
  totalNetSalary: number
  totalDeductions: number
  pendingPayrolls: number
  processedPayrolls: number
}

export default function PayrollPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [payrolls, setPayrolls] = useState<Payroll[]>([])
  const [payrollStats, setPayrollStats] = useState<PayrollStats | null>(null)
  const [payrollLoading, setPayrollLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeTab, setActiveTab] = useState('list')

  useEffect(() => {
    if (user) {
      fetchPayrolls()
      fetchPayrollStats()
    }
  }, [user, currentPage, searchTerm, statusFilter, periodFilter])

  const fetchPayrolls = async () => {
    try {
      setPayrollLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(periodFilter && { period: periodFilter }),
      })

      const response = await fetch(`/api/hr/payroll?${params}`)
      const result = await response.json()

      if (result.success) {
        setPayrolls(result.data.payrolls)
        setTotalPages(Math.ceil(result.data.total / 20))
      }
    } catch (error) {
      console.error('Error fetching payrolls:', error)
    } finally {
      setPayrollLoading(false)
    }
  }

  const fetchPayrollStats = async () => {
    try {
      const response = await fetch('/api/hr/payroll/stats')
      const result = await response.json()

      if (result.success) {
        setPayrollStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching payroll stats:', error)
    }
  }

  const generatePayroll = async () => {
    try {
      const response = await fetch('/api/hr/payroll/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          period: new Date().toISOString().slice(0, 7), // YYYY-MM format
          employeeIds: [], // Empty array means all employees
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert('Nómina generada exitosamente')
        fetchPayrolls()
        fetchPayrollStats()
      } else {
        alert('Error al generar nómina: ' + result.error)
      }
    } catch (error) {
      console.error('Error generating payroll:', error)
      alert('Error al generar nómina')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSED: 'bg-green-100 text-green-800',
      PAID: 'bg-blue-100 text-blue-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatStatus = (status: string) => {
    const statuses: { [key: string]: string } = {
      PENDING: 'Pendiente',
      PROCESSED: 'Procesada',
      PAID: 'Pagada',
      CANCELLED: 'Cancelada',
    }
    return statuses[status] || status
  }

  const formatPeriod = (period: string) => {
    const [year, month] = period.split('-')
    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ]
    return `${monthNames[parseInt(month) - 1]} ${year}`
  }

  if (loading || payrollLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Cargando nómina...</p>
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
              <Link href="/dashboard/hr">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a RRHH
              </Link>
            </Button>
            <div>
              <h1 className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                Gestión de Nómina
              </h1>
              <p className="text-muted-foreground">
                Administración completa de nómina y salarios
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button onClick={generatePayroll} className="btn-primary-gradient">
              <Plus className="mr-2 h-4 w-4" />
              Generar Nómina
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        {payrollStats && (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Empleados Activos
                    </p>
                    <p className="text-2xl font-bold">
                      {payrollStats.totalEmployees}
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
                      Salario Bruto Total
                    </p>
                    <p className="text-2xl font-bold">
                      ${payrollStats.totalGrossSalary.toLocaleString()}
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
                      Salario Neto Total
                    </p>
                    <p className="text-2xl font-bold">
                      ${payrollStats.totalNetSalary.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Deducciones</p>
                    <p className="text-2xl font-bold">
                      ${payrollStats.totalDeductions.toLocaleString()}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-red-600" />
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Lista de Nóminas</TabsTrigger>
            <TabsTrigger value="analytics">Análisis</TabsTrigger>
          </TabsList>

          {/* Payroll List Tab */}
          <TabsContent value="list">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Registros de Nómina</CardTitle>
                <CardDescription>
                  Historial completo de nóminas procesadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                      <Input
                        placeholder="Buscar por empleado..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="PENDING">Pendiente</SelectItem>
                      <SelectItem value="PROCESSED">Procesada</SelectItem>
                      <SelectItem value="PAID">Pagada</SelectItem>
                      <SelectItem value="CANCELLED">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={periodFilter} onValueChange={setPeriodFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos los períodos</SelectItem>
                      <SelectItem value="2024-01">Enero 2024</SelectItem>
                      <SelectItem value="2024-02">Febrero 2024</SelectItem>
                      <SelectItem value="2024-03">Marzo 2024</SelectItem>
                      <SelectItem value="2024-04">Abril 2024</SelectItem>
                      <SelectItem value="2024-05">Mayo 2024</SelectItem>
                      <SelectItem value="2024-06">Junio 2024</SelectItem>
                      <SelectItem value="2024-07">Julio 2024</SelectItem>
                      <SelectItem value="2024-08">Agosto 2024</SelectItem>
                      <SelectItem value="2024-09">Septiembre 2024</SelectItem>
                      <SelectItem value="2024-10">Octubre 2024</SelectItem>
                      <SelectItem value="2024-11">Noviembre 2024</SelectItem>
                      <SelectItem value="2024-12">Diciembre 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payroll Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="p-3 text-left">Empleado</th>
                        <th className="p-3 text-left">Período</th>
                        <th className="p-3 text-left">Salario Bruto</th>
                        <th className="p-3 text-left">Deducciones</th>
                        <th className="p-3 text-left">Salario Neto</th>
                        <th className="p-3 text-left">Estado</th>
                        <th className="p-3 text-left">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payrolls.map(payroll => (
                        <tr
                          key={payroll.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-3">
                            <div>
                              <p className="font-medium">
                                {payroll.employee.firstName}{' '}
                                {payroll.employee.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                #{payroll.employee.employeeNumber} •{' '}
                                {payroll.employee.position}
                              </p>
                            </div>
                          </td>
                          <td className="p-3">
                            <p className="font-medium">
                              {formatPeriod(payroll.period)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(payroll.startDate).toLocaleDateString()}{' '}
                              - {new Date(payroll.endDate).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="p-3">
                            <p className="font-medium text-green-600">
                              ${payroll.grossSalary.toLocaleString()}
                            </p>
                          </td>
                          <td className="p-3">
                            <p className="font-medium text-red-600">
                              ${payroll.deductions.toLocaleString()}
                            </p>
                          </td>
                          <td className="p-3">
                            <p className="font-medium text-blue-600">
                              ${payroll.netSalary.toLocaleString()}
                            </p>
                          </td>
                          <td className="p-3">
                            <Badge className={getStatusColor(payroll.status)}>
                              {formatStatus(payroll.status)}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                Ver
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Página {currentPage} de {totalPages}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Distribución de Salarios</CardTitle>
                  <CardDescription>
                    Análisis de salarios por departamento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Desarrollo</span>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-32 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: '75%' }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">$15,000,000</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Ventas</span>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-32 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-green-600"
                            style={{ width: '60%' }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">$12,000,000</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Marketing</span>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-32 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-purple-600"
                            style={{ width: '45%' }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">$9,000,000</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Administración</span>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-32 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-orange-600"
                            style={{ width: '30%' }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">$6,000,000</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Tendencias de Nómina</CardTitle>
                  <CardDescription>
                    Evolución de costos de nómina
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Últimos 6 meses</span>
                      <span className="text-sm font-medium text-green-600">
                        +12.5%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Promedio por empleado</span>
                      <span className="text-sm font-medium">$3,250,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Crecimiento mensual</span>
                      <span className="text-sm font-medium text-blue-600">
                        +2.1%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Deducciones promedio</span>
                      <span className="text-sm font-medium text-red-600">
                        $325,000
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
