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
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'

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

  useEffect(() => {
    if (user) {
      fetchServers()
      fetchClients()
    }
  }, [user])

  const fetchServers = async () => {
    try {
      // Mock data for servers
      const mockServers: ServerInfo[] = [
        {
          id: '1',
          name: 'Web Server 01',
          type: 'Apache/Nginx',
          status: 'ONLINE',
          ipAddress: '192.168.1.100',
          location: 'Datacenter A',
          clientName: 'Empresa ABC',
        },
        {
          id: '2',
          name: 'Database Server',
          type: 'MySQL 8.0',
          status: 'WARNING',
          ipAddress: '192.168.1.101',
          location: 'Datacenter B',
          clientName: 'Tech Solutions',
        },
      ]
      setServers(mockServers)
    } catch (error) {
      console.error('Error fetching servers:', error)
    } finally {
      setServersLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      // Mock data for clients
      const mockClients: ServerClient[] = [
        {
          id: 'client1',
          companyName: 'Empresa ABC S.A.S',
          contactName: 'Juan Pérez',
          email: 'juan.perez@empresaabc.com',
          phone: '+57 300 123 4567',
          status: 'ACTIVE',
          monthlyFee: 250000,
          serverCount: 2,
          serviceLevel: 'Premium',
        },
      ]
      setClients(mockClients)
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setClientsLoading(false)
    }
  }

  const handleInputChange = (field: keyof ServerInfo, value: any) => {
    setServerFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmitServer = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simular envío de datos
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Crear nuevo servidor con ID único
      const newServer: ServerInfo = {
        id: Date.now().toString(),
        ...serverFormData,
        name: serverFormData.name || '',
        type: serverFormData.type || '',
        status: serverFormData.status || 'ONLINE',
        ipAddress: serverFormData.ipAddress || '',
        location: serverFormData.location || '',
        clientName: serverFormData.clientName || '',
      } as ServerInfo

      // Agregar a la lista de servidores
      setServers(prev => [...prev, newServer])

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

      // Cerrar modal
      setShowServerForm(false)

      console.log('Servidor agregado:', newServer)
    } catch (error) {
      console.error('Error al agregar servidor:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
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

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      ONLINE: 'bg-green-100 text-green-800',
      OFFLINE: 'bg-red-100 text-red-800',
      MAINTENANCE: 'bg-yellow-100 text-yellow-800',
      WARNING: 'bg-orange-100 text-orange-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'OFFLINE':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      default:
        return <Server className="h-4 w-4 text-gray-600" />
    }
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
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-3xl font-bold text-transparent">
                Gestión de Servidores
              </h1>
              <p className="text-muted-foreground">
                Administra servidores y clientes de infraestructura
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" asChild>
              <Link href="/dashboard/servers/users">
                <User className="mr-2 h-4 w-4" />
                Gestionar Usuarios
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/servers/geographic">
                <Globe className="mr-2 h-4 w-4" />
                Dashboard Geográfico
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/servers/monitoring">
                <Activity className="mr-2 h-4 w-4" />
                Monitoreo
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/servers/maintenance">
                <Wrench className="mr-2 h-4 w-4" />
                Mantenimientos
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/servers/network">
                <Wifi className="mr-2 h-4 w-4" />
                Red
              </Link>
            </Button>
            {selectedTab === 'servers' ? (
              <Dialog open={showServerForm} onOpenChange={setShowServerForm}>
                <DialogTrigger asChild>
                  <Button className="btn-primary-gradient">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Servidor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <Server className="mr-2 h-5 w-5" />
                      Agregar Nuevo Servidor
                    </DialogTitle>
                    <DialogDescription>
                      Complete todos los campos para registrar un nuevo servidor
                      en el sistema
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmitServer} className="space-y-6">
                    {/* Información Básica */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Información Básica
                      </h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre del Servidor *</Label>
                          <Input
                            id="name"
                            value={serverFormData.name}
                            onChange={e =>
                              handleInputChange('name', e.target.value)
                            }
                            placeholder="ej: Web Server 01"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hostname">Hostname</Label>
                          <Input
                            id="hostname"
                            value={serverFormData.hostname}
                            onChange={e =>
                              handleInputChange('hostname', e.target.value)
                            }
                            placeholder="ej: web01.empresa.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type">Tipo de Servidor *</Label>
                          <Select
                            value={serverFormData.type}
                            onValueChange={value =>
                              handleInputChange('type', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Web Server">
                                Web Server
                              </SelectItem>
                              <SelectItem value="Database Server">
                                Database Server
                              </SelectItem>
                              <SelectItem value="Application Server">
                                Application Server
                              </SelectItem>
                              <SelectItem value="File Server">
                                File Server
                              </SelectItem>
                              <SelectItem value="Mail Server">
                                Mail Server
                              </SelectItem>
                              <SelectItem value="DNS Server">
                                DNS Server
                              </SelectItem>
                              <SelectItem value="Proxy Server">
                                Proxy Server
                              </SelectItem>
                              <SelectItem value="Load Balancer">
                                Load Balancer
                              </SelectItem>
                              <SelectItem value="Monitoring Server">
                                Monitoring Server
                              </SelectItem>
                              <SelectItem value="Backup Server">
                                Backup Server
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">Estado *</Label>
                          <Select
                            value={serverFormData.status}
                            onValueChange={value =>
                              handleInputChange('status', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ONLINE">En Línea</SelectItem>
                              <SelectItem value="OFFLINE">
                                Fuera de Línea
                              </SelectItem>
                              <SelectItem value="MAINTENANCE">
                                Mantenimiento
                              </SelectItem>
                              <SelectItem value="WARNING">
                                Advertencia
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Información de Red */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Información de Red
                      </h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="ipAddress">Dirección IP *</Label>
                          <Input
                            id="ipAddress"
                            value={serverFormData.ipAddress}
                            onChange={e =>
                              handleInputChange('ipAddress', e.target.value)
                            }
                            placeholder="ej: 192.168.1.100"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="port">Puerto</Label>
                          <Input
                            id="port"
                            type="number"
                            value={serverFormData.port}
                            onChange={e =>
                              handleInputChange(
                                'port',
                                parseInt(e.target.value)
                              )
                            }
                            placeholder="80"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="protocol">Protocolo</Label>
                          <Select
                            value={serverFormData.protocol}
                            onValueChange={value =>
                              handleInputChange('protocol', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar protocolo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="HTTP">HTTP</SelectItem>
                              <SelectItem value="HTTPS">HTTPS</SelectItem>
                              <SelectItem value="FTP">FTP</SelectItem>
                              <SelectItem value="SSH">SSH</SelectItem>
                              <SelectItem value="SMTP">SMTP</SelectItem>
                              <SelectItem value="POP3">POP3</SelectItem>
                              <SelectItem value="IMAP">IMAP</SelectItem>
                              <SelectItem value="DNS">DNS</SelectItem>
                              <SelectItem value="LDAP">LDAP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bandwidth">Ancho de Banda</Label>
                          <Input
                            id="bandwidth"
                            value={serverFormData.bandwidth}
                            onChange={e =>
                              handleInputChange('bandwidth', e.target.value)
                            }
                            placeholder="ej: 100 Mbps"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Especificaciones Técnicas */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Especificaciones Técnicas
                      </h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="operatingSystem">
                            Sistema Operativo
                          </Label>
                          <Select
                            value={serverFormData.operatingSystem}
                            onValueChange={value =>
                              handleInputChange('operatingSystem', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar SO" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Ubuntu 22.04 LTS">
                                Ubuntu 22.04 LTS
                              </SelectItem>
                              <SelectItem value="CentOS 8">CentOS 8</SelectItem>
                              <SelectItem value="Red Hat Enterprise Linux 8">
                                Red Hat Enterprise Linux 8
                              </SelectItem>
                              <SelectItem value="Windows Server 2022">
                                Windows Server 2022
                              </SelectItem>
                              <SelectItem value="Windows Server 2019">
                                Windows Server 2019
                              </SelectItem>
                              <SelectItem value="Debian 11">
                                Debian 11
                              </SelectItem>
                              <SelectItem value="FreeBSD 13">
                                FreeBSD 13
                              </SelectItem>
                              <SelectItem value="OpenSUSE Leap 15">
                                OpenSUSE Leap 15
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cpu">Procesador</Label>
                          <Input
                            id="cpu"
                            value={serverFormData.cpu}
                            onChange={e =>
                              handleInputChange('cpu', e.target.value)
                            }
                            placeholder="ej: Intel Xeon E5-2680 v4"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ram">Memoria RAM</Label>
                          <Input
                            id="ram"
                            value={serverFormData.ram}
                            onChange={e =>
                              handleInputChange('ram', e.target.value)
                            }
                            placeholder="ej: 32 GB DDR4"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="storage">Almacenamiento</Label>
                          <Input
                            id="storage"
                            value={serverFormData.storage}
                            onChange={e =>
                              handleInputChange('storage', e.target.value)
                            }
                            placeholder="ej: 1 TB SSD"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Información de Ubicación */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Información de Ubicación
                      </h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="location">Ubicación *</Label>
                          <Input
                            id="location"
                            value={serverFormData.location}
                            onChange={e =>
                              handleInputChange('location', e.target.value)
                            }
                            placeholder="ej: Datacenter A"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="datacenter">Centro de Datos</Label>
                          <Input
                            id="datacenter"
                            value={serverFormData.datacenter}
                            onChange={e =>
                              handleInputChange('datacenter', e.target.value)
                            }
                            placeholder="ej: Equinix Bogotá"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rack">Rack</Label>
                          <Input
                            id="rack"
                            value={serverFormData.rack}
                            onChange={e =>
                              handleInputChange('rack', e.target.value)
                            }
                            placeholder="ej: Rack 15, U 20-25"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="provider">Proveedor</Label>
                          <Input
                            id="provider"
                            value={serverFormData.provider}
                            onChange={e =>
                              handleInputChange('provider', e.target.value)
                            }
                            placeholder="ej: AWS, Azure, Google Cloud"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Información del Cliente */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Información del Cliente
                      </h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="clientName">Cliente *</Label>
                          <Input
                            id="clientName"
                            value={serverFormData.clientName}
                            onChange={e =>
                              handleInputChange('clientName', e.target.value)
                            }
                            placeholder="ej: Empresa ABC S.A.S"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cost">Costo Mensual</Label>
                          <Input
                            id="cost"
                            type="number"
                            value={serverFormData.cost}
                            onChange={e =>
                              handleInputChange(
                                'cost',
                                parseFloat(e.target.value)
                              )
                            }
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Configuraciones */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Configuraciones</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="sslCertificate"
                            checked={serverFormData.sslCertificate}
                            onChange={e =>
                              handleInputChange(
                                'sslCertificate',
                                e.target.checked
                              )
                            }
                            className="rounded border-gray-300"
                            aria-label="Certificado SSL incluido"
                          />
                          <Label htmlFor="sslCertificate">
                            Certificado SSL
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="backupEnabled"
                            checked={serverFormData.backupEnabled}
                            onChange={e =>
                              handleInputChange(
                                'backupEnabled',
                                e.target.checked
                              )
                            }
                            className="rounded border-gray-300"
                            aria-label="Backup habilitado"
                          />
                          <Label htmlFor="backupEnabled">
                            Backup Habilitado
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="monitoringEnabled"
                            checked={serverFormData.monitoringEnabled}
                            onChange={e =>
                              handleInputChange(
                                'monitoringEnabled',
                                e.target.checked
                              )
                            }
                            className="rounded border-gray-300"
                            aria-label="Monitoreo habilitado"
                          />
                          <Label htmlFor="monitoringEnabled">
                            Monitoreo Habilitado
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Fechas */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Fechas Importantes
                      </h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="installationDate">
                            Fecha de Instalación
                          </Label>
                          <Input
                            id="installationDate"
                            type="date"
                            value={serverFormData.installationDate}
                            onChange={e =>
                              handleInputChange(
                                'installationDate',
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastMaintenance">
                            Último Mantenimiento
                          </Label>
                          <Input
                            id="lastMaintenance"
                            type="date"
                            value={serverFormData.lastMaintenance}
                            onChange={e =>
                              handleInputChange(
                                'lastMaintenance',
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nextMaintenance">
                            Próximo Mantenimiento
                          </Label>
                          <Input
                            id="nextMaintenance"
                            type="date"
                            value={serverFormData.nextMaintenance}
                            onChange={e =>
                              handleInputChange(
                                'nextMaintenance',
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Descripción y Notas */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Descripción y Notas
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="description">Descripción</Label>
                          <Textarea
                            id="description"
                            value={serverFormData.description}
                            onChange={e =>
                              handleInputChange('description', e.target.value)
                            }
                            placeholder="Descripción del servidor y su propósito..."
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notes">Notas Adicionales</Label>
                          <Textarea
                            id="notes"
                            value={serverFormData.notes}
                            onChange={e =>
                              handleInputChange('notes', e.target.value)
                            }
                            placeholder="Notas importantes, configuraciones especiales, etc..."
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>

                    <DialogFooter className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary-gradient"
                      >
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
            ) : (
              <Button className="btn-primary-gradient">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Cliente
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 rounded-lg bg-muted p-1">
            <button
              onClick={() => setSelectedTab('servers')}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                selectedTab === 'servers'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Server className="mr-2 inline-block h-4 w-4" />
              Servidores
            </button>
            <button
              onClick={() => setSelectedTab('clients')}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                selectedTab === 'clients'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User className="mr-2 inline-block h-4 w-4" />
              Clientes
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {selectedTab === 'servers' ? (
            <>
              <Card className="card-enhanced hover-lift animate-fade-in-up">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Server className="h-4 w-4 text-primary" />
                    </div>
                    Total Servidores
                  </CardTitle>
                  <CardContent className="pt-0">
                    <div className="text-3xl font-bold text-primary">
                      {serversLoading ? '...' : servers.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Servidores activos
                    </p>
                  </CardContent>
                </CardHeader>
              </Card>
              <Card
                className="card-enhanced hover-lift animate-fade-in-up"
                style={{ animationDelay: '0.1s' }}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                    En Línea
                  </CardTitle>
                  <CardContent className="pt-0">
                    <div className="text-3xl font-bold text-success">
                      {serversLoading
                        ? '...'
                        : servers.filter(s => s.status === 'ONLINE').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Funcionando correctamente
                    </p>
                  </CardContent>
                </CardHeader>
              </Card>
              <Card
                className="card-enhanced hover-lift animate-fade-in-up"
                style={{ animationDelay: '0.2s' }}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    </div>
                    Advertencias
                  </CardTitle>
                  <CardContent className="pt-0">
                    <div className="text-3xl font-bold text-warning">
                      {serversLoading
                        ? '...'
                        : servers.filter(s => s.status === 'WARNING').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Requieren atención
                    </p>
                  </CardContent>
                </CardHeader>
              </Card>
              <Card
                className="card-enhanced hover-lift animate-fade-in-up"
                style={{ animationDelay: '0.3s' }}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
                      <XCircle className="h-4 w-4 text-destructive" />
                    </div>
                    Desconectados
                  </CardTitle>
                  <CardContent className="pt-0">
                    <div className="text-3xl font-bold text-destructive">
                      {serversLoading
                        ? '...'
                        : servers.filter(s => s.status === 'OFFLINE').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Sin conexión
                    </p>
                  </CardContent>
                </CardHeader>
              </Card>
            </>
          ) : (
            <>
              <Card className="card-enhanced hover-lift animate-fade-in-up">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    Total Clientes
                  </CardTitle>
                  <CardContent className="pt-0">
                    <div className="text-3xl font-bold text-primary">
                      {clientsLoading ? '...' : clients.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Clientes registrados
                    </p>
                  </CardContent>
                </CardHeader>
              </Card>
              <Card
                className="card-enhanced hover-lift animate-fade-in-up"
                style={{ animationDelay: '0.1s' }}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                    Clientes Activos
                  </CardTitle>
                  <CardContent className="pt-0">
                    <div className="text-3xl font-bold text-success">
                      {clientsLoading
                        ? '...'
                        : clients.filter(c => c.status === 'ACTIVE').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Con servicios activos
                    </p>
                  </CardContent>
                </CardHeader>
              </Card>
              <Card
                className="card-enhanced hover-lift animate-fade-in-up"
                style={{ animationDelay: '0.2s' }}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                    <div className="gradient-primary mr-3 flex h-8 w-8 items-center justify-center rounded-lg">
                      <Building className="h-4 w-4 text-primary-foreground" />
                    </div>
                    Ingresos Mensuales
                  </CardTitle>
                  <CardContent className="pt-0">
                    <div className="bg-gradient-to-r from-primary to-accent bg-clip-text text-3xl font-bold text-transparent">
                      $
                      {clientsLoading
                        ? '...'
                        : clients
                            .reduce((sum, c) => sum + (c.monthlyFee || 0), 0)
                            .toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Facturación mensual
                    </p>
                  </CardContent>
                </CardHeader>
              </Card>
              <Card
                className="card-enhanced hover-lift animate-fade-in-up"
                style={{ animationDelay: '0.3s' }}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    </div>
                    Contratos por Vencer
                  </CardTitle>
                  <CardContent className="pt-0">
                    <div className="text-3xl font-bold text-warning">0</div>
                    <p className="text-xs text-muted-foreground">
                      Próximos 30 días
                    </p>
                  </CardContent>
                </CardHeader>
              </Card>
            </>
          )}
        </div>

        {/* Content based on selected tab */}
        {selectedTab === 'servers' ? (
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="mr-2 h-5 w-5" />
                Lista de Servidores
              </CardTitle>
              <CardDescription>
                Monitorea el estado y rendimiento de todos los servidores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {serversLoading ? (
                <div className="space-y-4">
                  <div className="h-16 animate-pulse rounded bg-muted" />
                  <div className="h-16 animate-pulse rounded bg-muted" />
                </div>
              ) : servers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Server className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">
                    No hay servidores registrados
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Agrega tu primer servidor para comenzar el monitoreo
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Servidor
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {servers.map(server => (
                    <div key={server.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            {getStatusIcon(server.status)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{server.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {server.type} • {server.ipAddress} •{' '}
                              {server.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge
                            className={
                              server.status === 'ONLINE'
                                ? 'badge-success'
                                : server.status === 'OFFLINE'
                                  ? 'badge-destructive'
                                  : server.status === 'WARNING'
                                    ? 'badge-warning'
                                    : 'badge-primary'
                            }
                          >
                            {server.status === 'ONLINE'
                              ? 'En Línea'
                              : server.status === 'OFFLINE'
                                ? 'Desconectado'
                                : server.status === 'WARNING'
                                  ? 'Advertencia'
                                  : server.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Ver Detalles
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t pt-4">
                        <div className="text-sm text-muted-foreground">
                          Cliente: {server.clientName}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Lista de Clientes
              </CardTitle>
              <CardDescription>
                Gestiona la información de todos tus clientes de infraestructura
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clientsLoading ? (
                <div className="space-y-4">
                  <div className="h-16 animate-pulse rounded bg-muted" />
                  <div className="h-16 animate-pulse rounded bg-muted" />
                </div>
              ) : clients.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <User className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">
                    No hay clientes registrados
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Agrega tu primer cliente para comenzar la gestión
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Cliente
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {clients.map(client => (
                    <div key={client.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Building className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {client.companyName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {client.contactName} • {client.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge
                            className={
                              client.status === 'ACTIVE'
                                ? 'badge-success'
                                : 'badge-destructive'
                            }
                          >
                            {client.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Ver Perfil
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="flex items-center space-x-2">
                          <Server className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Servidores</p>
                            <p className="text-sm text-muted-foreground">
                              {client.serverCount}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              Tarifa Mensual
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ${client.monthlyFee?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              Nivel de Servicio
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {client.serviceLevel}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
