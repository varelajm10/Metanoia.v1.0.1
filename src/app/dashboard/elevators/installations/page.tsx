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
  Building2,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Pause,
} from 'lucide-react'

interface Installation {
  id: string
  projectNumber: string
  projectName: string
  description?: string
  startDate: string
  plannedEndDate: string
  actualEndDate?: string
  status:
    | 'PLANNED'
    | 'IN_PROGRESS'
    | 'TESTING'
    | 'COMPLETED'
    | 'ON_HOLD'
    | 'CANCELLED'
  progress: number
  projectManager?: string
  teamMembers: string[]
  budget?: number
  actualCost?: number
  siteAddress: string
  siteContact?: string
  sitePhone?: string
  elevatorType: string
  numberOfElevators: number
  client: {
    id: string
    name: string
    company?: string
  }
}

export default function InstallationsPage() {
  const [installations, setInstallations] = useState<Installation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setInstallations([
        {
          id: '1',
          projectNumber: 'PROJ-2025-001',
          projectName: 'Instalación Torre Centro',
          description:
            'Instalación de 2 ascensores de pasajeros en torre de 15 pisos',
          startDate: '2025-09-01',
          plannedEndDate: '2025-11-15',
          actualEndDate: undefined,
          status: 'IN_PROGRESS',
          progress: 65,
          projectManager: 'Carlos Mendoza',
          teamMembers: ['Juan Pérez', 'María García', 'Luis Rodríguez'],
          budget: 250000,
          actualCost: 180000,
          siteAddress: 'Av. Principal 123, Ciudad',
          siteContact: 'Ing. Ana López',
          sitePhone: '+52 55 1234-5678',
          elevatorType: 'Pasajeros',
          numberOfElevators: 2,
          client: {
            id: '1',
            name: 'Empresa Constructora ABC',
            company: 'ABC Constructora S.A.',
          },
        },
        {
          id: '2',
          projectNumber: 'PROJ-2025-002',
          projectName: 'Modernización Edificio Norte',
          description: 'Modernización de ascensor hidráulico a tracción',
          startDate: '2025-08-15',
          plannedEndDate: '2025-10-30',
          actualEndDate: '2025-10-25',
          status: 'COMPLETED',
          progress: 100,
          projectManager: 'Roberto Silva',
          teamMembers: ['Pedro Martínez', 'Carmen Ruiz'],
          budget: 120000,
          actualCost: 115000,
          siteAddress: 'Calle Norte 456, Ciudad',
          siteContact: 'Sr. Miguel Torres',
          sitePhone: '+52 55 9876-5432',
          elevatorType: 'Pasajeros',
          numberOfElevators: 1,
          client: {
            id: '2',
            name: 'Juan Pérez',
            company: undefined,
          },
        },
        {
          id: '3',
          projectNumber: 'PROJ-2025-003',
          projectName: 'Instalación Plaza Comercial',
          description:
            'Instalación de 4 ascensores panorámicos en centro comercial',
          startDate: '2025-10-01',
          plannedEndDate: '2025-12-20',
          actualEndDate: undefined,
          status: 'PLANNED',
          progress: 0,
          projectManager: 'Laura Fernández',
          teamMembers: ['Carlos Mendoza', 'Ana López', 'Miguel Torres'],
          budget: 500000,
          actualCost: 0,
          siteAddress: 'Plaza Mayor 789, Ciudad',
          siteContact: 'Arq. Patricia Morales',
          sitePhone: '+52 55 5555-1234',
          elevatorType: 'Panorámico',
          numberOfElevators: 4,
          client: {
            id: '3',
            name: 'Centro Comercial XYZ',
            company: 'XYZ Shopping Center',
          },
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800'
      case 'TESTING':
        return 'bg-purple-100 text-purple-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'ON_HOLD':
        return 'bg-orange-100 text-orange-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return 'Planeado'
      case 'IN_PROGRESS':
        return 'En Progreso'
      case 'TESTING':
        return 'En Pruebas'
      case 'COMPLETED':
        return 'Completado'
      case 'ON_HOLD':
        return 'En Espera'
      case 'CANCELLED':
        return 'Cancelado'
      default:
        return 'Desconocido'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return <Calendar className="h-4 w-4" />
      case 'IN_PROGRESS':
        return <Building2 className="h-4 w-4" />
      case 'TESTING':
        return <CheckCircle className="h-4 w-4" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />
      case 'ON_HOLD':
        return <Pause className="h-4 w-4" />
      case 'CANCELLED':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Building2 className="h-4 w-4" />
    }
  }

  const filteredInstallations = installations.filter(installation => {
    const matchesSearch =
      installation.projectNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      installation.projectName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      installation.client.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      installation.siteAddress.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || installation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'bg-red-500'
    if (progress < 50) return 'bg-orange-500'
    if (progress < 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Instalaciones</h1>
          <p className="text-muted-foreground">
            Gestión de proyectos de instalación de ascensores
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Instalación
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Proyectos
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{installations.length}</div>
            <p className="text-xs text-muted-foreground">
              +8% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <Building2 className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {installations.filter(i => i.status === 'IN_PROGRESS').length}
            </div>
            <p className="text-xs text-muted-foreground">Proyectos activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {installations.filter(i => i.status === 'COMPLETED').length}
            </div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Presupuesto Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              $
              {installations
                .reduce((sum, i) => sum + (i.budget || 0), 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Presupuesto asignado
            </p>
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
                  placeholder="Buscar por número de proyecto, nombre, cliente o dirección..."
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
                <SelectItem value="PLANNED">Planeado</SelectItem>
                <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                <SelectItem value="TESTING">En Pruebas</SelectItem>
                <SelectItem value="COMPLETED">Completado</SelectItem>
                <SelectItem value="ON_HOLD">En Espera</SelectItem>
                <SelectItem value="CANCELLED">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid gap-4">
        {filteredInstallations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">
                No se encontraron instalaciones
              </h3>
              <p className="mb-4 text-center text-muted-foreground">
                {searchTerm || statusFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza agregando tu primer proyecto de instalación'}
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Instalación
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredInstallations.map(installation => (
            <Card
              key={installation.id}
              className="transition-shadow hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-lg font-semibold">
                        {installation.projectNumber}
                      </h3>
                      <Badge className={getStatusColor(installation.status)}>
                        {getStatusIcon(installation.status)}
                        <span className="ml-1">
                          {getStatusText(installation.status)}
                        </span>
                      </Badge>
                    </div>

                    <h4 className="mb-2 text-xl font-medium">
                      {installation.projectName}
                    </h4>
                    {installation.description && (
                      <p className="mb-4 text-muted-foreground">
                        {installation.description}
                      </p>
                    )}

                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Cliente</p>
                        <p className="font-medium">
                          {installation.client.name}
                        </p>
                        {installation.client.company && (
                          <p className="text-sm text-muted-foreground">
                            {installation.client.company}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Ubicación
                        </p>
                        <p className="font-medium">
                          {installation.siteAddress}
                        </p>
                        {installation.siteContact && (
                          <p className="text-sm text-muted-foreground">
                            Contacto: {installation.siteContact}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Especificaciones
                        </p>
                        <p className="font-medium">
                          {installation.numberOfElevators} ascensores{' '}
                          {installation.elevatorType}
                        </p>
                        {installation.projectManager && (
                          <p className="text-sm text-muted-foreground">
                            PM: {installation.projectManager}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fechas</p>
                        <p className="font-medium">
                          {new Date(
                            installation.startDate
                          ).toLocaleDateString()}{' '}
                          -{' '}
                          {new Date(
                            installation.plannedEndDate
                          ).toLocaleDateString()}
                        </p>
                        {installation.actualEndDate && (
                          <p className="text-sm text-green-600">
                            Completado:{' '}
                            {new Date(
                              installation.actualEndDate
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Progreso del Proyecto
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {installation.progress}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${installation.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{installation.teamMembers.length} técnicos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>
                          ${installation.actualCost?.toLocaleString() || 0} / $
                          {installation.budget?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {installation.actualEndDate
                            ? `Completado en ${Math.ceil((new Date(installation.actualEndDate).getTime() - new Date(installation.startDate).getTime()) / (1000 * 60 * 60 * 24))} días`
                            : `${Math.ceil((new Date(installation.plannedEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} días restantes`}
                        </span>
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
      {filteredInstallations.length > 0 && (
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredInstallations.length} de {installations.length}{' '}
              instalaciones
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
