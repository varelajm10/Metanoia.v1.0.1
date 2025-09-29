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
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Shield,
  MapPin,
  Calendar,
} from 'lucide-react'

interface Elevator {
  id: string
  serialNumber: string
  model: string
  brand: string
  buildingName: string
  buildingAddress: string
  status:
    | 'OPERATIONAL'
    | 'OUT_OF_SERVICE'
    | 'UNDER_MAINTENANCE'
    | 'UNDER_INSPECTION'
    | 'DECOMMISSIONED'
    | 'EMERGENCY_STOP'
  capacity: number
  floors: number
  speed: number
  lastInspection: string
  nextInspection: string
  client: {
    id: string
    name: string
    company?: string
  }
}

export default function ElevatorsListPage() {
  const [elevators, setElevators] = useState<Elevator[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [brandFilter, setBrandFilter] = useState('all')

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setElevators([
        {
          id: '1',
          serialNumber: 'ASC-001',
          model: 'Gen2',
          brand: 'Otis',
          buildingName: 'Torre Centro',
          buildingAddress: 'Av. Principal 123, Ciudad',
          status: 'OPERATIONAL',
          capacity: 1000,
          floors: 15,
          speed: 1.5,
          lastInspection: '2025-08-15',
          nextInspection: '2025-11-15',
          client: {
            id: '1',
            name: 'Empresa Constructora ABC',
            company: 'ABC Constructora',
          },
        },
        {
          id: '2',
          serialNumber: 'ASC-002',
          model: 'MonoSpace',
          brand: 'Schindler',
          buildingName: 'Edificio Norte',
          buildingAddress: 'Calle Norte 456, Ciudad',
          status: 'UNDER_MAINTENANCE',
          capacity: 800,
          floors: 12,
          speed: 1.2,
          lastInspection: '2025-07-20',
          nextInspection: '2025-10-20',
          client: {
            id: '2',
            name: 'Propietario Individual',
            company: undefined,
          },
        },
        {
          id: '3',
          serialNumber: 'ASC-003',
          model: 'KONE 3000',
          brand: 'KONE',
          buildingName: 'Plaza Comercial',
          buildingAddress: 'Plaza Mayor 789, Ciudad',
          status: 'OUT_OF_SERVICE',
          capacity: 1200,
          floors: 8,
          speed: 1.8,
          lastInspection: '2025-06-10',
          nextInspection: '2025-09-10',
          client: {
            id: '3',
            name: 'Centro Comercial XYZ',
            company: 'XYZ Shopping',
          },
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPERATIONAL':
        return 'bg-green-100 text-green-800'
      case 'UNDER_MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800'
      case 'OUT_OF_SERVICE':
        return 'bg-red-100 text-red-800'
      case 'UNDER_INSPECTION':
        return 'bg-blue-100 text-blue-800'
      case 'DECOMMISSIONED':
        return 'bg-gray-100 text-gray-800'
      case 'EMERGENCY_STOP':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPERATIONAL':
        return 'Operativo'
      case 'UNDER_MAINTENANCE':
        return 'En Mantenimiento'
      case 'OUT_OF_SERVICE':
        return 'Fuera de Servicio'
      case 'UNDER_INSPECTION':
        return 'En Inspección'
      case 'DECOMMISSIONED':
        return 'Desmantelado'
      case 'EMERGENCY_STOP':
        return 'Parada de Emergencia'
      default:
        return 'Desconocido'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPERATIONAL':
        return <CheckCircle className="h-4 w-4" />
      case 'UNDER_MAINTENANCE':
        return <Wrench className="h-4 w-4" />
      case 'OUT_OF_SERVICE':
        return <AlertTriangle className="h-4 w-4" />
      case 'UNDER_INSPECTION':
        return <Shield className="h-4 w-4" />
      default:
        return <Building2 className="h-4 w-4" />
    }
  }

  const filteredElevators = elevators.filter(elevator => {
    const matchesSearch =
      elevator.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      elevator.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      elevator.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      elevator.buildingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      elevator.client.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || elevator.status === statusFilter
    const matchesBrand = brandFilter === 'all' || elevator.brand === brandFilter

    return matchesSearch && matchesStatus && matchesBrand
  })

  const getInspectionStatus = (nextInspection: string) => {
    const inspectionDate = new Date(nextInspection)
    const today = new Date()
    const daysUntil = Math.ceil(
      (inspectionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysUntil < 0)
      return { status: 'overdue', text: 'Vencida', color: 'text-red-600' }
    if (daysUntil <= 30)
      return {
        status: 'upcoming',
        text: `${daysUntil} días`,
        color: 'text-orange-600',
      }
    return {
      status: 'scheduled',
      text: `${daysUntil} días`,
      color: 'text-green-600',
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Ascensores</h1>
          <p className="text-muted-foreground">
            Gestión completa de ascensores y su estado operacional
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Ascensor
        </Button>
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
                  placeholder="Buscar por número de serie, modelo, marca, edificio o cliente..."
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
                <SelectItem value="OPERATIONAL">Operativo</SelectItem>
                <SelectItem value="UNDER_MAINTENANCE">
                  En Mantenimiento
                </SelectItem>
                <SelectItem value="OUT_OF_SERVICE">
                  Fuera de Servicio
                </SelectItem>
                <SelectItem value="UNDER_INSPECTION">En Inspección</SelectItem>
                <SelectItem value="DECOMMISSIONED">Desmantelado</SelectItem>
                <SelectItem value="EMERGENCY_STOP">
                  Parada de Emergencia
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Marcas</SelectItem>
                <SelectItem value="Otis">Otis</SelectItem>
                <SelectItem value="Schindler">Schindler</SelectItem>
                <SelectItem value="KONE">KONE</SelectItem>
                <SelectItem value="ThyssenKrupp">ThyssenKrupp</SelectItem>
                <SelectItem value="Mitsubishi">Mitsubishi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid gap-4">
        {filteredElevators.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">
                No se encontraron ascensores
              </h3>
              <p className="mb-4 text-center text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || brandFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza agregando tu primer ascensor'}
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Ascensor
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredElevators.map(elevator => {
            const inspectionStatus = getInspectionStatus(
              elevator.nextInspection
            )

            return (
              <Card
                key={elevator.id}
                className="transition-shadow hover:shadow-md"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="text-lg font-semibold">
                          {elevator.serialNumber}
                        </h3>
                        <Badge className={getStatusColor(elevator.status)}>
                          {getStatusIcon(elevator.status)}
                          <span className="ml-1">
                            {getStatusText(elevator.status)}
                          </span>
                        </Badge>
                      </div>

                      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Modelo
                          </p>
                          <p className="font-medium">
                            {elevator.brand} {elevator.model}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Ubicación
                          </p>
                          <p className="font-medium">{elevator.buildingName}</p>
                          <p className="text-sm text-muted-foreground">
                            {elevator.buildingAddress}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Especificaciones
                          </p>
                          <p className="font-medium">
                            {elevator.capacity}kg • {elevator.floors} pisos •{' '}
                            {elevator.speed}m/s
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Cliente
                          </p>
                          <p className="font-medium">{elevator.client.name}</p>
                          {elevator.client.company && (
                            <p className="text-sm text-muted-foreground">
                              {elevator.client.company}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Última inspección:{' '}
                            {new Date(
                              elevator.lastInspection
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span className={inspectionStatus.color}>
                            Próxima inspección: {inspectionStatus.text}
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
            )
          })
        )}
      </div>

      {/* Pagination */}
      {filteredElevators.length > 0 && (
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredElevators.length} de {elevators.length}{' '}
              ascensores
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
