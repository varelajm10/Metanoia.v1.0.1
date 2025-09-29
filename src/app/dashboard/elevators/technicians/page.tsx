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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'

interface Technician {
  id: string
  employeeNumber: string
  firstName: string
  lastName: string
  email: string
  phone: string
  specialization: string[]
  certifications?: any
  experience?: number
  skillLevel:
    | 'APPRENTICE'
    | 'JUNIOR'
    | 'INTERMEDIATE'
    | 'SENIOR'
    | 'MASTER'
    | 'SPECIALIST'
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE' | 'TRAINING'
  availability: boolean
  emergencyContact?: string
  emergencyPhone?: string
  photo?: string
  documents?: any
  notes?: string
  workOrdersCount: number
  completedWorkOrders: number
  averageRating: number
}

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [skillFilter, setSkillFilter] = useState('all')

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setTechnicians([
        {
          id: '1',
          employeeNumber: 'TECH-001',
          firstName: 'Carlos',
          lastName: 'Mendoza',
          email: 'carlos.mendoza@empresa.com',
          phone: '+52 55 1234-5678',
          specialization: ['Hidráulicos', 'Tracción', 'Montacargas'],
          certifications: {
            'Certificación Otis': '2025-12-31',
            'Certificación Schindler': '2025-11-30',
            'Licencia Técnica': '2026-06-30',
          },
          experience: 8,
          skillLevel: 'SENIOR',
          status: 'ACTIVE',
          availability: true,
          emergencyContact: 'María Mendoza',
          emergencyPhone: '+52 55 9876-5432',
          photo: '/photos/carlos-mendoza.jpg',
          notes: 'Especialista en ascensores de alta velocidad',
          workOrdersCount: 45,
          completedWorkOrders: 42,
          averageRating: 4.8,
        },
        {
          id: '2',
          employeeNumber: 'TECH-002',
          firstName: 'María',
          lastName: 'García',
          email: 'maria.garcia@empresa.com',
          phone: '+52 55 2345-6789',
          specialization: ['Hidráulicos', 'Residenciales'],
          certifications: {
            'Certificación KONE': '2025-10-31',
            'Licencia Técnica': '2026-03-15',
          },
          experience: 5,
          skillLevel: 'INTERMEDIATE',
          status: 'ACTIVE',
          availability: true,
          emergencyContact: 'Roberto García',
          emergencyPhone: '+52 55 8765-4321',
          workOrdersCount: 32,
          completedWorkOrders: 30,
          averageRating: 4.6,
        },
        {
          id: '3',
          employeeNumber: 'TECH-003',
          firstName: 'Luis',
          lastName: 'Rodríguez',
          email: 'luis.rodriguez@empresa.com',
          phone: '+52 55 3456-7890',
          specialization: ['Tracción', 'Panorámicos'],
          certifications: {
            'Certificación ThyssenKrupp': '2025-09-30',
            'Licencia Técnica': '2026-01-20',
          },
          experience: 12,
          skillLevel: 'MASTER',
          status: 'ACTIVE',
          availability: false,
          emergencyContact: 'Ana Rodríguez',
          emergencyPhone: '+52 55 7654-3210',
          workOrdersCount: 58,
          completedWorkOrders: 55,
          averageRating: 4.9,
        },
        {
          id: '4',
          employeeNumber: 'TECH-004',
          firstName: 'Pedro',
          lastName: 'Martínez',
          email: 'pedro.martinez@empresa.com',
          phone: '+52 55 4567-8901',
          specialization: ['Hidráulicos'],
          certifications: {
            'Licencia Técnica': '2026-08-10',
          },
          experience: 2,
          skillLevel: 'JUNIOR',
          status: 'TRAINING',
          availability: true,
          emergencyContact: 'Carmen Martínez',
          emergencyPhone: '+52 55 6543-2109',
          workOrdersCount: 15,
          completedWorkOrders: 12,
          averageRating: 4.2,
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'ON_LEAVE':
        return 'bg-yellow-100 text-yellow-800'
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800'
      case 'TRAINING':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Activo'
      case 'ON_LEAVE':
        return 'De Permiso'
      case 'INACTIVE':
        return 'Inactivo'
      case 'TRAINING':
        return 'En Capacitación'
      default:
        return 'Desconocido'
    }
  }

  const getSkillColor = (skill: string) => {
    switch (skill) {
      case 'APPRENTICE':
        return 'bg-gray-100 text-gray-800'
      case 'JUNIOR':
        return 'bg-blue-100 text-blue-800'
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800'
      case 'SENIOR':
        return 'bg-orange-100 text-orange-800'
      case 'MASTER':
        return 'bg-purple-100 text-purple-800'
      case 'SPECIALIST':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSkillText = (skill: string) => {
    switch (skill) {
      case 'APPRENTICE':
        return 'Aprendiz'
      case 'JUNIOR':
        return 'Junior'
      case 'INTERMEDIATE':
        return 'Intermedio'
      case 'SENIOR':
        return 'Senior'
      case 'MASTER':
        return 'Maestro'
      case 'SPECIALIST':
        return 'Especialista'
      default:
        return 'Desconocido'
    }
  }

  const getAvailabilityColor = (available: boolean) => {
    return available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getAvailabilityText = (available: boolean) => {
    return available ? 'Disponible' : 'No Disponible'
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'fill-current text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  const filteredTechnicians = technicians.filter(technician => {
    const matchesSearch =
      technician.employeeNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      technician.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technician.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technician.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technician.specialization.some(spec =>
        spec.toLowerCase().includes(searchTerm.toLowerCase())
      )

    const matchesStatus =
      statusFilter === 'all' || technician.status === statusFilter
    const matchesSkill =
      skillFilter === 'all' || technician.skillLevel === skillFilter

    return matchesSearch && matchesStatus && matchesSkill
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
          <h1 className="text-3xl font-bold tracking-tight">Técnicos</h1>
          <p className="text-muted-foreground">
            Gestión de técnicos especializados en ascensores
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Técnico
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Técnicos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{technicians.length}</div>
            <p className="text-xs text-muted-foreground">
              +5% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {technicians.filter(t => t.status === 'ACTIVE').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (technicians.filter(t => t.status === 'ACTIVE').length /
                  technicians.length) *
                  100
              )}
              % del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {technicians.filter(t => t.availability).length}
            </div>
            <p className="text-xs text-muted-foreground">Para asignación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Calificación Promedio
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {(
                technicians.reduce((sum, t) => sum + t.averageRating, 0) /
                technicians.length
              ).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">De 5 estrellas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  placeholder="Buscar por número de empleado, nombre, email o especialización..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="ACTIVE">Activo</SelectItem>
                <SelectItem value="ON_LEAVE">De Permiso</SelectItem>
                <SelectItem value="INACTIVE">Inactivo</SelectItem>
                <SelectItem value="TRAINING">En Capacitación</SelectItem>
              </SelectContent>
            </Select>
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Niveles</SelectItem>
                <SelectItem value="APPRENTICE">Aprendiz</SelectItem>
                <SelectItem value="JUNIOR">Junior</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermedio</SelectItem>
                <SelectItem value="SENIOR">Senior</SelectItem>
                <SelectItem value="MASTER">Maestro</SelectItem>
                <SelectItem value="SPECIALIST">Especialista</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid gap-4">
        {filteredTechnicians.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">
                No se encontraron técnicos
              </h3>
              <p className="mb-4 text-center text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || skillFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza agregando tu primer técnico'}
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Técnico
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredTechnicians.map(technician => (
            <Card
              key={technician.id}
              className="transition-shadow hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-lg font-semibold">
                        {technician.firstName} {technician.lastName}
                      </h3>
                      <Badge className={getStatusColor(technician.status)}>
                        {getStatusText(technician.status)}
                      </Badge>
                      <Badge className={getSkillColor(technician.skillLevel)}>
                        {getSkillText(technician.skillLevel)}
                      </Badge>
                      <Badge
                        className={getAvailabilityColor(
                          technician.availability
                        )}
                      >
                        {getAvailabilityText(technician.availability)}
                      </Badge>
                    </div>

                    <p className="mb-4 text-sm text-muted-foreground">
                      {technician.employeeNumber}
                    </p>

                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Contacto
                        </p>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{technician.email}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{technician.phone}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Especializaciones
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {technician.specialization.map((spec, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Experiencia
                        </p>
                        <p className="font-medium">
                          {technician.experience} años
                        </p>
                        {technician.certifications && (
                          <p className="text-sm text-muted-foreground">
                            {Object.keys(technician.certifications).length}{' '}
                            certificaciones
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Rendimiento
                        </p>
                        <div className="flex items-center gap-1">
                          {getRatingStars(technician.averageRating)}
                          <span className="ml-1 text-sm font-medium">
                            {technician.averageRating}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {technician.completedWorkOrders}/
                          {technician.workOrdersCount} órdenes completadas
                        </p>
                      </div>
                    </div>

                    {technician.emergencyContact && (
                      <div className="mb-4">
                        <p className="mb-1 text-sm font-medium">
                          Contacto de Emergencia:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {technician.emergencyContact} -{' '}
                          {technician.emergencyPhone}
                        </p>
                      </div>
                    )}

                    {technician.notes && (
                      <div className="mb-4">
                        <p className="mb-1 text-sm font-medium">Notas:</p>
                        <p className="text-sm text-muted-foreground">
                          {technician.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {technician.workOrdersCount} órdenes asignadas
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {technician.completedWorkOrders} completadas
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{technician.experience} años de experiencia</span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredTechnicians.length > 0 && (
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredTechnicians.length} de {technicians.length}{' '}
              técnicos
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm">
                Siguiente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
