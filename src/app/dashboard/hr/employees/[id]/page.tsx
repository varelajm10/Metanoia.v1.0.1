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
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  DollarSign,
  Briefcase,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface Employee {
  id: string
  employeeNumber: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  personalEmail?: string
  address?: string
  dateOfBirth?: string
  gender?: string
  maritalStatus?: string
  nationality?: string
  position: string
  department: string
  employmentType: string
  hireDate: string
  terminationDate?: string
  salary?: number
  status: string
  emergencyContact?: string
  emergencyPhone?: string
  skills?: string[]
  notes?: string
  manager?: {
    id: string
    firstName: string
    lastName: string
    employeeNumber: string
  }
  subordinates: Array<{
    id: string
    firstName: string
    lastName: string
    employeeNumber: string
    position: string
  }>
  payrolls: Array<{
    id: string
    period: string
    grossSalary: number
    netSalary: number
    status: string
  }>
  vacations: Array<{
    id: string
    type: string
    startDate: string
    endDate: string
    days: number
    status: string
  }>
  performances: Array<{
    id: string
    reviewPeriod: string
    overallScore?: number
    status: string
  }>
  attendance: Array<{
    id: string
    date: string
    clockIn?: string
    clockOut?: string
    status: string
  }>
}

export default function EmployeeDetailPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const employeeId = params.id as string

  const [employee, setEmployee] = useState<Employee | null>(null)
  const [employeeLoading, setEmployeeLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (user && employeeId) {
      fetchEmployee()
    }
  }, [user, employeeId])

  const fetchEmployee = async () => {
    try {
      setEmployeeLoading(true)
      const response = await fetch(`/api/hr/employees/${employeeId}`)
      const result = await response.json()

      if (result.success) {
        setEmployee(result.data)
      } else {
        console.error('Error fetching employee:', result.error)
        router.push('/dashboard/hr/employees')
      }
    } catch (error) {
      console.error('Error fetching employee:', error)
      router.push('/dashboard/hr/employees')
    } finally {
      setEmployeeLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      TERMINATED: 'bg-red-100 text-red-800',
      ON_LEAVE: 'bg-yellow-100 text-yellow-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getEmploymentTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      FULL_TIME: 'bg-blue-100 text-blue-800',
      PART_TIME: 'bg-purple-100 text-purple-800',
      CONTRACT: 'bg-orange-100 text-orange-800',
      TEMPORARY: 'bg-yellow-100 text-yellow-800',
      INTERN: 'bg-pink-100 text-pink-800',
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const formatEmploymentType = (type: string) => {
    const types: { [key: string]: string } = {
      FULL_TIME: 'Tiempo Completo',
      PART_TIME: 'Medio Tiempo',
      CONTRACT: 'Por Contrato',
      TEMPORARY: 'Temporal',
      INTERN: 'Practicante',
    }
    return types[type] || type
  }

  const formatStatus = (status: string) => {
    const statuses: { [key: string]: string } = {
      ACTIVE: 'Activo',
      INACTIVE: 'Inactivo',
      TERMINATED: 'Terminado',
      ON_LEAVE: 'En Licencia',
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

  const formatVacationStatus = (status: string) => {
    const statuses: { [key: string]: string } = {
      PENDING: 'Pendiente',
      APPROVED: 'Aprobada',
      REJECTED: 'Rechazada',
      CANCELLED: 'Cancelada',
    }
    return statuses[status] || status
  }

  if (loading || employeeLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Cargando información del empleado...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!employee) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Empleado no encontrado</h1>
          <Button asChild>
            <Link href="/dashboard/hr/employees">Volver a la lista</Link>
          </Button>
        </div>
      </div>
    )
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
              <Link href="/dashboard/hr/employees">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Empleados
              </Link>
            </Button>
            <div>
              <h1 className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                {employee.firstName} {employee.lastName}
              </h1>
              <p className="text-muted-foreground">
                #{employee.employeeNumber} • {employee.position}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" asChild>
              <Link href={`/dashboard/hr/employees/${employee.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Employee Header Card */}
        <Card className="card-enhanced mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pink-100">
                  <User className="h-10 w-10 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {employee.firstName} {employee.lastName}
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {employee.position} • {employee.department}
                  </p>
                  <div className="mt-2 flex items-center space-x-2">
                    <Badge className={getStatusColor(employee.status)}>
                      {formatStatus(employee.status)}
                    </Badge>
                    <Badge
                      className={getEmploymentTypeColor(
                        employee.employmentType
                      )}
                    >
                      {formatEmploymentType(employee.employmentType)}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Contratado el</p>
                <p className="font-semibold">
                  {new Date(employee.hireDate).toLocaleDateString()}
                </p>
                {employee.salary && (
                  <>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Salario
                    </p>
                    <p className="font-semibold text-green-600">
                      ${employee.salary.toLocaleString()}
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="payroll">Nómina</TabsTrigger>
            <TabsTrigger value="vacations">Vacaciones</TabsTrigger>
            <TabsTrigger value="performance">Desempeño</TabsTrigger>
            <TabsTrigger value="attendance">Asistencia</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Personal Information */}
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{employee.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium">
                        {employee.phone || 'No especificado'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Email Personal
                      </p>
                      <p className="font-medium">
                        {employee.personalEmail || 'No especificado'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Fecha de Nacimiento
                      </p>
                      <p className="font-medium">
                        {employee.dateOfBirth
                          ? new Date(employee.dateOfBirth).toLocaleDateString()
                          : 'No especificada'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Género</p>
                      <p className="font-medium">
                        {employee.gender || 'No especificado'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Estado Civil
                      </p>
                      <p className="font-medium">
                        {employee.maritalStatus || 'No especificado'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Nacionalidad
                      </p>
                      <p className="font-medium">
                        {employee.nationality || 'No especificada'}
                      </p>
                    </div>
                  </div>
                  {employee.address && (
                    <div>
                      <p className="text-sm text-muted-foreground">Dirección</p>
                      <p className="font-medium">{employee.address}</p>
                    </div>
                  )}
                  {employee.emergencyContact && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Contacto de Emergencia
                      </p>
                      <p className="font-medium">{employee.emergencyContact}</p>
                      {employee.emergencyPhone && (
                        <p className="text-sm text-muted-foreground">
                          {employee.emergencyPhone}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Work Information */}
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Información Laboral
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Número de Empleado
                      </p>
                      <p className="font-medium">#{employee.employeeNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cargo</p>
                      <p className="font-medium">{employee.position}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Departamento
                      </p>
                      <p className="font-medium">{employee.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tipo de Contrato
                      </p>
                      <p className="font-medium">
                        {formatEmploymentType(employee.employmentType)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Fecha de Contratación
                      </p>
                      <p className="font-medium">
                        {new Date(employee.hireDate).toLocaleDateString()}
                      </p>
                    </div>
                    {employee.terminationDate && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Fecha de Terminación
                        </p>
                        <p className="font-medium">
                          {new Date(
                            employee.terminationDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                  {employee.manager && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Jefe Directo
                      </p>
                      <p className="font-medium">
                        {employee.manager.firstName} {employee.manager.lastName}{' '}
                        (#{employee.manager.employeeNumber})
                      </p>
                    </div>
                  )}
                  {employee.skills && employee.skills.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Habilidades
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {employee.skills.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Subordinates */}
            {employee.subordinates.length > 0 && (
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Subordinados</CardTitle>
                  <CardDescription>
                    {employee.subordinates.length} empleado(s) reportan
                    directamente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {employee.subordinates.map(subordinate => (
                      <div
                        key={subordinate.id}
                        className="rounded-lg border p-4"
                      >
                        <h4 className="font-medium">
                          {subordinate.firstName} {subordinate.lastName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          #{subordinate.employeeNumber}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {subordinate.position}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {employee.notes && (
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Notas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{employee.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Payroll Tab */}
          <TabsContent value="payroll">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Historial de Nómina
                </CardTitle>
                <CardDescription>
                  Últimos registros de nómina del empleado
                </CardDescription>
              </CardHeader>
              <CardContent>
                {employee.payrolls.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    No hay registros de nómina
                  </p>
                ) : (
                  <div className="space-y-4">
                    {employee.payrolls.map(payroll => (
                      <div
                        key={payroll.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <p className="font-medium">
                            Período {payroll.period}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Bruto: ${payroll.grossSalary.toLocaleString()} •
                            Neto: ${payroll.netSalary.toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="outline">{payroll.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vacations Tab */}
          <TabsContent value="vacations">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Historial de Vacaciones
                </CardTitle>
                <CardDescription>
                  Solicitudes de vacaciones del empleado
                </CardDescription>
              </CardHeader>
              <CardContent>
                {employee.vacations.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    No hay solicitudes de vacaciones
                  </p>
                ) : (
                  <div className="space-y-4">
                    {employee.vacations.map(vacation => (
                      <div
                        key={vacation.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <p className="font-medium">
                            {formatVacationType(vacation.type)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(vacation.startDate).toLocaleDateString()}{' '}
                            - {new Date(vacation.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {vacation.days} día(s)
                          </p>
                        </div>
                        <Badge variant="outline">
                          {formatVacationStatus(vacation.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Evaluaciones de Desempeño
                </CardTitle>
                <CardDescription>
                  Historial de evaluaciones del empleado
                </CardDescription>
              </CardHeader>
              <CardContent>
                {employee.performances.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    No hay evaluaciones registradas
                  </p>
                ) : (
                  <div className="space-y-4">
                    {employee.performances.map(performance => (
                      <div
                        key={performance.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <p className="font-medium">
                            Período {performance.reviewPeriod}
                          </p>
                          {performance.overallScore && (
                            <p className="text-sm text-muted-foreground">
                              Puntuación: {performance.overallScore}/5
                            </p>
                          )}
                        </div>
                        <Badge variant="outline">{performance.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Registro de Asistencia
                </CardTitle>
                <CardDescription>
                  Últimos registros de asistencia (30 días)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {employee.attendance.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    No hay registros de asistencia
                  </p>
                ) : (
                  <div className="space-y-4">
                    {employee.attendance.map(record => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <p className="font-medium">
                            {new Date(record.date).toLocaleDateString()}
                          </p>
                          {record.clockIn && record.clockOut && (
                            <p className="text-sm text-muted-foreground">
                              {record.clockIn} - {record.clockOut}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline">{record.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
