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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Users,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Shield,
  Key,
  Clock,
  Activity,
  Server,
  UserCheck,
  UserX,
  AlertTriangle,
  Calendar,
  Save,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ServerUserAccessSchema,
  CreateServerUserAccessInput,
  formatAccessType,
  formatAccessLevel,
  formatUserStatus,
  getAccessTypeColor,
  getAccessLevelColor,
  getUserStatusColor,
  validateSSHKey,
  validatePasswordStrength,
} from '@/lib/validations/server-user'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface ServerUserAccess {
  id: string
  username: string
  email: string
  fullName: string
  department?: string | null
  jobTitle?: string | null
  accessType: string
  accessLevel: string
  status: string
  sshKey?: string | null
  twoFactorEnabled: boolean
  lastLogin?: string | null
  lastActivity?: string | null
  expiresAt?: string | null
  notes?: string | null
  createdAt: string
  server: {
    id: string
    name: string
    hostname?: string | null
    ipAddress: string
    status: string
  }
  accessLogs: Array<{
    id: string
    action: string
    ipAddress?: string | null
    success: boolean
    createdAt: string
  }>
  _count?: {
    accessLogs: number
  }
}

interface Server {
  id: string
  name: string
  hostname?: string | null
  ipAddress: string
  status: string
}

export default function ServerUsersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [users, setUsers] = useState<ServerUserAccess[]>([])
  const [servers, setServers] = useState<Server[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [accessTypeFilter, setAccessTypeFilter] = useState('all')
  const [accessLevelFilter, setAccessLevelFilter] = useState('all')
  const [serverFilter, setServerFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showUserForm, setShowUserForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState<ServerUserAccess | null>(
    null
  )
  const [showUserDetail, setShowUserDetail] = useState(false)
  const [activeTab, setActiveTab] = useState('users')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateServerUserAccessInput>({
    resolver: zodResolver(ServerUserAccessSchema),
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchUsers()
      fetchServers()
    }
  }, [
    user,
    currentPage,
    searchTerm,
    statusFilter,
    accessTypeFilter,
    accessLevelFilter,
    serverFilter,
  ])

  const fetchUsers = async () => {
    try {
      setUsersLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(accessTypeFilter !== 'all' && { accessType: accessTypeFilter }),
        ...(accessLevelFilter !== 'all' && { accessLevel: accessLevelFilter }),
        ...(serverFilter !== 'all' && { serverId: serverFilter }),
      })

      const response = await fetch(`/api/servers/users?${params}`)
      const result = await response.json()

      if (result.success) {
        setUsers(result.data)
        setTotalPages(result.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setUsersLoading(false)
    }
  }

  const fetchServers = async () => {
    try {
      const response = await fetch('/api/servers')
      const result = await response.json()

      if (result.success) {
        setServers(result.data)
      }
    } catch (error) {
      console.error('Error fetching servers:', error)
    }
  }

  const onSubmitUser = async (data: CreateServerUserAccessInput) => {
    try {
      const response = await fetch('/api/servers/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        alert('Usuario creado exitosamente')
        setShowUserForm(false)
        reset()
        fetchUsers()
      } else {
        alert('Error al crear usuario: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error al crear usuario')
    }
  }

  const handleEditUser = (user: ServerUserAccess) => {
    setSelectedUser(user)
    setValue('username', user.username)
    setValue('email', user.email)
    setValue('fullName', user.fullName)
    setValue('department', user.department || '')
    setValue('jobTitle', user.jobTitle || '')
    setValue('accessType', user.accessType as any)
    setValue('accessLevel', user.accessLevel as any)
    setValue('status', user.status as any)
    setValue('sshKey', user.sshKey || '')
    setValue('twoFactorEnabled', user.twoFactorEnabled)
    setValue('notes', user.notes || '')
    setValue('serverId', user.server.id)
    if (user.expiresAt) {
      setValue('expiresAt', user.expiresAt)
    }
    setShowUserForm(true)
  }

  const handleViewUser = (user: ServerUserAccess) => {
    setSelectedUser(user)
    setShowUserDetail(true)
  }

  const handleToggleStatus = async (
    user: ServerUserAccess,
    newStatus: string
  ) => {
    try {
      const response = await fetch(`/api/servers/users/${user.id}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        alert(`Estado del usuario actualizado a ${formatUserStatus(newStatus)}`)
        fetchUsers()
      } else {
        alert('Error al cambiar estado del usuario')
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
      alert('Error al cambiar estado del usuario')
    }
  }

  const handleDeleteUser = async (user: ServerUserAccess) => {
    if (
      confirm(
        `¿Estás seguro de que quieres eliminar el acceso de ${user.username}?`
      )
    ) {
      try {
        const response = await fetch(`/api/servers/users/${user.id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          alert('Usuario eliminado exitosamente')
          fetchUsers()
        } else {
          alert('Error al eliminar usuario')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Error al eliminar usuario')
      }
    }
  }

  if (loading || usersLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Cargando usuarios de servidores...</p>
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
              <h1 className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-3xl font-bold text-transparent">
                Gestión de Usuarios de Servidores
              </h1>
              <p className="text-muted-foreground">
                Administra accesos y permisos de usuarios en servidores
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
              <DialogTrigger asChild>
                <Button className="btn-primary-gradient">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    {selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                  </DialogTitle>
                  <DialogDescription>
                    Configure el acceso del usuario al servidor
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={handleSubmit(onSubmitUser)}
                  className="space-y-6"
                >
                  {/* Información Personal */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Información Personal
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="username">Nombre de Usuario *</Label>
                        <Input
                          id="username"
                          {...register('username')}
                          placeholder="ej: jperez"
                        />
                        {errors.username && (
                          <p className="text-sm text-red-500">
                            {errors.username.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register('email')}
                          placeholder="ej: jperez@empresa.com"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nombre Completo *</Label>
                        <Input
                          id="fullName"
                          {...register('fullName')}
                          placeholder="ej: Juan Pérez"
                        />
                        {errors.fullName && (
                          <p className="text-sm text-red-500">
                            {errors.fullName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department">Departamento</Label>
                        <Input
                          id="department"
                          {...register('department')}
                          placeholder="ej: IT"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Cargo</Label>
                        <Input
                          id="jobTitle"
                          {...register('jobTitle')}
                          placeholder="ej: Administrador de Sistemas"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="serverId">Servidor *</Label>
                        <Select
                          value={watch('serverId')}
                          onValueChange={value => setValue('serverId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar servidor" />
                          </SelectTrigger>
                          <SelectContent>
                            {servers.map(server => (
                              <SelectItem key={server.id} value={server.id}>
                                {server.name} - {server.ipAddress}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.serverId && (
                          <p className="text-sm text-red-500">
                            {errors.serverId.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Configuración de Acceso */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Configuración de Acceso
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="accessType">Tipo de Acceso</Label>
                        <Select
                          value={watch('accessType')}
                          onValueChange={value =>
                            setValue('accessType', value as any)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SSH">SSH</SelectItem>
                            <SelectItem value="RDP">RDP</SelectItem>
                            <SelectItem value="FTP">FTP</SelectItem>
                            <SelectItem value="SFTP">SFTP</SelectItem>
                            <SelectItem value="WEB">Web</SelectItem>
                            <SelectItem value="API">API</SelectItem>
                            <SelectItem value="DATABASE">
                              Base de Datos
                            </SelectItem>
                            <SelectItem value="CUSTOM">
                              Personalizado
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accessLevel">Nivel de Acceso</Label>
                        <Select
                          value={watch('accessLevel')}
                          onValueChange={value =>
                            setValue('accessLevel', value as any)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar nivel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="READ_ONLY">
                              Solo Lectura
                            </SelectItem>
                            <SelectItem value="LIMITED">Limitado</SelectItem>
                            <SelectItem value="STANDARD">Estándar</SelectItem>
                            <SelectItem value="ADMINISTRATOR">
                              Administrador
                            </SelectItem>
                            <SelectItem value="SUPER_ADMIN">
                              Super Administrador
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

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
                            <SelectItem value="EXPIRED">Expirado</SelectItem>
                            <SelectItem value="PENDING_APPROVAL">
                              Pendiente
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Credenciales */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Credenciales</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="sshKey">Clave SSH Pública</Label>
                        <Textarea
                          id="sshKey"
                          {...register('sshKey')}
                          placeholder="ssh-rsa AAAAB3NzaC1yc2E..."
                          rows={4}
                        />
                        {watch('sshKey') &&
                          !validateSSHKey(watch('sshKey') || '') && (
                            <p className="text-sm text-red-500">
                              Formato de clave SSH inválido
                            </p>
                          )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                          id="password"
                          type="password"
                          {...register('password')}
                          placeholder="Contraseña (opcional)"
                        />
                        {watch('password') &&
                          !validatePasswordStrength(watch('password') || '')
                            .valid && (
                            <p className="text-sm text-red-500">
                              {
                                validatePasswordStrength(
                                  watch('password') || ''
                                ).message
                              }
                            </p>
                          )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="twoFactorEnabled"
                        {...register('twoFactorEnabled')}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="twoFactorEnabled">
                        Habilitar autenticación de dos factores
                      </Label>
                    </div>
                  </div>

                  {/* Fechas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Fechas</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="expiresAt">Fecha de Expiración</Label>
                        <Input
                          id="expiresAt"
                          type="date"
                          {...register('expiresAt')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notas */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas</Label>
                    <Textarea
                      id="notes"
                      {...register('notes')}
                      placeholder="Notas adicionales sobre el usuario..."
                      rows={3}
                    />
                  </div>

                  <DialogFooter className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowUserForm(false)
                        setSelectedUser(null)
                        reset()
                      }}
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
                          {selectedUser ? 'Actualizar' : 'Crear'} Usuario
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
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="audit">Auditoría</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por nombre, email o usuario..."
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
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="INACTIVE">Inactivo</SelectItem>
                  <SelectItem value="SUSPENDED">Suspendido</SelectItem>
                  <SelectItem value="EXPIRED">Expirado</SelectItem>
                  <SelectItem value="PENDING_APPROVAL">Pendiente</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={accessTypeFilter}
                onValueChange={setAccessTypeFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="SSH">SSH</SelectItem>
                  <SelectItem value="RDP">RDP</SelectItem>
                  <SelectItem value="FTP">FTP</SelectItem>
                  <SelectItem value="SFTP">SFTP</SelectItem>
                  <SelectItem value="WEB">Web</SelectItem>
                  <SelectItem value="API">API</SelectItem>
                  <SelectItem value="DATABASE">Base de Datos</SelectItem>
                </SelectContent>
              </Select>
              <Select value={serverFilter} onValueChange={setServerFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por servidor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los servidores</SelectItem>
                  {servers.map(server => (
                    <SelectItem key={server.id} value={server.id}>
                      {server.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Users List */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Lista de Usuarios
                </CardTitle>
                <CardDescription>
                  Gestiona todos los usuarios con acceso a servidores
                </CardDescription>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Users className="mb-4 h-16 w-16 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-semibold">
                      No hay usuarios registrados
                    </h3>
                    <p className="mb-4 text-muted-foreground">
                      Comienza agregando el primer usuario
                    </p>
                    <Button onClick={() => setShowUserForm(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Usuario
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map(user => (
                      <div key={user.id} className="rounded-lg border p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                              <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">
                                {user.fullName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {user.username} • {user.email}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {user.server.name} ({user.server.ipAddress})
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <Badge
                                className={getUserStatusColor(user.status)}
                              >
                                {formatUserStatus(user.status)}
                              </Badge>
                              <div className="mt-1 flex space-x-1">
                                <Badge
                                  className={getAccessTypeColor(
                                    user.accessType
                                  )}
                                >
                                  {formatAccessType(user.accessType)}
                                </Badge>
                                <Badge
                                  className={getAccessLevelColor(
                                    user.accessLevel
                                  )}
                                >
                                  {formatAccessLevel(user.accessLevel)}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewUser(user)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleToggleStatus(
                                    user,
                                    user.status === 'ACTIVE'
                                      ? 'SUSPENDED'
                                      : 'ACTIVE'
                                  )
                                }
                              >
                                {user.status === 'ACTIVE' ? (
                                  <UserX className="h-4 w-4" />
                                ) : (
                                  <UserCheck className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">
                                Tipo de Acceso
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatAccessType(user.accessType)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Key className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Nivel</p>
                              <p className="text-sm text-muted-foreground">
                                {formatAccessLevel(user.accessLevel)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">
                                Último Login
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {user.lastLogin
                                  ? new Date(
                                      user.lastLogin
                                    ).toLocaleDateString()
                                  : 'Nunca'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Activity className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Actividad</p>
                              <p className="text-sm text-muted-foreground">
                                {user._count?.accessLogs || 0} accesos
                              </p>
                            </div>
                          </div>
                        </div>
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
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
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
          </TabsContent>

          {/* Audit Tab */}
          <TabsContent value="audit">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Auditoría de Accesos
                </CardTitle>
                <CardDescription>
                  Historial de accesos y actividades de usuarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center">
                  <Activity className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-medium">
                    Auditoría de Accesos
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Esta funcionalidad estará disponible en la próxima versión
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Incluirá logs detallados de accesos, comandos ejecutados y
                    actividad de usuarios
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* User Detail Modal */}
        <Dialog open={showUserDetail} onOpenChange={setShowUserDetail}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Detalles del Usuario
              </DialogTitle>
              <DialogDescription>
                Información completa del acceso de usuario
              </DialogDescription>
            </DialogHeader>

            {selectedUser && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 font-semibold">
                        Información Personal
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium">
                            Nombre de Usuario
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedUser.username}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Nombre Completo</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedUser.fullName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedUser.email}
                          </p>
                        </div>
                        {selectedUser.department && (
                          <div>
                            <p className="text-sm font-medium">Departamento</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedUser.department}
                            </p>
                          </div>
                        )}
                        {selectedUser.jobTitle && (
                          <div>
                            <p className="text-sm font-medium">Cargo</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedUser.jobTitle}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 font-semibold">
                        Configuración de Acceso
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium">Servidor</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedUser.server.name} (
                            {selectedUser.server.ipAddress})
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Tipo de Acceso</p>
                          <Badge
                            className={getAccessTypeColor(
                              selectedUser.accessType
                            )}
                          >
                            {formatAccessType(selectedUser.accessType)}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Nivel de Acceso</p>
                          <Badge
                            className={getAccessLevelColor(
                              selectedUser.accessLevel
                            )}
                          >
                            {formatAccessLevel(selectedUser.accessLevel)}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Estado</p>
                          <Badge
                            className={getUserStatusColor(selectedUser.status)}
                          >
                            {formatUserStatus(selectedUser.status)}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium">2FA Habilitado</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedUser.twoFactorEnabled ? 'Sí' : 'No'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Información del Sistema</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Fecha de Creación</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Último Login</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedUser.lastLogin
                          ? new Date(
                              selectedUser.lastLogin
                            ).toLocaleDateString()
                          : 'Nunca'}
                      </p>
                    </div>
                    {selectedUser.expiresAt && (
                      <div>
                        <p className="text-sm font-medium">
                          Fecha de Expiración
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(
                            selectedUser.expiresAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedUser.notes && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Notas</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.notes}
                    </p>
                  </div>
                )}

                {selectedUser.accessLogs.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Actividad Reciente</h3>
                    <div className="space-y-2">
                      {selectedUser.accessLogs.slice(0, 5).map(log => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between rounded border p-2"
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={`h-2 w-2 rounded-full ${log.success ? 'bg-green-500' : 'bg-red-500'}`}
                            ></div>
                            <span className="text-sm">{log.action}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(log.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowUserDetail(false)}
              >
                Cerrar
              </Button>
              <Button
                onClick={() => {
                  setShowUserDetail(false)
                  handleEditUser(selectedUser!)
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar Usuario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
