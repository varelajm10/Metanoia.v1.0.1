'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  UserCheck,
  AlertTriangle,
} from 'lucide-react'

interface Student {
  id: string
  firstName: string
  lastName: string
  studentCode: string
  email?: string
  phone?: string
  grade: string
  section?: string
  status:
    | 'ACTIVE'
    | 'INACTIVE'
    | 'GRADUATED'
    | 'TRANSFERRED'
    | 'EXPELLED'
    | 'WITHDRAWN'
  enrollmentDate: string
  address: string
  city: string
  photoUrl?: string
  parents: Array<{
    id: string
    firstName: string
    lastName: string
    relationship: string
    email: string
    phone: string
    isPrimaryContact: boolean
  }>
}

export default function StudentsPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterGrade, setFilterGrade] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setStudents([
        {
          id: '1',
          firstName: 'María',
          lastName: 'González',
          studentCode: 'MAR-001',
          email: 'maria.gonzalez@email.com',
          phone: '+1234567890',
          grade: '3ro',
          section: 'A',
          status: 'ACTIVE',
          enrollmentDate: '2023-08-15',
          address: 'Calle Principal 123',
          city: 'Ciudad',
          photoUrl: '/avatars/maria.jpg',
          parents: [
            {
              id: '1',
              firstName: 'Carlos',
              lastName: 'González',
              relationship: 'FATHER',
              email: 'carlos.gonzalez@email.com',
              phone: '+1234567891',
              isPrimaryContact: true,
            },
          ],
        },
        {
          id: '2',
          firstName: 'Carlos',
          lastName: 'Rodríguez',
          studentCode: 'CAR-002',
          email: 'carlos.rodriguez@email.com',
          phone: '+1234567892',
          grade: '5to',
          section: 'B',
          status: 'ACTIVE',
          enrollmentDate: '2022-08-20',
          address: 'Avenida Central 456',
          city: 'Ciudad',
          parents: [
            {
              id: '2',
              firstName: 'Ana',
              lastName: 'Rodríguez',
              relationship: 'MOTHER',
              email: 'ana.rodriguez@email.com',
              phone: '+1234567893',
              isPrimaryContact: true,
            },
          ],
        },
        {
          id: '3',
          firstName: 'Ana',
          lastName: 'Martínez',
          studentCode: 'ANA-003',
          email: 'ana.martinez@email.com',
          phone: '+1234567894',
          grade: '2do',
          section: 'C',
          status: 'ACTIVE',
          enrollmentDate: '2024-01-10',
          address: 'Plaza Mayor 789',
          city: 'Ciudad',
          parents: [
            {
              id: '3',
              firstName: 'Luis',
              lastName: 'Martínez',
              relationship: 'FATHER',
              email: 'luis.martinez@email.com',
              phone: '+1234567895',
              isPrimaryContact: true,
            },
          ],
        },
        {
          id: '4',
          firstName: 'Luis',
          lastName: 'Fernández',
          studentCode: 'LUI-004',
          email: 'luis.fernandez@email.com',
          phone: '+1234567896',
          grade: '4to',
          section: 'A',
          status: 'ACTIVE',
          enrollmentDate: '2023-08-15',
          address: 'Calle Secundaria 321',
          city: 'Ciudad',
          parents: [
            {
              id: '4',
              firstName: 'Carmen',
              lastName: 'Fernández',
              relationship: 'MOTHER',
              email: 'carmen.fernandez@email.com',
              phone: '+1234567897',
              isPrimaryContact: true,
            },
          ],
        },
        {
          id: '5',
          firstName: 'Pedro',
          lastName: 'Silva',
          studentCode: 'PED-005',
          email: 'pedro.silva@email.com',
          phone: '+1234567898',
          grade: '6to',
          section: 'B',
          status: 'ACTIVE',
          enrollmentDate: '2022-08-20',
          address: 'Boulevard Norte 654',
          city: 'Ciudad',
          parents: [
            {
              id: '5',
              firstName: 'Roberto',
              lastName: 'Silva',
              relationship: 'FATHER',
              email: 'roberto.silva@email.com',
              phone: '+1234567899',
              isPrimaryContact: true,
            },
          ],
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800'
      case 'GRADUATED':
        return 'bg-blue-100 text-blue-800'
      case 'TRANSFERRED':
        return 'bg-yellow-100 text-yellow-800'
      case 'EXPELLED':
        return 'bg-red-100 text-red-800'
      case 'WITHDRAWN':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Activo'
      case 'INACTIVE':
        return 'Inactivo'
      case 'GRADUATED':
        return 'Graduado'
      case 'TRANSFERRED':
        return 'Transferido'
      case 'EXPELLED':
        return 'Expulsado'
      case 'WITHDRAWN':
        return 'Retirado'
      default:
        return 'Desconocido'
    }
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGrade = !filterGrade || student.grade === filterGrade
    const matchesStatus = !filterStatus || student.status === filterStatus

    return matchesSearch && matchesGrade && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Estudiantes
          </h1>
          <p className="text-muted-foreground">
            Administra la información de todos los estudiantes
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/schools/students/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Estudiante
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
          <CardDescription>
            Busca y filtra estudiantes por diferentes criterios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nombre, código, email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grado</Label>
              <Select value={filterGrade} onValueChange={setFilterGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los grados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los grados</SelectItem>
                  <SelectItem value="1ro">1ro</SelectItem>
                  <SelectItem value="2do">2do</SelectItem>
                  <SelectItem value="3ro">3ro</SelectItem>
                  <SelectItem value="4to">4to</SelectItem>
                  <SelectItem value="5to">5to</SelectItem>
                  <SelectItem value="6to">6to</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los estados</SelectItem>
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="INACTIVE">Inactivo</SelectItem>
                  <SelectItem value="GRADUATED">Graduado</SelectItem>
                  <SelectItem value="TRANSFERRED">Transferido</SelectItem>
                  <SelectItem value="EXPELLED">Expulsado</SelectItem>
                  <SelectItem value="WITHDRAWN">Retirado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setFilterGrade('')
                  setFilterStatus('')
                }}
                className="w-full"
              >
                <Filter className="mr-2 h-4 w-4" />
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <div className="grid gap-4">
        {filteredStudents.map(student => (
          <Card key={student.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    {student.photoUrl ? (
                      <img
                        src={student.photoUrl}
                        alt={`${student.firstName} ${student.lastName}`}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <Users className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">
                        {student.firstName} {student.lastName}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(student.status)}
                      >
                        {getStatusText(student.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <GraduationCap className="h-4 w-4" />
                        <span>{student.studentCode}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <UserCheck className="h-4 w-4" />
                        <span>
                          {student.grade} {student.section}
                        </span>
                      </div>
                      {student.email && (
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{student.email}</span>
                        </div>
                      )}
                      {student.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>{student.phone}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {student.address}, {student.city}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Matriculado:{' '}
                          {new Date(
                            student.enrollmentDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {student.parents.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        <strong>Contacto Principal:</strong>{' '}
                        {student.parents[0].firstName}{' '}
                        {student.parents[0].lastName}(
                        {student.parents[0].relationship === 'FATHER'
                          ? 'Padre'
                          : 'Madre'}
                        )
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/dashboard/schools/students/${student.id}`)
                    }
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(
                        `/dashboard/schools/students/${student.id}/edit`
                      )
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (
                        confirm(
                          '¿Estás seguro de que quieres eliminar este estudiante?'
                        )
                      ) {
                        // Lógica para eliminar estudiante
                        // TODO: Implementar eliminación de estudiante
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              No se encontraron estudiantes
            </h3>
            <p className="mb-4 text-center text-muted-foreground">
              No hay estudiantes que coincidan con los filtros aplicados.
            </p>
            <Button
              onClick={() => router.push('/dashboard/schools/students/new')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Primer Estudiante
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
