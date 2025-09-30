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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
  ArrowLeft,
  Wrench,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Plus,
  Eye,
  Edit,
  Trash2,
  Send,
  RefreshCw,
  TrendingUp,
  BarChart3,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface MaintenanceStats {
  totalMaintenances: number
  plannedMaintenances: number
  inProgressMaintenances: number
  completedMaintenances: number
  cancelledMaintenances: number
  postponedMaintenances: number
  slaImpactMaintenances: number
  completionRate: number
  avgDuration: number
  upcomingMaintenances: Array<{
    id: string
    title: string
    type: string
    status: string
    startTime: string
    endTime: string
    slaImpact: boolean
    server: {
      name: string
      client: { companyName: string }
    }
  }>
  overdueMaintenances: Array<{
    id: string
    title: string
    type: string
    startTime: string
    server: {
      name: string
      client: { companyName: string }
    }
  }>
  maintenancesByType: Array<{
    type: string
    _count: { type: number }
  }>
  maintenancesByStatus: Array<{
    status: string
    _count: { status: number }
  }>
  recentMaintenances: Array<{
    id: string
    title: string
    type: string
    status: string
    startTime: string
    server: {
      name: string
      client: { companyName: string }
    }
  }>
}

interface MaintenanceWindow {
  id: string
  title: string
  description: string
  type: string
  status: string
  startTime: string
  endTime: string
  timezone: string
  estimatedDuration?: number
  slaImpact: boolean
  expectedDowntime?: number
  contactPerson?: string
  server: {
    id: string
    name: string
    client: { companyName: string }
  }
}

export default function MaintenanceDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [stats, setStats] = useState<MaintenanceStats | null>(null)
  const [maintenanceWindows, setMaintenanceWindows] = useState<
    MaintenanceWindow[]
  >([])
  const [statsLoading, setStatsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false)
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<MaintenanceWindow | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    serverId: '',
    title: '',
    description: '',
    type: 'SCHEDULED',
    startTime: '',
    endTime: '',
    timezone: 'UTC',
    estimatedDuration: '',
    slaImpact: false,
    expectedDowntime: '',
    contactPerson: '',
    emergencyContact: '',
    rollbackPlan: '',
  })

  useEffect(() => {
    if (user) {
      fetchStats()
      fetchMaintenanceWindows()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      setStatsLoading(true)
      const response = await fetch('/api/servers/maintenance/stats')
      const result = await response.json()

      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching maintenance stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  const fetchMaintenanceWindows = async () => {
    try {
      const response = await fetch('/api/servers/maintenance')
      const result = await response.json()

      if (result.success) {
        setMaintenanceWindows(result.data)
      }
    } catch (error) {
      console.error('Error fetching maintenance windows:', error)
    }
  }

  const handleCreateMaintenance = async () => {
    try {
      const response = await fetch('/api/servers/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          estimatedDuration: formData.estimatedDuration
            ? parseInt(formData.estimatedDuration)
            : undefined,
          expectedDowntime: formData.expectedDowntime
            ? parseInt(formData.expectedDowntime)
            : undefined,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setShowMaintenanceForm(false)
        resetForm()
        fetchMaintenanceWindows()
        fetchStats()
        toast.success('Mantenimiento creado exitosamente')
      } else {
        toast.error(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error creating maintenance:', error)
      toast.error('Error al crear mantenimiento')
    }
  }

  const resetForm = () => {
    setFormData({
      serverId: '',
      title: '',
      description: '',
      type: 'SCHEDULED',
      startTime: '',
      endTime: '',
      timezone: 'UTC',
      estimatedDuration: '',
      slaImpact: false,
      expectedDowntime: '',
      contactPerson: '',
      emergencyContact: '',
      rollbackPlan: '',
    })
  }

  const formatMaintenanceType = (type: string) => {
    const types: { [key: string]: string } = {
      SCHEDULED: 'Programado',
      EMERGENCY: 'Emergencia',
      PLANNED: 'Planificado',
      PREVENTIVE: 'Preventivo',
      CORRECTIVE: 'Correctivo',
    }
    return types[type] || type
  }

  const formatMaintenanceStatus = (status: string) => {
    const statuses: { [key: string]: string } = {
      PLANNED: 'Planificado',
      IN_PROGRESS: 'En Progreso',
      COMPLETED: 'Completado',
      CANCELLED: 'Cancelado',
      POSTPONED: 'Pospuesto',
    }
    return statuses[status] || status
  }

  const getMaintenanceTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      SCHEDULED: 'bg-blue-100 text-blue-800',
      EMERGENCY: 'bg-red-100 text-red-800',
      PLANNED: 'bg-green-100 text-green-800',
      PREVENTIVE: 'bg-yellow-100 text-yellow-800',
      CORRECTIVE: 'bg-orange-100 text-orange-800',
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getMaintenanceStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PLANNED: 'bg-gray-100 text-gray-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      POSTPONED: 'bg-yellow-100 text-yellow-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDuration = (minutes?: number): string => {
    if (!minutes) return 'N/A'
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  if (loading || statsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Cargando dashboard de mantenimientos...</p>
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
              <h1 className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-3xl font-bold text-transparent">
                Gestión de Mantenimientos
              </h1>
              <p className="text-muted-foreground">
                Planificación y seguimiento de ventanas de mantenimiento
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Mantenimientos
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.totalMaintenances}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stats.completionRate}% completados
                    </p>
                  </div>
                  <Wrench className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Próximos</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {stats.upcomingMaintenances.length}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Próximos 7 días
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">En Progreso</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.inProgressMaintenances}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Actualmente ejecutándose
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Con Impacto SLA
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {stats.slaImpactMaintenances}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Requieren atención especial
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="upcoming">Próximos</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
            <TabsTrigger value="planning">Planificación</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Próximos Mantenimientos */}
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Próximos Mantenimientos
                  </CardTitle>
                  <CardDescription>
                    Mantenimientos programados para los próximos 7 días
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats && stats.upcomingMaintenances.length > 0 ? (
                    <div className="space-y-4">
                      {stats.upcomingMaintenances
                        .slice(0, 5)
                        .map(maintenance => (
                          <div
                            key={maintenance.id}
                            className="flex items-center justify-between rounded-lg border p-3"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                                <Clock className="h-4 w-4 text-orange-600" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {maintenance.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {maintenance.server.name} •{' '}
                                  {maintenance.server.client.companyName}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                className={getMaintenanceTypeColor(
                                  maintenance.type
                                )}
                              >
                                {formatMaintenanceType(maintenance.type)}
                              </Badge>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {new Date(
                                  maintenance.startTime
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-muted-foreground">
                      No hay mantenimientos próximos programados
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Mantenimientos Vencidos */}
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Mantenimientos Vencidos
                  </CardTitle>
                  <CardDescription>
                    Mantenimientos que deberían haber comenzado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats && stats.overdueMaintenances.length > 0 ? (
                    <div className="space-y-4">
                      {stats.overdueMaintenances
                        .slice(0, 5)
                        .map(maintenance => (
                          <div
                            key={maintenance.id}
                            className="flex items-center justify-between rounded-lg border p-3"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                                <XCircle className="h-4 w-4 text-red-600" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {maintenance.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {maintenance.server.name} •{' '}
                                  {maintenance.server.client.companyName}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="destructive">Vencido</Badge>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {new Date(
                                  maintenance.startTime
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-muted-foreground">
                      No hay mantenimientos vencidos
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Estadísticas por Tipo */}
              <Card className="card-enhanced lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Mantenimientos por Tipo
                  </CardTitle>
                  <CardDescription>
                    Distribución de mantenimientos por categoría
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats && stats.maintenancesByType.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                      {stats.maintenancesByType.map(type => (
                        <div key={type.type} className="text-center">
                          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <span className="text-lg font-bold text-blue-600">
                              {type._count.type}
                            </span>
                          </div>
                          <p className="text-sm font-medium">
                            {formatMaintenanceType(type.type)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(
                              (type._count.type / stats.totalMaintenances) * 100
                            )}
                            %
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-muted-foreground">
                      No hay datos de tipos de mantenimiento
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Upcoming Tab */}
          <TabsContent value="upcoming">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Mantenimientos Próximos
                  </span>
                  <Dialog
                    open={showMaintenanceForm}
                    onOpenChange={setShowMaintenanceForm}
                  >
                    <DialogTrigger asChild>
                      <Button className="btn-primary-gradient">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Mantenimiento
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          Crear Nueva Ventana de Mantenimiento
                        </DialogTitle>
                        <DialogDescription>
                          Programar una nueva ventana de mantenimiento para un
                          servidor
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Título *</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={e =>
                              setFormData({
                                ...formData,
                                title: e.target.value,
                              })
                            }
                            placeholder="Ej: Actualización de sistema"
                          />
                        </div>
                        <div>
                          <Label htmlFor="type">Tipo *</Label>
                          <Select
                            value={formData.type}
                            onValueChange={value =>
                              setFormData({ ...formData, type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SCHEDULED">
                                Programado
                              </SelectItem>
                              <SelectItem value="EMERGENCY">
                                Emergencia
                              </SelectItem>
                              <SelectItem value="PLANNED">
                                Planificado
                              </SelectItem>
                              <SelectItem value="PREVENTIVE">
                                Preventivo
                              </SelectItem>
                              <SelectItem value="CORRECTIVE">
                                Correctivo
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="startTime">Fecha/Hora Inicio *</Label>
                          <Input
                            id="startTime"
                            type="datetime-local"
                            value={formData.startTime}
                            onChange={e =>
                              setFormData({
                                ...formData,
                                startTime: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="endTime">Fecha/Hora Fin *</Label>
                          <Input
                            id="endTime"
                            type="datetime-local"
                            value={formData.endTime}
                            onChange={e =>
                              setFormData({
                                ...formData,
                                endTime: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="estimatedDuration">
                            Duración Estimada (min)
                          </Label>
                          <Input
                            id="estimatedDuration"
                            type="number"
                            value={formData.estimatedDuration}
                            onChange={e =>
                              setFormData({
                                ...formData,
                                estimatedDuration: e.target.value,
                              })
                            }
                            placeholder="60"
                          />
                        </div>
                        <div>
                          <Label htmlFor="timezone">Zona Horaria</Label>
                          <Select
                            value={formData.timezone}
                            onValueChange={value =>
                              setFormData({ ...formData, timezone: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="UTC">UTC</SelectItem>
                              <SelectItem value="America/New_York">
                                EST (New York)
                              </SelectItem>
                              <SelectItem value="America/Los_Angeles">
                                PST (Los Angeles)
                              </SelectItem>
                              <SelectItem value="Europe/London">
                                GMT (London)
                              </SelectItem>
                              <SelectItem value="Europe/Madrid">
                                CET (Madrid)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description">Descripción *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Descripción detallada del mantenimiento..."
                          rows={3}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="slaImpact"
                          checked={formData.slaImpact}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              slaImpact: e.target.checked,
                            })
                          }
                        />
                        <Label htmlFor="slaImpact">Impacto en SLA</Label>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowMaintenanceForm(false)}
                        >
                          Cancelar
                        </Button>
                        <Button onClick={handleCreateMaintenance}>
                          Crear Mantenimiento
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats && stats.upcomingMaintenances.length > 0 ? (
                  <div className="space-y-4">
                    {stats.upcomingMaintenances.map(maintenance => (
                      <div
                        key={maintenance.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                            <Clock className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {maintenance.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {maintenance.server.name} •{' '}
                              {maintenance.server.client.companyName}
                            </p>
                            <p className="text-sm text-orange-600">
                              {new Date(maintenance.startTime).toLocaleString()}{' '}
                              - {new Date(maintenance.endTime).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={getMaintenanceTypeColor(
                              maintenance.type
                            )}
                          >
                            {formatMaintenanceType(maintenance.type)}
                          </Badge>
                          {maintenance.slaImpact && (
                            <Badge variant="destructive">SLA Impact</Badge>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-muted-foreground">
                    No hay mantenimientos próximos programados
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Historial de Mantenimientos
                </CardTitle>
                <CardDescription>
                  Registro completo de todos los mantenimientos realizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {maintenanceWindows.length > 0 ? (
                  <div className="space-y-4">
                    {maintenanceWindows.map(maintenance => (
                      <div
                        key={maintenance.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                            <Wrench className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {maintenance.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {maintenance.server.name} •{' '}
                              {maintenance.server.client.companyName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(maintenance.startTime).toLocaleString()}{' '}
                              - {new Date(maintenance.endTime).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={getMaintenanceTypeColor(
                              maintenance.type
                            )}
                          >
                            {formatMaintenanceType(maintenance.type)}
                          </Badge>
                          <Badge
                            className={getMaintenanceStatusColor(
                              maintenance.status
                            )}
                          >
                            {formatMaintenanceStatus(maintenance.status)}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-muted-foreground">
                    No hay mantenimientos en el historial
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Planning Tab */}
          <TabsContent value="planning">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Calendario de Mantenimientos
                  </CardTitle>
                  <CardDescription>
                    Vista de calendario de mantenimientos programados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="py-12 text-center">
                    <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-semibold">
                      Calendario de Mantenimientos
                    </h3>
                    <p className="mb-4 text-muted-foreground">
                      Vista de calendario con mantenimientos programados
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Próximamente: Integración con calendario interactivo
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Métricas de Mantenimiento
                  </CardTitle>
                  <CardDescription>
                    Análisis de rendimiento y estadísticas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Tasa de Completación</span>
                        <span className="font-semibold">
                          {stats.completionRate}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Duración Promedio</span>
                        <span className="font-semibold">
                          {formatDuration(stats.avgDuration)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Con Impacto SLA</span>
                        <span className="font-semibold">
                          {stats.slaImpactMaintenances}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cancelados</span>
                        <span className="font-semibold">
                          {stats.cancelledMaintenances}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
