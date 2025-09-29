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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  ArrowLeft,
  Calendar,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Filter,
  Search,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const VacationRequestSchema = z.object({
  employeeId: z.string().min(1, 'Debe seleccionar un empleado'),
  type: z.enum([
    'ANNUAL',
    'SICK',
    'MATERNITY',
    'PATERNITY',
    'EMERGENCY',
    'UNPAID',
  ]),
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
  endDate: z.string().min(1, 'La fecha de fin es requerida'),
  reason: z.string().min(1, 'La razón es requerida'),
  notes: z.string().optional(),
})

type VacationRequestInput = z.infer<typeof VacationRequestSchema>

interface Vacation {
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
  type: string
  startDate: string
  endDate: string
  days: number
  reason: string
  notes?: string
  status: string
  approvedBy?: string
  approvedAt?: string
  createdAt: string
}

interface VacationStats {
  totalRequests: number
  pendingRequests: number
  approvedRequests: number
  rejectedRequests: number
  totalDays: number
}

interface Employee {
  id: string
  firstName: string
  lastName: string
  employeeNumber: string
  position: string
  department: string
}

export default function VacationsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [vacations, setVacations] = useState<Vacation[]>([])
  const [vacationStats, setVacationStats] = useState<VacationStats | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [vacationLoading, setVacationLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeTab, setActiveTab] = useState('list')
  const [showRequestForm, setShowRequestForm] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VacationRequestInput>({
    resolver: zodResolver(VacationRequestSchema),
  })

  useEffect(() => {
    if (user) {
      fetchVacations()
      fetchVacationStats()
      fetchEmployees()
    }
  }, [user, currentPage, searchTerm, statusFilter, typeFilter])

  const fetchVacations = async () => {
    try {
      setVacationLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(typeFilter !== 'all' && { type: typeFilter }),
      })

      const response = await fetch(`/api/hr/vacations?${params}`)
      const result = await response.json()

      if (result.success) {
        setVacations(result.data.vacations)
        setTotalPages(Math.ceil(result.data.total / 20))
      }
    } catch (error) {
      console.error('Error fetching vacations:', error)
    } finally {
      setVacationLoading(false)
    }
  }

  const fetchVacationStats = async () => {
    try {
      const response = await fetch('/api/hr/vacations/stats')
      const result = await response.json()

      if (result.success) {
        setVacationStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching vacation stats:', error)
    }
  }

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/hr/employees?limit=100')
      const result = await response.json()

      if (result.success) {
        setEmployees(result.data.employees)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const onSubmitRequest = async (data: VacationRequestInput) => {
    try {
      const response = await fetch('/api/hr/vacations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        alert('Solicitud de vacaciones creada exitosamente')
        setShowRequestForm(false)
        reset()
        fetchVacations()
        fetchVacationStats()
      } else {
        alert('Error al crear solicitud: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating vacation request:', error)
      alert('Error al crear solicitud de vacaciones')
    }
  }

  const approveVacation = async (vacationId: string) => {
    try {
      const response = await fetch(`/api/hr/vacations/${vacationId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'APPROVED' }),
      })

      const result = await response.json()

      if (result.success) {
        alert('Vacación aprobada exitosamente')
        fetchVacations()
        fetchVacationStats()
      } else {
        alert('Error al aprobar vacación: ' + result.error)
      }
    } catch (error) {
      console.error('Error approving vacation:', error)
      alert('Error al aprobar vacación')
    }
  }

  const rejectVacation = async (vacationId: string) => {
    try {
      const response = await fetch(`/api/hr/vacations/${vacationId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'REJECTED' }),
      })

      const result = await response.json()

      if (result.success) {
        alert('Vacación rechazada')
        fetchVacations()
        fetchVacationStats()
      } else {
        alert('Error al rechazar vacación: ' + result.error)
      }
    } catch (error) {
      console.error('Error rejecting vacation:', error)
      alert('Error al rechazar vacación')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatStatus = (status: string) => {
    const statuses: { [key: string]: string } = {
      PENDING: 'Pendiente',
      APPROVED: 'Aprobada',
      REJECTED: 'Rechazada',
      CANCELLED: 'Cancelada',
    }
    return statuses[status] || status
  }

  const formatVacationType = (type: string) => {
    const types: { [key: string]: string } = {
      ANNUAL: 'Vacaciones Anuales',
      SICK: 'Licencia por Enfermedad',
      MATERNITY: 'Licencia de Maternidad',
      PATERNITY: 'Licencia de Paternidad',
      EMERGENCY: 'Licencia de Emergencia',
      UNPAID: 'Sin Goce de Sueldo',
    }
    return types[type] || type
  }

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays + 1 // Include both start and end dates
  }

  if (loading || vacationLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Cargando vacaciones...</p>
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
                Gestión de Vacaciones
              </h1>
              <p className="text-muted-foreground">
                Administración de solicitudes de vacaciones y licencias
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button
              onClick={() => setShowRequestForm(true)}
              className="btn-primary-gradient"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva Solicitud
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        {vacationStats && (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Solicitudes
                    </p>
                    <p className="text-2xl font-bold">
                      {vacationStats.totalRequests}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pendientes</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {vacationStats.pendingRequests}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Aprobadas</p>
                    <p className="text-2xl font-bold text-green-600">
                      {vacationStats.approvedRequests}
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
                      Días Totales
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {vacationStats.totalDays}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Vacation Request Form Modal */}
        {showRequestForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="card-enhanced max-h-[90vh] w-full max-w-2xl overflow-y-auto">
              <CardHeader>
                <CardTitle>Nueva Solicitud de Vacaciones</CardTitle>
                <CardDescription>
                  Crear una nueva solicitud de vacaciones o licencia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit(onSubmitRequest)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Empleado *</Label>
                      <Select
                        value={watch('employeeId')}
                        onValueChange={value => setValue('employeeId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar empleado" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map(employee => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.firstName} {employee.lastName} (#
                              {employee.employeeNumber})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.employeeId && (
                        <p className="text-sm text-red-500">
                          {errors.employeeId.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo de Licencia *</Label>
                      <Select
                        value={watch('type')}
                        onValueChange={value => setValue('type', value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ANNUAL">
                            Vacaciones Anuales
                          </SelectItem>
                          <SelectItem value="SICK">
                            Licencia por Enfermedad
                          </SelectItem>
                          <SelectItem value="MATERNITY">
                            Licencia de Maternidad
                          </SelectItem>
                          <SelectItem value="PATERNITY">
                            Licencia de Paternidad
                          </SelectItem>
                          <SelectItem value="EMERGENCY">
                            Licencia de Emergencia
                          </SelectItem>
                          <SelectItem value="UNPAID">
                            Sin Goce de Sueldo
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.type && (
                        <p className="text-sm text-red-500">
                          {errors.type.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startDate">Fecha de Inicio *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        {...register('startDate')}
                      />
                      {errors.startDate && (
                        <p className="text-sm text-red-500">
                          {errors.startDate.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">Fecha de Fin *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        {...register('endDate')}
                      />
                      {errors.endDate && (
                        <p className="text-sm text-red-500">
                          {errors.endDate.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Razón *</Label>
                    <Textarea
                      id="reason"
                      {...register('reason')}
                      placeholder="Describa la razón de la solicitud"
                      rows={3}
                    />
                    {errors.reason && (
                      <p className="text-sm text-red-500">
                        {errors.reason.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas Adicionales</Label>
                    <Textarea
                      id="notes"
                      {...register('notes')}
                      placeholder="Notas adicionales (opcional)"
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowRequestForm(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary-gradient"
                    >
                      {isSubmitting ? 'Creando...' : 'Crear Solicitud'}
                    </Button>
                  </div>
                </form>
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
            <TabsTrigger value="list">Lista de Solicitudes</TabsTrigger>
            <TabsTrigger value="calendar">Calendario</TabsTrigger>
          </TabsList>

          {/* Vacation List Tab */}
          <TabsContent value="list">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Solicitudes de Vacaciones</CardTitle>
                <CardDescription>
                  Gestionar todas las solicitudes de vacaciones y licencias
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
                      <SelectItem value="APPROVED">Aprobada</SelectItem>
                      <SelectItem value="REJECTED">Rechazada</SelectItem>
                      <SelectItem value="CANCELLED">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem value="ANNUAL">Vacaciones Anuales</SelectItem>
                      <SelectItem value="SICK">
                        Licencia por Enfermedad
                      </SelectItem>
                      <SelectItem value="MATERNITY">
                        Licencia de Maternidad
                      </SelectItem>
                      <SelectItem value="PATERNITY">
                        Licencia de Paternidad
                      </SelectItem>
                      <SelectItem value="EMERGENCY">
                        Licencia de Emergencia
                      </SelectItem>
                      <SelectItem value="UNPAID">Sin Goce de Sueldo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Vacation Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="p-3 text-left">Empleado</th>
                        <th className="p-3 text-left">Tipo</th>
                        <th className="p-3 text-left">Período</th>
                        <th className="p-3 text-left">Días</th>
                        <th className="p-3 text-left">Estado</th>
                        <th className="p-3 text-left">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vacations.map(vacation => (
                        <tr
                          key={vacation.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-3">
                            <div>
                              <p className="font-medium">
                                {vacation.employee.firstName}{' '}
                                {vacation.employee.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                #{vacation.employee.employeeNumber} •{' '}
                                {vacation.employee.position}
                              </p>
                            </div>
                          </td>
                          <td className="p-3">
                            <p className="font-medium">
                              {formatVacationType(vacation.type)}
                            </p>
                          </td>
                          <td className="p-3">
                            <p className="font-medium">
                              {new Date(
                                vacation.startDate
                              ).toLocaleDateString()}{' '}
                              -{' '}
                              {new Date(vacation.endDate).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="p-3">
                            <p className="font-medium">
                              {vacation.days} día(s)
                            </p>
                          </td>
                          <td className="p-3">
                            <Badge className={getStatusColor(vacation.status)}>
                              {formatStatus(vacation.status)}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center space-x-2">
                              {vacation.status === 'PENDING' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => approveVacation(vacation.id)}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => rejectVacation(vacation.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
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

          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Calendario de Vacaciones</CardTitle>
                <CardDescription>
                  Vista de calendario para visualizar las vacaciones programadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center">
                  <Calendar className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-medium">
                    Calendario Interactivo
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Esta funcionalidad estará disponible en la próxima versión
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Incluirá vista mensual, semanal y diaria con colores
                    diferenciados por tipo de vacación
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
