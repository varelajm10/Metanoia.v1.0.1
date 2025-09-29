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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import {
  Building2,
  Wrench,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Users,
  Settings,
  TrendingUp,
  Clock,
  Shield,
} from 'lucide-react'

interface ElevatorStats {
  total: number
  operational: number
  underMaintenance: number
  outOfService: number
  upcomingInspections: number
  expiredCertifications: number
}

interface RecentActivity {
  id: string
  type: 'maintenance' | 'inspection' | 'installation' | 'repair'
  title: string
  description: string
  date: string
  status: 'completed' | 'pending' | 'in_progress' | 'urgent'
  elevator: string
}

export default function ElevatorsDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<ElevatorStats>({
    total: 0,
    operational: 0,
    underMaintenance: 0,
    outOfService: 0,
    upcomingInspections: 0,
    expiredCertifications: 0,
  })

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setStats({
        total: 156,
        operational: 142,
        underMaintenance: 8,
        outOfService: 6,
        upcomingInspections: 23,
        expiredCertifications: 3,
      })

      setRecentActivity([
        {
          id: '1',
          type: 'maintenance',
          title: 'Mantenimiento Preventivo',
          description: 'Torre Centro - Ascensor A',
          date: '2025-09-29',
          status: 'completed',
          elevator: 'ASC-001',
        },
        {
          id: '2',
          type: 'inspection',
          title: 'Inspección Anual',
          description: 'Edificio Norte - Ascensor B',
          date: '2025-09-30',
          status: 'pending',
          elevator: 'ASC-002',
        },
        {
          id: '3',
          type: 'repair',
          title: 'Reparación de Emergencia',
          description: 'Plaza Comercial - Ascensor C',
          date: '2025-09-28',
          status: 'urgent',
          elevator: 'ASC-003',
        },
      ])

      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'urgent':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado'
      case 'pending':
        return 'Pendiente'
      case 'in_progress':
        return 'En Progreso'
      case 'urgent':
        return 'Urgente'
      default:
        return 'Desconocido'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'maintenance':
        return <Wrench className="h-4 w-4" />
      case 'inspection':
        return <Shield className="h-4 w-4" />
      case 'installation':
        return <Building2 className="h-4 w-4" />
      case 'repair':
        return <Settings className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleScheduleMaintenance = () => {
    router.push('/dashboard/elevators/maintenance')
  }

  const handleNewElevator = () => {
    router.push('/dashboard/elevators/new')
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
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard de Ascensores
          </h1>
          <p className="text-muted-foreground">
            Gestión integral de ascensores, mantenimiento e inspecciones
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleScheduleMaintenance}>
            <Calendar className="mr-2 h-4 w-4" />
            Programar Mantenimiento
          </Button>
          <Button onClick={handleNewElevator}>
            <Building2 className="mr-2 h-4 w-4" />
            Nuevo Ascensor
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Ascensores
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.operational}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.operational / stats.total) * 100)}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              En Mantenimiento
            </CardTitle>
            <Wrench className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.underMaintenance}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.underMaintenance / stats.total) * 100)}% del
              total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fuera de Servicio
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.outOfService}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.outOfService / stats.total) * 100)}% del total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Inspecciones Próximas
            </CardTitle>
            <CardDescription>
              Ascensores con inspecciones programadas en los próximos 30 días
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {stats.upcomingInspections}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Requieren atención inmediata
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Certificaciones Vencidas
            </CardTitle>
            <CardDescription>
              Ascensores con certificaciones expiradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {stats.expiredCertifications}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Acción urgente requerida
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="activity">Actividad Reciente</TabsTrigger>
          <TabsTrigger value="maintenance">Mantenimiento</TabsTrigger>
          <TabsTrigger value="inspections">Inspecciones</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Estado de Ascensores</CardTitle>
                <CardDescription>
                  Distribución actual del estado operacional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Operativos</span>
                    </div>
                    <span className="font-medium">{stats.operational}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">En Mantenimiento</span>
                    </div>
                    <span className="font-medium">
                      {stats.underMaintenance}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span className="text-sm">Fuera de Servicio</span>
                    </div>
                    <span className="font-medium">{stats.outOfService}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>
                  Últimas actividades registradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.slice(0, 3).map(activity => (
                    <div key={activity.id} className="flex items-center gap-3">
                      {getActivityIcon(activity.type)}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                      <Badge className={getStatusColor(activity.status)}>
                        {getStatusText(activity.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                Historial completo de actividades del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map(activity => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 rounded-lg border p-4"
                  >
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {activity.date}
                      </p>
                    </div>
                    <Badge className={getStatusColor(activity.status)}>
                      {getStatusText(activity.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Programación de Mantenimiento</CardTitle>
              <CardDescription>
                Mantenimientos programados y pendientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center">
                <Wrench className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">
                  Módulo de Mantenimiento
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Gestión completa de mantenimientos preventivos y correctivos
                </p>
                <Button>Ver Mantenimientos</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inspections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inspecciones Técnicas</CardTitle>
              <CardDescription>
                Inspecciones programadas y certificaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center">
                <Shield className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">
                  Módulo de Inspecciones
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Gestión de inspecciones técnicas y certificaciones
                </p>
                <Button>Ver Inspecciones</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
