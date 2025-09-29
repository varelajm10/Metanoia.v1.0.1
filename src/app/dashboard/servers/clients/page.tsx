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
  Users,
  Plus,
  Building,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Calendar,
  Save,
  X,
  Edit,
  Trash2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CreateServerClientSchema,
  CreateServerClientInput,
} from '@/lib/validations/server'

interface ServerClient {
  id: string
  companyName: string
  contactName: string
  email: string
  phone?: string
  address?: string
  city?: string
  country?: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  monthlyFee?: number
  serviceLevel?: string
  contractStart?: string
  contractEnd?: string
  notes?: string
  servers?: Array<{
    id: string
    name: string
    status: string
  }>
}

export default function ServerClientsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [clients, setClients] = useState<ServerClient[]>([])
  const [clientsLoading, setClientsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showClientForm, setShowClientForm] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateServerClientInput>({
    resolver: zodResolver(CreateServerClientSchema),
  })

  useEffect(() => {
    if (user) {
      fetchClients()
    }
  }, [user, currentPage, searchTerm, statusFilter])

  const fetchClients = async () => {
    try {
      setClientsLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
      })

      const response = await fetch(`/api/servers/clients?${params}`)
      const result = await response.json()

      if (result.success) {
        setClients(result.data.clients)
        setTotalPages(result.data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setClientsLoading(false)
    }
  }

  const onSubmitClient = async (data: CreateServerClientInput) => {
    try {
      const response = await fetch('/api/servers/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        alert('Cliente creado exitosamente')
        setShowClientForm(false)
        reset()
        fetchClients()
      } else {
        alert('Error al crear cliente: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating client:', error)
      alert('Error al crear cliente')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      SUSPENDED: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatStatus = (status: string) => {
    const statuses: { [key: string]: string } = {
      ACTIVE: 'Activo',
      INACTIVE: 'Inactivo',
      SUSPENDED: 'Suspendido',
    }
    return statuses[status] || status
  }

  if (loading || clientsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Cargando clientes...</p>
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
              <Link href="/dashboard/servers">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Servidores
              </Link>
            </Button>
            <div>
              <h1 className="bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-3xl font-bold text-transparent">
                Gestión de Clientes
              </h1>
              <p className="text-muted-foreground">
                Administra los clientes de infraestructura
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Dialog open={showClientForm} onOpenChange={setShowClientForm}>
              <DialogTrigger asChild>
                <Button className="btn-primary-gradient">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Building className="mr-2 h-5 w-5" />
                    Nuevo Cliente
                  </DialogTitle>
                  <DialogDescription>
                    Complete la información del cliente de infraestructura
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={handleSubmit(onSubmitClient)}
                  className="space-y-6"
                >
                  {/* Información de la Empresa */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Información de la Empresa
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">
                          Nombre de la Empresa *
                        </Label>
                        <Input
                          id="companyName"
                          {...register('companyName')}
                          placeholder="ej: Empresa ABC S.A.S"
                        />
                        {errors.companyName && (
                          <p className="text-sm text-red-500">
                            {errors.companyName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactName">
                          Nombre del Contacto *
                        </Label>
                        <Input
                          id="contactName"
                          {...register('contactName')}
                          placeholder="ej: Juan Pérez"
                        />
                        {errors.contactName && (
                          <p className="text-sm text-red-500">
                            {errors.contactName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register('email')}
                          placeholder="ej: contacto@empresa.com"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          {...register('phone')}
                          placeholder="ej: +57 300 123 4567"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Dirección</Label>
                        <Input
                          id="address"
                          {...register('address')}
                          placeholder="ej: Calle 123 #45-67"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">Ciudad</Label>
                        <Input
                          id="city"
                          {...register('city')}
                          placeholder="ej: Bogotá"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">País</Label>
                        <Input
                          id="country"
                          {...register('country')}
                          placeholder="ej: Colombia"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Información del Servicio */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Información del Servicio
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="status">Estado</Label>
                        <Select
                          value={watch('status')}
                          onValueChange={value =>
                            setValue('status', value as any)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Activo</SelectItem>
                            <SelectItem value="INACTIVE">Inactivo</SelectItem>
                            <SelectItem value="SUSPENDED">
                              Suspendido
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="serviceLevel">Nivel de Servicio</Label>
                        <Select
                          value={watch('serviceLevel')}
                          onValueChange={value =>
                            setValue('serviceLevel', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar nivel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Basic">Básico</SelectItem>
                            <SelectItem value="Standard">Estándar</SelectItem>
                            <SelectItem value="Premium">Premium</SelectItem>
                            <SelectItem value="Enterprise">
                              Empresarial
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="monthlyFee">Tarifa Mensual</Label>
                        <Input
                          id="monthlyFee"
                          type="number"
                          step="0.01"
                          {...register('monthlyFee', { valueAsNumber: true })}
                          placeholder="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contractStart">
                          Inicio del Contrato
                        </Label>
                        <Input
                          id="contractStart"
                          type="date"
                          {...register('contractStart')}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contractEnd">Fin del Contrato</Label>
                        <Input
                          id="contractEnd"
                          type="date"
                          {...register('contractEnd')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notas */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas Adicionales</Label>
                    <Textarea
                      id="notes"
                      {...register('notes')}
                      placeholder="Notas importantes sobre el cliente..."
                      rows={3}
                    />
                  </div>

                  <DialogFooter className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowClientForm(false)}
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
                          Guardar Cliente
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nombre de empresa, contacto o email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="ACTIVE">Activo</SelectItem>
              <SelectItem value="INACTIVE">Inactivo</SelectItem>
              <SelectItem value="SUSPENDED">Suspendido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clients List */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Lista de Clientes
            </CardTitle>
            <CardDescription>
              Gestiona la información de todos tus clientes de infraestructura
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Building className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  No hay clientes registrados
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Agrega tu primer cliente para comenzar la gestión
                </p>
                <Button onClick={() => setShowClientForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Cliente
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {clients.map(client => (
                  <div key={client.id} className="rounded-lg border p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                          <Building className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {client.companyName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {client.contactName} • {client.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(client.status)}>
                          {formatStatus(client.status)}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">
                            {client.email}
                          </p>
                        </div>
                      </div>

                      {client.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Teléfono</p>
                            <p className="text-sm text-muted-foreground">
                              {client.phone}
                            </p>
                          </div>
                        </div>
                      )}

                      {client.address && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Dirección</p>
                            <p className="text-sm text-muted-foreground">
                              {client.address}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Tarifa Mensual</p>
                          <p className="text-sm text-muted-foreground">
                            $
                            {client.monthlyFee?.toLocaleString() ||
                              'No especificada'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {client.servers && client.servers.length > 0 && (
                      <div className="mt-4 border-t pt-4">
                        <p className="mb-2 text-sm font-medium">
                          Servidores ({client.servers.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {client.servers.map(server => (
                            <Badge key={server.id} variant="outline">
                              {server.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
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
      </main>
    </div>
  )
}
