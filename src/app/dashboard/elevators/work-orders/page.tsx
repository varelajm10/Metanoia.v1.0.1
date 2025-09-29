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
  FileText,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  DollarSign,
  Building2,
  Star,
  User,
} from 'lucide-react'

interface WorkOrder {
  id: string
  workOrderNumber: string
  title: string
  description?: string
  orderType:
    | 'MAINTENANCE'
    | 'REPAIR'
    | 'INSTALLATION'
    | 'INSPECTION'
    | 'MODERNIZATION'
    | 'EMERGENCY'
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'EMERGENCY'
  createdDate: string
  scheduledDate?: string
  startDate?: string
  completedDate?: string
  dueDate?: string
  status:
    | 'OPEN'
    | 'ASSIGNED'
    | 'IN_PROGRESS'
    | 'ON_HOLD'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'CLOSED'
  assignedTo: string[]
  estimatedHours?: number
  actualHours?: number
  estimatedCost?: number
  actualCost?: number
  workPerformed?: string
  findings?: string
  resolution?: string
  clientFeedback?: string
  rating?: number
  elevator?: {
    id: string
    serialNumber: string
    model: string
    brand: string
    buildingName: string
    client: {
      name: string
    }
  }
  installation?: {
    id: string
    projectNumber: string
    projectName: string
  }
  technicians: {
    id: string
    firstName: string
    lastName: string
    specialization: string[]
  }[]
}

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setWorkOrders([
        {
          id: '1',
          workOrderNumber: 'WO-2025-001',
          title: 'Mantenimiento Preventivo Mensual',
          description:
            'Mantenimiento preventivo programado para ascensor de pasajeros',
          orderType: 'MAINTENANCE',
          priority: 'NORMAL',
          createdDate: '2025-09-25',
          scheduledDate: '2025-09-30',
          startDate: '2025-09-30',
          completedDate: '2025-09-30',
          dueDate: '2025-09-30',
          status: 'COMPLETED',
          assignedTo: ['tech-1', 'tech-2'],
          estimatedHours: 4,
          actualHours: 3.5,
          estimatedCost: 2500,
          actualCost: 2200,
          workPerformed:
            'Lubricación de guías, verificación de frenos, prueba de funcionamiento',
          findings: 'Todo en orden, lubricación realizada correctamente',
          resolution: 'Mantenimiento completado exitosamente',
          clientFeedback: 'Excelente servicio, técnicos muy profesionales',
          rating: 5,
          elevator: {
            id: '1',
            serialNumber: 'ASC-001',
            model: 'Gen2',
            brand: 'Otis',
            buildingName: 'Torre Centro',
            client: {
              name: 'Empresa Constructora ABC',
            },
          },
          technicians: [
            {
              id: 'tech-1',
              firstName: 'Carlos',
              lastName: 'Mendoza',
              specialization: ['Hidráulicos', 'Tracción'],
            },
            {
              id: 'tech-2',
              firstName: 'María',
              lastName: 'García',
              specialization: ['Hidráulicos', 'Residenciales'],
            },
          ],
        },
        {
          id: '2',
          workOrderNumber: 'WO-2025-002',
          title: 'Reparación de Emergencia - Ascensor Atascado',
          description:
            'Ascensor atascado entre pisos, requiere reparación inmediata',
          orderType: 'EMERGENCY',
          priority: 'EMERGENCY',
          createdDate: '2025-09-28',
          scheduledDate: '2025-09-28',
          startDate: '2025-09-28',
          completedDate: '2025-09-28',
          dueDate: '2025-09-28',
          status: 'COMPLETED',
          assignedTo: ['tech-3'],
          estimatedHours: 6,
          actualHours: 5.5,
          estimatedCost: 8000,
          actualCost: 7500,
          workPerformed:
            'Reemplazo de cable de tracción, ajuste de tensión, prueba de funcionamiento',
          findings: 'Cable de tracción desgastado, tensión incorrecta',
          resolution: 'Ascensor operativo, pasajeros evacuados sin lesiones',
          clientFeedback:
            'Respuesta muy rápida, problema resuelto eficientemente',
          rating: 5,
          elevator: {
            id: '2',
            serialNumber: 'ASC-002',
            model: 'MonoSpace',
            brand: 'Schindler',
            buildingName: 'Edificio Norte',
            client: {
              name: 'Juan Pérez',
            },
          },
          technicians: [
            {
              id: 'tech-3',
              firstName: 'Luis',
              lastName: 'Rodríguez',
              specialization: ['Tracción', 'Panorámicos'],
            },
          ],
        },
        {
          id: '3',
          workOrderNumber: 'WO-2025-003',
          title: 'Inspección Técnica Anual',
          description: 'Inspección técnica obligatoria para certificación',
          orderType: 'INSPECTION',
          priority: 'HIGH',
          createdDate: '2025-09-20',
          scheduledDate: '2025-10-05',
          startDate: undefined,
          completedDate: undefined,
          dueDate: '2025-10-05',
          status: 'ASSIGNED',
          assignedTo: ['tech-1'],
          estimatedHours: 8,
          actualHours: undefined,
          estimatedCost: 5000,
          actualCost: undefined,
          workPerformed: undefined,
          findings: undefined,
          resolution: undefined,
          clientFeedback: undefined,
          rating: undefined,
          elevator: {
            id: '3',
            serialNumber: 'ASC-003',
            model: 'KONE 3000',
            brand: 'KONE',
            buildingName: 'Plaza Comercial',
            client: {
              name: 'Centro Comercial XYZ',
            },
          },
          technicians: [
            {
              id: 'tech-1',
              firstName: 'Carlos',
              lastName: 'Mendoza',
              specialization: ['Hidráulicos', 'Tracción'],
            },
          ],
        },
        {
          id: '4',
          workOrderNumber: 'WO-2025-004',
          title: 'Modernización de Ascensor',
          description: 'Modernización completa del sistema de control',
          orderType: 'MODERNIZATION',
          priority: 'NORMAL',
          createdDate: '2025-09-15',
          scheduledDate: '2025-10-15',
          startDate: '2025-10-15',
          completedDate: undefined,
          dueDate: '2025-11-15',
          status: 'IN_PROGRESS',
          assignedTo: ['tech-2', 'tech-3'],
          estimatedHours: 40,
          actualHours: 15,
          estimatedCost: 50000,
          actualCost: 12000,
          workPerformed:
            'Instalación de nuevo sistema de control, cableado, programación',
          findings:
            'Sistema anterior obsoleto, requiere actualización completa',
          resolution: 'En progreso - 40% completado',
          clientFeedback: undefined,
          rating: undefined,
          elevator: {
            id: '1',
            serialNumber: 'ASC-001',
            model: 'Gen2',
            brand: 'Otis',
            buildingName: 'Torre Centro',
            client: {
              name: 'Empresa Constructora ABC',
            },
          },
          technicians: [
            {
              id: 'tech-2',
              firstName: 'María',
              lastName: 'García',
              specialization: ['Hidráulicos', 'Residenciales'],
            },
            {
              id: 'tech-3',
              firstName: 'Luis',
              lastName: 'Rodríguez',
              specialization: ['Tracción', 'Panorámicos'],
            },
          ],
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-gray-100 text-gray-800'
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800'
      case 'ON_HOLD':
        return 'bg-orange-100 text-orange-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'CLOSED':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'Abierta'
      case 'ASSIGNED':
        return 'Asignada'
      case 'IN_PROGRESS':
        return 'En Progreso'
      case 'ON_HOLD':
        return 'En Espera'
      case 'COMPLETED':
        return 'Completada'
      case 'CANCELLED':
        return 'Cancelada'
      case 'CLOSED':
        return 'Cerrada'
      default:
        return 'Desconocido'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'bg-gray-100 text-gray-800'
      case 'NORMAL':
        return 'bg-blue-100 text-blue-800'
      case 'HIGH':
        return 'bg-yellow-100 text-yellow-800'
      case 'URGENT':
        return 'bg-orange-100 text-orange-800'
      case 'EMERGENCY':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'Baja'
      case 'NORMAL':
        return 'Normal'
      case 'HIGH':
        return 'Alta'
      case 'URGENT':
        return 'Urgente'
      case 'EMERGENCY':
        return 'Emergencia'
      default:
        return 'Desconocida'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'MAINTENANCE':
        return 'Mantenimiento'
      case 'REPAIR':
        return 'Reparación'
      case 'INSTALLATION':
        return 'Instalación'
      case 'INSPECTION':
        return 'Inspección'
      case 'MODERNIZATION':
        return 'Modernización'
      case 'EMERGENCY':
        return 'Emergencia'
      default:
        return 'Desconocido'
    }
  }

  const getRatingStars = (rating?: number) => {
    if (!rating) return null
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

  const filteredWorkOrders = workOrders.filter(order => {
    const matchesSearch =
      order.workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.elevator?.serialNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.elevator?.buildingName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.elevator?.client.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter
    const matchesType = typeFilter === 'all' || order.orderType === typeFilter
    const matchesPriority =
      priorityFilter === 'all' || order.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesType && matchesPriority
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
            Órdenes de Trabajo
          </h1>
          <p className="text-muted-foreground">
            Gestión de órdenes de trabajo y asignación de técnicos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Programar Orden
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Orden
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {workOrders.filter(o => o.status === 'COMPLETED').length}
            </div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {workOrders.filter(o => o.status === 'IN_PROGRESS').length}
            </div>
            <p className="text-xs text-muted-foreground">Activas</p>
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
                workOrders
                  .filter(o => o.rating)
                  .reduce((sum, o) => sum + (o.rating || 0), 0) /
                workOrders.filter(o => o.rating).length
              ).toFixed(1) || '0.0'}
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
                  placeholder="Buscar por número de orden, título, ascensor, edificio o cliente..."
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
                <SelectItem value="OPEN">Abierta</SelectItem>
                <SelectItem value="ASSIGNED">Asignada</SelectItem>
                <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                <SelectItem value="ON_HOLD">En Espera</SelectItem>
                <SelectItem value="COMPLETED">Completada</SelectItem>
                <SelectItem value="CANCELLED">Cancelada</SelectItem>
                <SelectItem value="CLOSED">Cerrada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Tipos</SelectItem>
                <SelectItem value="MAINTENANCE">Mantenimiento</SelectItem>
                <SelectItem value="REPAIR">Reparación</SelectItem>
                <SelectItem value="INSTALLATION">Instalación</SelectItem>
                <SelectItem value="INSPECTION">Inspección</SelectItem>
                <SelectItem value="MODERNIZATION">Modernización</SelectItem>
                <SelectItem value="EMERGENCY">Emergencia</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Prioridades</SelectItem>
                <SelectItem value="LOW">Baja</SelectItem>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="HIGH">Alta</SelectItem>
                <SelectItem value="URGENT">Urgente</SelectItem>
                <SelectItem value="EMERGENCY">Emergencia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid gap-4">
        {filteredWorkOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">
                No se encontraron órdenes
              </h3>
              <p className="mb-4 text-center text-muted-foreground">
                {searchTerm ||
                statusFilter !== 'all' ||
                typeFilter !== 'all' ||
                priorityFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza agregando tu primera orden de trabajo'}
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Orden
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredWorkOrders.map(order => (
            <Card key={order.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-lg font-semibold">
                        {order.workOrderNumber}
                      </h3>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                      <Badge className={getPriorityColor(order.priority)}>
                        {getPriorityText(order.priority)}
                      </Badge>
                      <Badge variant="outline">
                        {getTypeText(order.orderType)}
                      </Badge>
                    </div>

                    <h4 className="mb-2 text-xl font-medium">{order.title}</h4>
                    {order.description && (
                      <p className="mb-4 text-muted-foreground">
                        {order.description}
                      </p>
                    )}

                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Ascensor
                        </p>
                        {order.elevator ? (
                          <>
                            <p className="font-medium">
                              {order.elevator.serialNumber}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.elevator.brand} {order.elevator.model}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.elevator.buildingName}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No asignado
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Cliente</p>
                        <p className="font-medium">
                          {order.elevator?.client.name || 'No especificado'}
                        </p>
                        {order.installation && (
                          <p className="text-sm text-muted-foreground">
                            Proyecto: {order.installation.projectName}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Técnicos Asignados
                        </p>
                        <p className="font-medium">
                          {order.technicians.length} técnicos
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {order.technicians.map((tech, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {tech.firstName} {tech.lastName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fechas</p>
                        <p className="font-medium">
                          Creada:{' '}
                          {new Date(order.createdDate).toLocaleDateString()}
                        </p>
                        {order.scheduledDate && (
                          <p className="text-sm text-muted-foreground">
                            Programada:{' '}
                            {new Date(order.scheduledDate).toLocaleDateString()}
                          </p>
                        )}
                        {order.completedDate && (
                          <p className="text-sm text-green-600">
                            Completada:{' '}
                            {new Date(order.completedDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {order.workPerformed && (
                      <div className="mb-4">
                        <p className="mb-1 text-sm font-medium">
                          Trabajo Realizado:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.workPerformed}
                        </p>
                      </div>
                    )}

                    {order.findings && (
                      <div className="mb-4">
                        <p className="mb-1 text-sm font-medium">Hallazgos:</p>
                        <p className="text-sm text-muted-foreground">
                          {order.findings}
                        </p>
                      </div>
                    )}

                    {order.resolution && (
                      <div className="mb-4">
                        <p className="mb-1 text-sm font-medium">Resolución:</p>
                        <p className="text-sm text-muted-foreground">
                          {order.resolution}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-6 text-sm">
                      {order.actualCost && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>${order.actualCost.toLocaleString()}</span>
                        </div>
                      )}
                      {order.actualHours && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{order.actualHours}h trabajadas</span>
                        </div>
                      )}
                      {order.rating && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {getRatingStars(order.rating)}
                            <span className="text-sm font-medium">
                              {order.rating}
                            </span>
                          </div>
                        </div>
                      )}
                      {order.clientFeedback && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            "{order.clientFeedback}"
                          </span>
                        </div>
                      )}
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
      {filteredWorkOrders.length > 0 && (
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredWorkOrders.length} de {workOrders.length}{' '}
              órdenes
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
