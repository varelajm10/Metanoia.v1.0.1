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
  ArrowLeft,
  AlertTriangle,
  Server,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Eye,
  Check,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface ServerAlert {
  id: string
  type: string
  severity: string
  title: string
  description: string
  status: string
  acknowledged: boolean
  resolvedAt?: string
  resolvedBy?: string
  createdAt: string
  server: {
    id: string
    name: string
    ipAddress: string
    client: {
      companyName: string
    }
  }
}

export default function ServerAlertsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [alerts, setAlerts] = useState<ServerAlert[]>([])
  const [alertsLoading, setAlertsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (user) {
      fetchAlerts()
    }
  }, [user, currentPage, searchTerm, statusFilter, severityFilter])

  const fetchAlerts = async () => {
    try {
      setAlertsLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(severityFilter !== 'all' && { severity: severityFilter }),
      })

      const response = await fetch(`/api/servers/alerts?${params}`)
      const result = await response.json()

      if (result.success) {
        setAlerts(result.data.alerts)
        setTotalPages(result.data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching alerts:', error)
    } finally {
      setAlertsLoading(false)
    }
  }

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const response = await fetch(
        `/api/servers/alerts/${alertId}/acknowledge`,
        {
          method: 'POST',
        }
      )

      const result = await response.json()

      if (result.success) {
        alert('Alerta reconocida exitosamente')
        fetchAlerts()
      } else {
        alert('Error al reconocer alerta: ' + result.error)
      }
    } catch (error) {
      console.error('Error acknowledging alert:', error)
      alert('Error al reconocer alerta')
    }
  }

  const resolveAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/servers/alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resolvedBy: user?.firstName || 'Usuario' }),
      })

      const result = await response.json()

      if (result.success) {
        alert('Alerta resuelta exitosamente')
        fetchAlerts()
      } else {
        alert('Error al resolver alerta: ' + result.error)
      }
    } catch (error) {
      console.error('Error resolving alert:', error)
      alert('Error al resolver alerta')
    }
  }

  const getSeverityColor = (severity: string) => {
    const colors: { [key: string]: string } = {
      LOW: 'bg-blue-100 text-blue-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-orange-100 text-orange-800',
      CRITICAL: 'bg-red-100 text-red-800',
    }
    return colors[severity] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      ACTIVE: 'bg-red-100 text-red-800',
      ACKNOWLEDGED: 'bg-yellow-100 text-yellow-800',
      RESOLVED: 'bg-green-100 text-green-800',
      DISMISSED: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatSeverity = (severity: string) => {
    const severities: { [key: string]: string } = {
      LOW: 'Baja',
      MEDIUM: 'Media',
      HIGH: 'Alta',
      CRITICAL: 'Crítica',
    }
    return severities[severity] || severity
  }

  const formatStatus = (status: string) => {
    const statuses: { [key: string]: string } = {
      ACTIVE: 'Activa',
      ACKNOWLEDGED: 'Reconocida',
      RESOLVED: 'Resuelta',
      DISMISSED: 'Descartada',
    }
    return statuses[status] || status
  }

  const formatAlertType = (type: string) => {
    const types: { [key: string]: string } = {
      CPU_HIGH: 'CPU Alto',
      MEMORY_HIGH: 'Memoria Alta',
      DISK_FULL: 'Disco Lleno',
      NETWORK_DOWN: 'Red Caída',
      SERVICE_DOWN: 'Servicio Caído',
      CERTIFICATE_EXPIRING: 'Certificado Expirando',
      BACKUP_FAILED: 'Backup Fallido',
      SECURITY_BREACH: 'Brecha de Seguridad',
      PERFORMANCE_DEGRADED: 'Rendimiento Degradado',
    }
    return types[type] || type
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'CPU_HIGH':
      case 'MEMORY_HIGH':
      case 'DISK_FULL':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'NETWORK_DOWN':
      case 'SERVICE_DOWN':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'CERTIFICATE_EXPIRING':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'SECURITY_BREACH':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  if (loading || alertsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Cargando alertas...</p>
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
              <h1 className="bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-3xl font-bold text-transparent">
                Alertas de Servidores
              </h1>
              <p className="text-muted-foreground">
                Monitorea y gestiona las alertas del sistema
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
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="card-enhanced">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Alertas Activas
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {alerts.filter(a => a.status === 'ACTIVE').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Críticas</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {alerts.filter(a => a.severity === 'CRITICAL').length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reconocidas</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {alerts.filter(a => a.status === 'ACKNOWLEDGED').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resueltas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {alerts.filter(a => a.status === 'RESOLVED').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Buscar por título, descripción o servidor..."
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
              <SelectItem value="ACTIVE">Activa</SelectItem>
              <SelectItem value="ACKNOWLEDGED">Reconocida</SelectItem>
              <SelectItem value="RESOLVED">Resuelta</SelectItem>
              <SelectItem value="DISMISSED">Descartada</SelectItem>
            </SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por severidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las severidades</SelectItem>
              <SelectItem value="LOW">Baja</SelectItem>
              <SelectItem value="MEDIUM">Media</SelectItem>
              <SelectItem value="HIGH">Alta</SelectItem>
              <SelectItem value="CRITICAL">Crítica</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Alerts List */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Lista de Alertas
            </CardTitle>
            <CardDescription>
              Gestiona todas las alertas del sistema de servidores
            </CardDescription>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="mb-4 h-12 w-12 text-green-500" />
                <h3 className="mb-2 text-lg font-semibold">¡No hay alertas!</h3>
                <p className="mb-4 text-muted-foreground">
                  Todos los servidores están funcionando correctamente
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map(alert => (
                  <div key={alert.id} className="rounded-lg border p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                          <div className="mb-2 flex items-center space-x-2">
                            <h3 className="font-semibold">{alert.title}</h3>
                            <Badge className={getSeverityColor(alert.severity)}>
                              {formatSeverity(alert.severity)}
                            </Badge>
                            <Badge className={getStatusColor(alert.status)}>
                              {formatStatus(alert.status)}
                            </Badge>
                          </div>
                          <p className="mb-3 text-sm text-muted-foreground">
                            {alert.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Server className="h-4 w-4" />
                              <span>
                                {alert.server.name} ({alert.server.ipAddress})
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>
                                Cliente: {alert.server.client.companyName}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                {new Date(alert.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {alert.status === 'ACTIVE' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => acknowledgeAlert(alert.id)}
                              className="text-yellow-600 hover:text-yellow-700"
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Reconocer
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => resolveAlert(alert.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Resolver
                            </Button>
                          </>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {alert.resolvedAt && (
                      <div className="mt-4 border-t pt-4">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>
                            Resuelta el{' '}
                            {new Date(alert.resolvedAt).toLocaleString()}
                          </span>
                          {alert.resolvedBy && (
                            <span>por {alert.resolvedBy}</span>
                          )}
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
