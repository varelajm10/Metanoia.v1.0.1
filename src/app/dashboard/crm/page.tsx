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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Save,
  X,
  Download,
  Upload,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import {
  CreateCustomerSchema,
  CreateCustomerInput,
} from '@/lib/validations/customer'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { CustomerTableSkeleton } from '@/components/ui/customer-table-skeleton'

interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  } | null
  isActive: boolean
  createdAt: string
  _count?: {
    orders: number
    invoices: number
  }
}

export default function CRMPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customersLoading, setCustomersLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  )
  const [showCustomerDetail, setShowCustomerDetail] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCustomerInput>({
    resolver: zodResolver(CreateCustomerSchema),
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchCustomers()
    }
  }, [user, currentPage, searchTerm, statusFilter])

  const fetchCustomers = async () => {
    try {
      setCustomersLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && {
          isActive: statusFilter === 'active' ? 'true' : 'false',
        }),
      })

      const response = await fetch(`/api/customers?${params}`)
      if (response.ok) {
        const data = await response.json()
        setCustomers(data.data || [])
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setCustomersLoading(false)
    }
  }

  const onSubmitCustomer = async (data: CreateCustomerInput) => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Cliente creado exitosamente')
        setShowCustomerForm(false)
        reset()
        fetchCustomers()
      } else {
        toast.error('Error al crear cliente: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating customer:', error)
      toast.error('Error al crear cliente')
    }
  }

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setValue('name', customer.name)
    setValue('email', customer.email || '')
    setValue('phone', customer.phone || '')
    setValue('isActive', customer.isActive)
    if (customer.address) {
      setValue('address.street', customer.address.street || '')
      setValue('address.city', customer.address.city || '')
      setValue('address.state', customer.address.state || '')
      setValue('address.zipCode', customer.address.zipCode || '')
      setValue('address.country', customer.address.country || '')
    }
    setShowCustomerForm(true)
  }

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowCustomerDetail(true)
  }

  const handleDeleteCustomer = async (customer: Customer) => {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${customer.name}?`)) {
      try {
        const response = await fetch(`/api/customers/${customer.id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          toast.success('Cliente eliminado exitosamente')
          fetchCustomers()
        } else {
          toast.error('Error al eliminar cliente')
        }
      } catch (error) {
        console.error('Error deleting customer:', error)
        toast.error('Error al eliminar cliente')
      }
    }
  }

  const handleToggleStatus = async (customer: Customer) => {
    try {
      const response = await fetch(`/api/customers/${customer.id}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !customer.isActive }),
      })

      if (response.ok) {
        toast.success(
          `Cliente ${!customer.isActive ? 'activado' : 'desactivado'} exitosamente`
        )
        fetchCustomers()
      } else {
        toast.error('Error al cambiar estado del cliente')
      }
    } catch (error) {
      console.error('Error toggling customer status:', error)
      toast.error('Error al cambiar estado del cliente')
    }
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
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-3xl font-bold text-transparent">
                Gestión de Clientes
              </h1>
              <p className="text-muted-foreground">
                Administra tu base de clientes y contactos
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Dialog open={showCustomerForm} onOpenChange={setShowCustomerForm}>
              <DialogTrigger asChild>
                <Button className="btn-primary-gradient">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                <DialogHeader className="pb-6">
                  <DialogTitle className="flex items-center text-2xl font-bold">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    {selectedCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}
                  </DialogTitle>
                  <DialogDescription className="text-base text-muted-foreground">
                    Complete la información del cliente para agregarlo a tu base de datos
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={handleSubmit(onSubmitCustomer)}
                  className="space-y-8"
                >
                  {/* Información Básica */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-1 rounded-full bg-primary"></div>
                      <h3 className="text-xl font-semibold">
                        Información Básica
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-sm font-semibold text-foreground">
                          Nombre Completo *
                        </Label>
                        <Input
                          id="name"
                          {...register('name')}
                          placeholder="ej: Juan Pérez"
                          className="h-12 rounded-xl border-2 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        />
                        {errors.name && (
                          <p className="text-sm text-destructive flex items-center">
                            <div className="mr-1 h-1 w-1 rounded-full bg-destructive"></div>
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                          Correo Electrónico
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          {...register('email')}
                          placeholder="ej: juan@empresa.com"
                          className="h-12 rounded-xl border-2 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive flex items-center">
                            <div className="mr-1 h-1 w-1 rounded-full bg-destructive"></div>
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="phone" className="text-sm font-semibold text-foreground">
                          Teléfono
                        </Label>
                        <Input
                          id="phone"
                          {...register('phone')}
                          placeholder="ej: +57 300 123 4567"
                          className="h-12 rounded-xl border-2 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="isActive" className="text-sm font-semibold text-foreground">
                          Estado del Cliente
                        </Label>
                        <Select
                          value={watch('isActive') ? 'active' : 'inactive'}
                          onValueChange={value =>
                            setValue('isActive', value === 'active')
                          }
                        >
                          <SelectTrigger className="h-12 rounded-xl border-2 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200">
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active" className="flex items-center">
                              <div className="mr-2 h-2 w-2 rounded-full bg-success"></div>
                              Activo
                            </SelectItem>
                            <SelectItem value="inactive" className="flex items-center">
                              <div className="mr-2 h-2 w-2 rounded-full bg-muted-foreground"></div>
                              Inactivo
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Dirección */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-1 rounded-full bg-accent"></div>
                      <h3 className="text-xl font-semibold">Información de Dirección</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="address.street" className="text-sm font-semibold text-foreground">
                          Dirección
                        </Label>
                        <Input
                          id="address.street"
                          {...register('address.street')}
                          placeholder="ej: Calle 123 #45-67"
                          className="h-12 rounded-xl border-2 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="address.city" className="text-sm font-semibold text-foreground">
                          Ciudad
                        </Label>
                        <Input
                          id="address.city"
                          {...register('address.city')}
                          placeholder="ej: Bogotá"
                          className="h-12 rounded-xl border-2 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="address.state" className="text-sm font-semibold text-foreground">
                          Estado/Departamento
                        </Label>
                        <Input
                          id="address.state"
                          {...register('address.state')}
                          placeholder="ej: Cundinamarca"
                          className="h-12 rounded-xl border-2 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="address.zipCode" className="text-sm font-semibold text-foreground">
                          Código Postal
                        </Label>
                        <Input
                          id="address.zipCode"
                          {...register('address.zipCode')}
                          placeholder="ej: 110111"
                          className="h-12 rounded-xl border-2 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="address.country" className="text-sm font-semibold text-foreground">
                          País
                        </Label>
                        <Input
                          id="address.country"
                          {...register('address.country')}
                          placeholder="ej: Colombia"
                          className="h-12 rounded-xl border-2 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="flex justify-end space-x-4 pt-6 border-t border-border/50">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCustomerForm(false)
                        setSelectedCustomer(null)
                        reset()
                      }}
                      className="h-12 px-6 rounded-xl border-2 border-border/50 hover:border-destructive/50 hover:text-destructive transition-all duration-200"
                    >
                      <X className="mr-2 h-5 w-5" />
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary-gradient h-12 px-8 rounded-xl hover:scale-105 transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-5 w-5" />
                          {selectedCustomer ? 'Actualizar' : 'Crear'} Cliente
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
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card className="card-enhanced">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Clientes
                  </p>
                  <p className="text-2xl font-bold">{customers.length}</p>
                  <p className="text-xs text-muted-foreground">Registrados</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Clientes Activos
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {customers.filter(c => c.isActive).length}
                  </p>
                  <p className="text-xs text-muted-foreground">En actividad</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Nuevos Este Mes
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {
                      customers.filter(c => {
                        const created = new Date(c.createdAt)
                        const now = new Date()
                        return (
                          created.getMonth() === now.getMonth() &&
                          created.getFullYear() === now.getFullYear()
                        )
                      }).length
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Últimos 30 días
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Tasa de Actividad
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {customers.length > 0
                      ? Math.round(
                          (customers.filter(c => c.isActive).length /
                            customers.length) *
                            100
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Clientes activos
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
        </div>

        {/* Customers Table */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Lista de Clientes
            </CardTitle>
            <CardDescription>
              Gestiona todos tus clientes desde esta vista
            </CardDescription>
          </CardHeader>
          <CardContent>
            {customersLoading ? (
              <CustomerTableSkeleton />
            ) : customers.length > 0 ? (
              <div className="space-y-4">
                {customers.map(customer => (
                  <div
                    key={customer.id}
                    className="rounded-lg border p-6 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {customer.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {customer.email || 'Sin email'}
                          </p>
                          {customer.phone && (
                            <p className="text-sm text-muted-foreground">
                              {customer.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          {customer._count && (
                            <div className="text-sm text-muted-foreground">
                              <p>{customer._count.orders} órdenes</p>
                              <p>{customer._count.invoices} facturas</p>
                            </div>
                          )}
                        </div>
                        <Badge
                          variant={customer.isActive ? 'default' : 'secondary'}
                        >
                          {customer.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewCustomer(customer)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCustomer(customer)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(customer)}
                          >
                            {customer.isActive ? 'Desactivar' : 'Activar'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCustomer(customer)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                      {customer.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">
                              {customer.email}
                            </p>
                          </div>
                        </div>
                      )}

                      {customer.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Teléfono</p>
                            <p className="text-sm text-muted-foreground">
                              {customer.phone}
                            </p>
                          </div>
                        </div>
                      )}

                      {customer.address && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Ubicación</p>
                            <p className="text-sm text-muted-foreground">
                              {customer.address.city}, {customer.address.state}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Registrado</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  No hay clientes registrados
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Comienza agregando tu primer cliente
                </p>
                <Button onClick={() => setShowCustomerForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Cliente
                </Button>
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

        {/* Customer Detail Modal */}
        <Dialog open={showCustomerDetail} onOpenChange={setShowCustomerDetail}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Detalles del Cliente
              </DialogTitle>
              <DialogDescription>
                Información completa del cliente
              </DialogDescription>
            </DialogHeader>

            {selectedCustomer && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 font-semibold">
                        Información Personal
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium">Nombre</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedCustomer.name}
                          </p>
                        </div>
                        {selectedCustomer.email && (
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedCustomer.email}
                            </p>
                          </div>
                        )}
                        {selectedCustomer.phone && (
                          <div>
                            <p className="text-sm font-medium">Teléfono</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedCustomer.phone}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium">Estado</p>
                          <Badge
                            variant={
                              selectedCustomer.isActive
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {selectedCustomer.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 font-semibold">Dirección</h3>
                      {selectedCustomer.address ? (
                        <div className="space-y-2">
                          {selectedCustomer.address.street && (
                            <p className="text-sm text-muted-foreground">
                              {selectedCustomer.address.street}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {selectedCustomer.address.city},{' '}
                            {selectedCustomer.address.state}
                          </p>
                          {selectedCustomer.address.zipCode && (
                            <p className="text-sm text-muted-foreground">
                              {selectedCustomer.address.zipCode}
                            </p>
                          )}
                          {selectedCustomer.address.country && (
                            <p className="text-sm text-muted-foreground">
                              {selectedCustomer.address.country}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Sin dirección registrada
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {selectedCustomer._count && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Estadísticas</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                              <span className="text-sm font-medium text-blue-600">
                                {selectedCustomer._count.orders}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Órdenes</p>
                              <p className="text-xs text-muted-foreground">
                                Total de órdenes
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                              <span className="text-sm font-medium text-green-600">
                                {selectedCustomer._count.invoices}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Facturas</p>
                              <p className="text-xs text-muted-foreground">
                                Total de facturas
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="font-semibold">Información del Sistema</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Fecha de Registro</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          selectedCustomer.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Última Actualización
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          selectedCustomer.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCustomerDetail(false)}
              >
                Cerrar
              </Button>
              <Button
                onClick={() => {
                  setShowCustomerDetail(false)
                  handleEditCustomer(selectedCustomer!)
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar Cliente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
