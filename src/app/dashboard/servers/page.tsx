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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  Server,
  Plus,
  User,
  Building,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Save,
  X,
  Globe,
  Activity,
  Wrench,
  Wifi,
  Clock,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import ServerDetailDialog from '@/components/servers/ServerDetailDialog'

interface ServerClient {
  id: string
  companyName: string
  contactName: string
  email: string
  phone: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  monthlyFee: number
  serverCount: number
  serviceLevel: string
}

interface ServerInfo {
  id: string
  name: string
  type: string
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'WARNING'
  ipAddress: string
  location: string
  clientName: string
  // Campos adicionales para el formulario completo
  hostname?: string
  operatingSystem?: string
  cpu?: string
  ram?: string
  storage?: string
  bandwidth?: string
  port?: number
  protocol?: string
  sslCertificate?: boolean
  backupEnabled?: boolean
  monitoringEnabled?: boolean
  description?: string
  notes?: string
  installationDate?: string
  lastMaintenance?: string
  nextMaintenance?: string
  cost?: number
  provider?: string
  datacenter?: string
  rack?: string
  powerConsumption?: string
  temperature?: string
  uptime?: string
}

export default function ServersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [servers, setServers] = useState<ServerInfo[]>([])
  const [serversLoading, setServersLoading] = useState(true)
  const [clients, setClients] = useState<ServerClient[]>([])
  const [clientsLoading, setClientsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'servers' | 'clients'>(
    'servers'
  )

  // Estados para el diálogo de detalles
  const [selectedServer, setSelectedServer] = useState<ServerInfo | null>(null)
  const [showServerDetail, setShowServerDetail] = useState(false)

  // Estados para el formulario de servidor
  const [showServerForm, setShowServerForm] = useState(false)
  const [serverFormData, setServerFormData] = useState<Partial<ServerInfo>>({
    name: '',
    type: '',
    status: 'ONLINE',
    ipAddress: '',
    location: '',
    clientName: '',
    hostname: '',
    operatingSystem: '',
    cpu: '',
    ram: '',
    storage: '',
    bandwidth: '',
    port: 80,
    protocol: 'HTTP',
    sslCertificate: false,
    backupEnabled: false,
    monitoringEnabled: true,
    description: '',
    notes: '',
    installationDate: '',
    lastMaintenance: '',
    nextMaintenance: '',
    cost: 0,
    provider: '',
    datacenter: '',
    rack: '',
    powerConsumption: '',
    temperature: '',
    uptime: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados para el formulario de cliente
  const [showClientForm, setShowClientForm] = useState(false)
  const [clientFormData, setClientFormData] = useState<Partial<ServerClient>>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    status: 'ACTIVE',
    monthlyFee: 0,
    serverCount: 0,
    serviceLevel: 'Basic',
  })
  const [isSubmittingClient, setIsSubmittingClient] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchServers()
      fetchClients()
    }
  }, [user])

  const fetchServers = async () => {
    try {
      const response = await fetch('/api/servers')
      if (!response.ok) {
        throw new Error('Error al cargar servidores')
      }
      const data = await response.json()
      setServers(data.servers || [])
    } catch (error) {
      console.error('Error fetching servers:', error)
      // Fallback a datos vacíos en caso de error
      setServers([])
    } finally {
      setServersLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/customers')
      if (!response.ok) {
        throw new Error('Error al cargar clientes')
      }
      const data = await response.json()
      // Convertir customers a ServerClient format
      const serverClients: ServerClient[] = (data.customers || []).map(
        (customer: any) => ({
          id: customer.id,
          companyName: customer.companyName || customer.name,
          contactName: customer.contactName || customer.name,
          email: customer.email,
          phone: customer.phone || '',
          status: customer.status || 'ACTIVE',
          monthlyFee: customer.monthlyFee || 0,
          serverCount: customer.serverCount || 0,
          serviceLevel: customer.serviceLevel || 'Basic',
        })
      )
      setClients(serverClients)
    } catch (error) {
      console.error('Error fetching clients:', error)
      // Fallback a datos vacíos en caso de error
      setClients([])
    } finally {
      setClientsLoading(false)
    }
  }

  const handleSubmitServer = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/servers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: serverFormData.name,
          type: serverFormData.type,
          status: serverFormData.status,
          ipAddress: serverFormData.ipAddress,
          location: serverFormData.location,
          clientName: serverFormData.clientName,
          hostname: serverFormData.hostname,
          operatingSystem: serverFormData.operatingSystem,
          cpu: serverFormData.cpu,
          ram: serverFormData.ram,
          storage: serverFormData.storage,
          bandwidth: serverFormData.bandwidth,
          port: serverFormData.port,
          protocol: serverFormData.protocol,
          sslCertificate: serverFormData.sslCertificate,
          backupEnabled: serverFormData.backupEnabled,
          monitoringEnabled: serverFormData.monitoringEnabled,
          description: serverFormData.description,
          notes: serverFormData.notes,
          installationDate: serverFormData.installationDate,
          lastMaintenance: serverFormData.lastMaintenance,
          nextMaintenance: serverFormData.nextMaintenance,
          cost: serverFormData.cost,
          provider: serverFormData.provider,
          datacenter: serverFormData.datacenter,
          rack: serverFormData.rack,
          powerConsumption: serverFormData.powerConsumption,
          temperature: serverFormData.temperature,
          uptime: serverFormData.uptime,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al crear servidor')
      }

      const newServer = await response.json()

      // Agregar a la lista de servidores
      setServers(prev => [...prev, newServer.server])

      // Limpiar formulario
      setServerFormData({
        name: '',
        type: '',
        status: 'ONLINE',
        ipAddress: '',
        location: '',
        clientName: '',
        hostname: '',
        operatingSystem: '',
        cpu: '',
        ram: '',
        storage: '',
        bandwidth: '',
        port: 80,
        protocol: 'HTTP',
        sslCertificate: false,
        backupEnabled: false,
        monitoringEnabled: true,
        description: '',
        notes: '',
        installationDate: '',
        lastMaintenance: '',
        nextMaintenance: '',
        cost: 0,
        provider: '',
        datacenter: '',
        rack: '',
        powerConsumption: '',
        temperature: '',
        uptime: '',
      })

      setShowServerForm(false)
    } catch (error) {
      console.error('Error creating server:', error)
      alert('Error al crear el servidor. Por favor, inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingClient(true)

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: clientFormData.companyName,
          email: clientFormData.email,
          phone: clientFormData.phone,
          companyName: clientFormData.companyName,
          contactName: clientFormData.contactName,
          status: clientFormData.status,
          monthlyFee: clientFormData.monthlyFee,
          serviceLevel: clientFormData.serviceLevel,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al crear cliente')
      }

      const newClient = await response.json()

      // Convertir a ServerClient format
      const serverClient: ServerClient = {
        id: newClient.customer.id,
        companyName: newClient.customer.companyName || newClient.customer.name,
        contactName: newClient.customer.contactName || newClient.customer.name,
        email: newClient.customer.email,
        phone: newClient.customer.phone || '',
        status: newClient.customer.status || 'ACTIVE',
        monthlyFee: newClient.customer.monthlyFee || 0,
        serverCount: 0,
        serviceLevel: newClient.customer.serviceLevel || 'Basic',
      }

      // Agregar a la lista de clientes
      setClients(prev => [...prev, serverClient])

      // Limpiar formulario
      setClientFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        status: 'ACTIVE',
        monthlyFee: 0,
        serverCount: 0,
        serviceLevel: 'Basic',
      })

      setShowClientForm(false)
    } catch (error) {
      console.error('Error creating client:', error)
      alert('Error al crear el cliente. Por favor, inténtalo de nuevo.')
    } finally {
      setIsSubmittingClient(false)
    }
  }

  const handleUpdateServer = async (serverData: Partial<ServerInfo>) => {
    if (!selectedServer) return

    try {
      const response = await fetch(`/api/servers/${selectedServer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serverData),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar servidor')
      }

      const updatedServer = await response.json()

      // Actualizar en la lista
      setServers(prev =>
        prev.map(server =>
          server.id === selectedServer.id
            ? { ...server, ...updatedServer.server }
            : server
        )
      )

      // Actualizar servidor seleccionado
      setSelectedServer({ ...selectedServer, ...updatedServer.server })
    } catch (error) {
      console.error('Error updating server:', error)
      alert('Error al actualizar el servidor. Por favor, inténtalo de nuevo.')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'OFFLINE':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'WARNING':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case 'MAINTENANCE':
        return <Clock className="h-5 w-5 text-blue-600" />
      default:
        return <Server className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return 'bg-green-100 text-green-800'
      case 'OFFLINE':
        return 'bg-red-100 text-red-800'
      case 'WARNING':
        return 'bg-orange-100 text-orange-800'
      case 'MAINTENANCE':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return 'En Línea'
      case 'OFFLINE':
        return 'Desconectado'
      case 'WARNING':
        return 'Advertencia'
      case 'MAINTENANCE':
        return 'Mantenimiento'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
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
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
              <div className="flex items-center gap-2">
                <Server className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Gestión de Servidores</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/servers/users">
                <Button variant="outline" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  Gestionar Usuarios
                </Button>
              </Link>
              <Link href="/dashboard/servers/geographic">
                <Button variant="outline" size="sm">
                  <Globe className="mr-2 h-4 w-4" />
                  Dashboard Geográfico
                </Button>
              </Link>
              <Link href="/dashboard/servers/monitoring">
                <Button variant="outline" size="sm">
                  <Activity className="mr-2 h-4 w-4" />
                  Monitoreo
                </Button>
              </Link>
              <Link href="/dashboard/servers/maintenance">
                <Button variant="outline" size="sm">
                  <Wrench className="mr-2 h-4 w-4" />
                  Mantenimientos
                </Button>
              </Link>
              <Link href="/dashboard/servers/network">
                <Button variant="outline" size="sm">
                  <Wifi className="mr-2 h-4 w-4" />
                  Red
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex w-fit space-x-1 rounded-lg bg-muted p-1">
            <button
              onClick={() => setSelectedTab('servers')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                selectedTab === 'servers'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Server className="mr-2 inline h-4 w-4" />
              Servidores
            </button>
            <button
              onClick={() => setSelectedTab('clients')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                selectedTab === 'clients'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Building className="mr-2 inline h-4 w-4" />
              Clientes
            </button>
          </div>
        </div>

        {/* Servers Tab */}
        {selectedTab === 'servers' && (
          <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Servidores</h2>
                <p className="text-muted-foreground">
                  Gestiona todos los servidores de tus clientes
                </p>
              </div>
              <Button onClick={() => setShowServerForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Servidor
              </Button>
            </div>

            {/* Servers List */}
            {serversLoading ? (
              <div className="py-8 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="mt-2 text-muted-foreground">
                  Cargando servidores...
                </p>
              </div>
            ) : servers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Server className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">
                    No hay servidores
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Comienza agregando tu primer servidor
                  </p>
                  <Button onClick={() => setShowServerForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Servidor
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {servers.map(server => (
                  <Card
                    key={server.id}
                    className="transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="rounded-lg bg-blue-50 p-3">
                            {getStatusIcon(server.status)}
                          </div>
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <h3 className="text-lg font-semibold">
                                {server.name}
                              </h3>
                              <Badge className={getStatusColor(server.status)}>
                                {getStatusText(server.status)}
                              </Badge>
                            </div>
                            <p className="mb-2 text-sm text-muted-foreground">
                              {server.type} • {server.ipAddress} •{' '}
                              {server.location}
                            </p>
                            <div className="mt-4 flex items-center justify-between border-t pt-4">
                              <div className="text-sm text-muted-foreground">
                                Cliente: {server.clientName}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedServer(server)
                                  setShowServerDetail(true)
                                }}
                              >
                                Ver Detalles
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Clients Tab */}
        {selectedTab === 'clients' && (
          <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Clientes</h2>
                <p className="text-muted-foreground">
                  Gestiona todos los clientes que utilizan tus servidores
                </p>
              </div>
              <Button onClick={() => setShowClientForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Cliente
              </Button>
            </div>

            {/* Clients List */}
            {clientsLoading ? (
              <div className="py-8 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="mt-2 text-muted-foreground">
                  Cargando clientes...
                </p>
              </div>
            ) : clients.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Building className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">
                    No hay clientes
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Comienza agregando tu primer cliente
                  </p>
                  <Button onClick={() => setShowClientForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Cliente
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {clients.map(client => (
                  <Card
                    key={client.id}
                    className="transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="rounded-lg bg-green-50 p-3">
                            <Building className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <h3 className="text-lg font-semibold">
                                {client.companyName}
                              </h3>
                              <Badge
                                className={
                                  client.status === 'ACTIVE'
                                    ? 'bg-green-100 text-green-800'
                                    : client.status === 'INACTIVE'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-orange-100 text-orange-800'
                                }
                              >
                                {client.status === 'ACTIVE'
                                  ? 'Activo'
                                  : client.status === 'INACTIVE'
                                    ? 'Inactivo'
                                    : 'Suspendido'}
                              </Badge>
                            </div>
                            <p className="mb-2 text-sm text-muted-foreground">
                              {client.contactName} • {client.email} •{' '}
                              {client.phone}
                            </p>
                            <div className="mt-4 flex items-center justify-between border-t pt-4">
                              <div className="text-sm text-muted-foreground">
                                Servicio: {client.serviceLevel} • $
                                {client.monthlyFee}/mes
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Server Form Dialog */}
        <Dialog open={showServerForm} onOpenChange={setShowServerForm}>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Servidor</DialogTitle>
              <DialogDescription>
                Completa la información del servidor que deseas agregar
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmitServer} className="space-y-4">
              {/* Información Básica */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre del Servidor *</Label>
                  <Input
                    id="name"
                    value={serverFormData.name || ''}
                    onChange={e =>
                      setServerFormData({
                        ...serverFormData,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo *</Label>
                  <Input
                    id="type"
                    value={serverFormData.type || ''}
                    onChange={e =>
                      setServerFormData({
                        ...serverFormData,
                        type: e.target.value,
                      })
                    }
                    placeholder="Apache, Nginx, MySQL, etc."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={serverFormData.status || 'ONLINE'}
                    onValueChange={(value: any) =>
                      setServerFormData({ ...serverFormData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONLINE">En Línea</SelectItem>
                      <SelectItem value="OFFLINE">Desconectado</SelectItem>
                      <SelectItem value="WARNING">Advertencia</SelectItem>
                      <SelectItem value="MAINTENANCE">Mantenimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ipAddress">Dirección IP *</Label>
                  <Input
                    id="ipAddress"
                    value={serverFormData.ipAddress || ''}
                    onChange={e =>
                      setServerFormData({
                        ...serverFormData,
                        ipAddress: e.target.value,
                      })
                    }
                    placeholder="192.168.1.100"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Ubicación *</Label>
                  <Input
                    id="location"
                    value={serverFormData.location || ''}
                    onChange={e =>
                      setServerFormData({
                        ...serverFormData,
                        location: e.target.value,
                      })
                    }
                    placeholder="Datacenter A"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="clientName">Cliente *</Label>
                  <Input
                    id="clientName"
                    value={serverFormData.clientName || ''}
                    onChange={e =>
                      setServerFormData({
                        ...serverFormData,
                        clientName: e.target.value,
                      })
                    }
                    placeholder="Empresa ABC"
                    required
                  />
                </div>
              </div>

              {/* Información Técnica */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hostname">Hostname</Label>
                  <Input
                    id="hostname"
                    value={serverFormData.hostname || ''}
                    onChange={e =>
                      setServerFormData({
                        ...serverFormData,
                        hostname: e.target.value,
                      })
                    }
                    placeholder="server01.example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="operatingSystem">Sistema Operativo</Label>
                  <Input
                    id="operatingSystem"
                    value={serverFormData.operatingSystem || ''}
                    onChange={e =>
                      setServerFormData({
                        ...serverFormData,
                        operatingSystem: e.target.value,
                      })
                    }
                    placeholder="Ubuntu 20.04"
                  />
                </div>
                <div>
                  <Label htmlFor="cpu">Procesador</Label>
                  <Input
                    id="cpu"
                    value={serverFormData.cpu || ''}
                    onChange={e =>
                      setServerFormData({
                        ...serverFormData,
                        cpu: e.target.value,
                      })
                    }
                    placeholder="Intel Xeon E5-2620"
                  />
                </div>
                <div>
                  <Label htmlFor="ram">Memoria RAM</Label>
                  <Input
                    id="ram"
                    value={serverFormData.ram || ''}
                    onChange={e =>
                      setServerFormData({
                        ...serverFormData,
                        ram: e.target.value,
                      })
                    }
                    placeholder="32GB DDR4"
                  />
                </div>
                <div>
                  <Label htmlFor="storage">Almacenamiento</Label>
                  <Input
                    id="storage"
                    value={serverFormData.storage || ''}
                    onChange={e =>
                      setServerFormData({
                        ...serverFormData,
                        storage: e.target.value,
                      })
                    }
                    placeholder="1TB SSD"
                  />
                </div>
                <div>
                  <Label htmlFor="bandwidth">Ancho de Banda</Label>
                  <Input
                    id="bandwidth"
                    value={serverFormData.bandwidth || ''}
                    onChange={e =>
                      setServerFormData({
                        ...serverFormData,
                        bandwidth: e.target.value,
                      })
                    }
                    placeholder="1Gbps"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={serverFormData.description || ''}
                  onChange={e =>
                    setServerFormData({
                      ...serverFormData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Descripción del servidor y su propósito..."
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowServerForm(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Servidor
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Client Form Dialog */}
        <Dialog open={showClientForm} onOpenChange={setShowClientForm}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
              <DialogDescription>
                Completa la información del cliente que deseas agregar
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmitClient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Nombre de la Empresa *</Label>
                  <Input
                    id="companyName"
                    value={clientFormData.companyName || ''}
                    onChange={e =>
                      setClientFormData({
                        ...clientFormData,
                        companyName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactName">Nombre del Contacto *</Label>
                  <Input
                    id="contactName"
                    value={clientFormData.contactName || ''}
                    onChange={e =>
                      setClientFormData({
                        ...clientFormData,
                        contactName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={clientFormData.email || ''}
                    onChange={e =>
                      setClientFormData({
                        ...clientFormData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={clientFormData.phone || ''}
                    onChange={e =>
                      setClientFormData({
                        ...clientFormData,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyFee">Tarifa Mensual</Label>
                  <Input
                    id="monthlyFee"
                    type="number"
                    value={clientFormData.monthlyFee || ''}
                    onChange={e =>
                      setClientFormData({
                        ...clientFormData,
                        monthlyFee: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="serviceLevel">Nivel de Servicio</Label>
                  <Select
                    value={clientFormData.serviceLevel || 'Basic'}
                    onValueChange={(value: string) =>
                      setClientFormData({
                        ...clientFormData,
                        serviceLevel: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Básico</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Enterprise">Empresarial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowClientForm(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmittingClient}>
                  {isSubmittingClient ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cliente
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Server Detail Dialog */}
        {selectedServer && (
          <ServerDetailDialog
            server={selectedServer}
            isOpen={showServerDetail}
            onClose={() => {
              setShowServerDetail(false)
              setSelectedServer(null)
            }}
            onSave={handleUpdateServer}
          />
        )}
      </main>
    </div>
  )
}
