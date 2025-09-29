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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  ArrowLeft,
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  User,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
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
  position: string
  department: string
  employmentType: string
  hireDate: string
  salary?: number
  status: string
  manager?: {
    id: string
    firstName: string
    lastName: string
    employeeNumber: string
  }
  _count: {
    subordinates: number
    payrolls: number
    vacations: number
  }
}

export default function EmployeesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [employeesLoading, setEmployeesLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  )

  useEffect(() => {
    if (user) {
      fetchEmployees()
    }
  }, [user, currentPage, searchTerm, departmentFilter, statusFilter])

  const fetchEmployees = async () => {
    try {
      setEmployeesLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(departmentFilter && { department: departmentFilter }),
        ...(statusFilter && { status: statusFilter }),
      })

      const response = await fetch(`/api/hr/employees?${params}`)
      const result = await response.json()

      if (result.success) {
        setEmployees(result.data.employees)
        setTotalPages(result.data.pagination.pages)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setEmployeesLoading(false)
    }
  }

  const handleDeleteEmployee = async (employee: Employee) => {
    try {
      const response = await fetch(`/api/hr/employees/${employee.id}`, {
        method: 'DELETE',
      })
      const result = await response.json()

      if (result.success) {
        setDeleteDialogOpen(false)
        setEmployeeToDelete(null)
        fetchEmployees() // Refresh the list
      } else {
        alert('Error al eliminar empleado: ' + result.error)
      }
    } catch (error) {
      console.error('Error deleting employee:', error)
      alert('Error al eliminar empleado')
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
                Gestión de Empleados
              </h1>
              <p className="text-muted-foreground">
                Administra la información de todos los empleados
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button asChild className="btn-primary-gradient">
              <Link href="/dashboard/hr/employees/new">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Empleado
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="card-enhanced mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar empleados..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los departamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los departamentos</SelectItem>
                  <SelectItem value="Administración">Administración</SelectItem>
                  <SelectItem value="Ventas">Ventas</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Desarrollo">Desarrollo</SelectItem>
                  <SelectItem value="Soporte">Soporte</SelectItem>
                  <SelectItem value="Finanzas">Finanzas</SelectItem>
                  <SelectItem value="RRHH">RRHH</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los estados</SelectItem>
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="INACTIVE">Inactivo</SelectItem>
                  <SelectItem value="TERMINATED">Terminado</SelectItem>
                  <SelectItem value="ON_LEAVE">En Licencia</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setDepartmentFilter('')
                  setStatusFilter('')
                  setCurrentPage(1)
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Employees List */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Lista de Empleados
            </CardTitle>
            <CardDescription>
              {employees.length} empleados encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {employeesLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded bg-muted"
                  />
                ))}
              </div>
            ) : employees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  No hay empleados registrados
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Agrega tu primer empleado para comenzar
                </p>
                <Button asChild>
                  <Link href="/dashboard/hr/employees/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Empleado
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {employees.map(employee => (
                  <div
                    key={employee.id}
                    className="rounded-lg border p-6 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
                          <User className="h-6 w-6 text-pink-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {employee.firstName} {employee.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            #{employee.employeeNumber} • {employee.position}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {employee.department} • {employee.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Badge
                          className={getEmploymentTypeColor(
                            employee.employmentType
                          )}
                        >
                          {formatEmploymentType(employee.employmentType)}
                        </Badge>
                        <Badge className={getStatusColor(employee.status)}>
                          {formatStatus(employee.status)}
                        </Badge>

                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/dashboard/hr/employees/${employee.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/dashboard/hr/employees/${employee.id}/edit`}
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEmployeeToDelete(employee)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          Fecha de Contratación
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(employee.hireDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Subordinados</p>
                        <p className="text-sm text-muted-foreground">
                          {employee._count.subordinates}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Nóminas</p>
                        <p className="text-sm text-muted-foreground">
                          {employee._count.payrolls}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Vacaciones</p>
                        <p className="text-sm text-muted-foreground">
                          {employee._count.vacations}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t pt-6">
                <p className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que quieres eliminar al empleado{' '}
                <strong>
                  {employeeToDelete?.firstName} {employeeToDelete?.lastName}
                </strong>
                ?
                <br />
                <br />
                Esta acción marcará al empleado como inactivo si tiene registros
                relacionados.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  employeeToDelete && handleDeleteEmployee(employeeToDelete)
                }
              >
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
