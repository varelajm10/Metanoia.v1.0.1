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
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
} from 'lucide-react'

interface Client {
  id: string
  name: string
  company?: string
  email: string
  phone?: string
  address: string
  city: string
  state: string
  clientType:
    | 'INDIVIDUAL'
    | 'COMPANY'
    | 'PROPERTY_MANAGER'
    | 'CONSTRUCTOR'
    | 'ARCHITECT'
    | 'GOVERNMENT'
  industry?: string
  status: 'ACTIVE' | 'INACTIVE' | 'PROSPECTIVE' | 'SUSPENDED'
  createdAt: string
  elevatorsCount: number
  installationsCount: number
  contractsCount: number
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setClients([
        {
          id: '1',
          name: 'Empresa Constructora ABC',
          company: 'ABC Constructora S.A.',
          email: 'contacto@abcconstructora.com',
          phone: '+52 55 1234-5678',
          address: 'Av. Reforma 123, Col. Centro',
          city: 'Ciudad de México',
          state: 'CDMX',
          clientType: 'CONSTRUCTOR',
          industry: 'Construcción',
          status: 'ACTIVE',
          createdAt: '2025-01-15',
          elevatorsCount: 12,
          installationsCount: 3,
          contractsCount: 2,
        },
        {
          id: '2',
          name: 'Juan Pérez',
          email: 'juan.perez@email.com',
          phone: '+52 55 9876-5432',
          address: 'Calle Privada 456, Col. Residencial',
          city: 'Guadalajara',
          state: 'Jalisco',
          clientType: 'INDIVIDUAL',
          industry: 'Residencial',
          status: 'ACTIVE',
          createdAt: '2025-03-20',
          elevatorsCount: 1,
          installationsCount: 1,
          contractsCount: 1,
        },
        {
          id: '3',
          name: 'Centro Comercial XYZ',
          company: 'XYZ Shopping Center',
          email: 'admin@xyzshopping.com',
          phone: '+52 55 5555-1234',
          address: 'Plaza Mayor 789, Zona Comercial',
          city: 'Monterrey',
          state: 'Nuevo León',
          clientType: 'COMPANY',
          industry: 'Comercial',
          status: 'ACTIVE',
          createdAt: '2025-02-10',
          elevatorsCount: 8,
          installationsCount: 2,
          contractsCount: 1,
        },
        {
          id: '4',
          name: 'Gobierno Municipal',
          email: 'obras@municipio.gob.mx',
          phone: '+52 55 1111-2222',
          address: 'Palacio Municipal, Centro Histórico',
          city: 'Puebla',
          state: 'Puebla',
          clientType: 'GOVERNMENT',
          industry: 'Gobierno',
          status: 'PROSPECTIVE',
          createdAt: '2025-09-01',
          elevatorsCount: 0,
          installationsCount: 0,
          contractsCount: 0,
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
      case 'PROSPECTIVE':
        return 'bg-blue-100 text-blue-800'
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800'
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
      case 'PROSPECTIVE':
        return 'Prospecto'
      case 'SUSPENDED':
        return 'Suspendido'
      default:
        return 'Desconocido'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'INDIVIDUAL':
        return 'Individual'
      case 'COMPANY':
        return 'Empresa'
      case 'PROPERTY_MANAGER':
        return 'Administrador'
      case 'CONSTRUCTOR':
        return 'Constructor'
      case 'ARCHITECT':
        return 'Arquitecto'
      case 'GOVERNMENT':
        return 'Gobierno'
      default:
        return 'Desconocido'
    }
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.company &&
        client.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.city.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || client.status === statusFilter
    const matchesType = typeFilter === 'all' || client.clientType === typeFilter

    return matchesSearch && matchesStatus && matchesType
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
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gestión de clientes y propietarios de ascensores
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {clients.filter(c => c.status === 'ACTIVE').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (clients.filter(c => c.status === 'ACTIVE').length /
                  clients.length) *
                  100
              )}
              % del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Con Ascensores
            </CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {clients.filter(c => c.elevatorsCount > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (clients.filter(c => c.elevatorsCount > 0).length /
                  clients.length) *
                  100
              )}
              % del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Contratos</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {clients.filter(c => c.contractsCount > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (clients.filter(c => c.contractsCount > 0).length /
                  clients.length) *
                  100
              )}
              % del total
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
                  placeholder="Buscar por nombre, empresa, email o ciudad..."
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
                <SelectItem value="INACTIVE">Inactivo</SelectItem>
                <SelectItem value="PROSPECTIVE">Prospecto</SelectItem>
                <SelectItem value="SUSPENDED">Suspendido</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Tipos</SelectItem>
                <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                <SelectItem value="COMPANY">Empresa</SelectItem>
                <SelectItem value="PROPERTY_MANAGER">Administrador</SelectItem>
                <SelectItem value="CONSTRUCTOR">Constructor</SelectItem>
                <SelectItem value="ARCHITECT">Arquitecto</SelectItem>
                <SelectItem value="GOVERNMENT">Gobierno</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid gap-4">
        {filteredClients.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">
                No se encontraron clientes
              </h3>
              <p className="mb-4 text-center text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza agregando tu primer cliente'}
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Cliente
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredClients.map(client => (
            <Card key={client.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{client.name}</h3>
                      <Badge className={getStatusColor(client.status)}>
                        {getStatusText(client.status)}
                      </Badge>
                      <Badge variant="outline">
                        {getTypeText(client.clientType)}
                      </Badge>
                    </div>

                    {client.company && (
                      <p className="mb-3 text-sm text-muted-foreground">
                        {client.company}
                      </p>
                    )}

                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{client.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {client.city}, {client.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Cliente desde{' '}
                          {new Date(client.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{client.elevatorsCount} ascensores</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span>{client.installationsCount} instalaciones</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{client.contractsCount} contratos</span>
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
      {filteredClients.length > 0 && (
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredClients.length} de {clients.length} clientes
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
