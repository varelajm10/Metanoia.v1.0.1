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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  Globe,
  MapPin,
  Clock,
  Server,
  TrendingUp,
  Activity,
  AlertTriangle,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
  Eye,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface GeographicStats {
  countries: Array<{ name: string; count: number }>
  regions: Array<{ name: string; count: number }>
  cities: Array<{ name: string; count: number }>
}

interface ServerStats {
  totalServers: number
  onlineServers: number
  offlineServers: number
  maintenanceServers: number
  warningServers: number
  availabilityRate: number
  serversByCountry: Array<{ country: string; _count: { country: number } }>
  serversByRegion: Array<{ region: string; _count: { region: number } }>
  serversByType: Array<{ type: string; _count: { type: number } }>
  recentServers: Array<{
    id: string
    name: string
    country: string
    region: string
    status: string
    client: { companyName: string }
  }>
  upcomingMaintenance: Array<{
    id: string
    name: string
    nextMaintenance: string
    country: string
    client: { companyName: string }
  }>
}

export default function GeographicDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [stats, setStats] = useState<ServerStats | null>(null)
  const [geographicStats, setGeographicStats] =
    useState<GeographicStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (user) {
      fetchStats()
      fetchGeographicStats()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      setStatsLoading(true)
      const response = await fetch('/api/servers/enhanced/stats')
      const result = await response.json()

      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching server stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  const fetchGeographicStats = async () => {
    try {
      const response = await fetch('/api/servers/enhanced/geographic')
      const result = await response.json()

      if (result.success) {
        setGeographicStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching geographic stats:', error)
    }
  }

  if (loading || statsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Cargando dashboard geográfico...</p>
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
                Dashboard Geográfico
              </h1>
              <p className="text-muted-foreground">
                Visión global de servidores por ubicación geográfica
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
                      Total Servidores
                    </p>
                    <p className="text-2xl font-bold">{stats.totalServers}</p>
                    <p className="text-xs text-muted-foreground">
                      En {stats.serversByCountry.length} países
                    </p>
                  </div>
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Servidores Online
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.onlineServers}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stats.availabilityRate}% disponibilidad
                    </p>
                  </div>
                  <Server className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Países Activos
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {stats.serversByCountry.length}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stats.serversByRegion.length} regiones
                    </p>
                  </div>
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Mantenimientos
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {stats.upcomingMaintenance.length}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Próximos 7 días
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
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
            <TabsTrigger value="countries">Países</TabsTrigger>
            <TabsTrigger value="regions">Regiones</TabsTrigger>
            <TabsTrigger value="maintenance">Mantenimientos</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Servidores por País */}
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Servidores por País
                  </CardTitle>
                  <CardDescription>
                    Distribución de servidores por país
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats && stats.serversByCountry.length > 0 ? (
                    <div className="space-y-4">
                      {stats.serversByCountry
                        .slice(0, 8)
                        .map((country, index) => (
                          <div
                            key={country.country}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                <span className="text-sm font-bold text-blue-600">
                                  #{index + 1}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{country.country}</p>
                                <p className="text-sm text-muted-foreground">
                                  {country._count.country} servidor
                                  {country._count.country !== 1 ? 'es' : ''}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="h-2 w-20 rounded-full bg-gray-200">
                                <div
                                  className="h-2 rounded-full bg-blue-600"
                                  style={{
                                    width: `${(country._count.country / stats.serversByCountry[0]._count.country) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="w-8 text-sm font-medium">
                                {country._count.country}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-muted-foreground">
                      No hay datos de países disponibles
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Servidores por Región */}
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-5 w-5" />
                    Servidores por Región
                  </CardTitle>
                  <CardDescription>
                    Distribución por regiones geográficas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats && stats.serversByRegion.length > 0 ? (
                    <div className="space-y-4">
                      {stats.serversByRegion.map((region, index) => (
                        <div
                          key={region.region}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                              <span className="text-sm font-bold text-purple-600">
                                #{index + 1}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{region.region}</p>
                              <p className="text-sm text-muted-foreground">
                                {region._count.region} servidor
                                {region._count.region !== 1 ? 'es' : ''}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-20 rounded-full bg-gray-200">
                              <div
                                className="h-2 rounded-full bg-purple-600"
                                style={{
                                  width: `${(region._count.region / stats.serversByRegion[0]._count.region) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="w-8 text-sm font-medium">
                              {region._count.region}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-muted-foreground">
                      No hay datos de regiones disponibles
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Servidores Recientes */}
              <Card className="card-enhanced lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Servidores Recientes
                  </CardTitle>
                  <CardDescription>
                    Últimos servidores agregados al sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats && stats.recentServers.length > 0 ? (
                    <div className="space-y-4">
                      {stats.recentServers.map(server => (
                        <div
                          key={server.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                              <Server className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{server.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {server.client.companyName} • {server.country},{' '}
                                {server.region}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                server.status === 'ONLINE'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {server.status}
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
                      No hay servidores recientes
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Countries Tab */}
          <TabsContent value="countries">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Distribución por Países
                </CardTitle>
                <CardDescription>
                  Análisis detallado de servidores por país
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats && stats.serversByCountry.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {stats.serversByCountry.map((country, index) => (
                      <Card
                        key={country.country}
                        className="transition-shadow hover:shadow-md"
                      >
                        <CardContent className="p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <h3 className="font-semibold">{country.country}</h3>
                            <Badge variant="outline">#{index + 1}</Badge>
                          </div>
                          <div className="mb-3 flex items-center space-x-2">
                            <Server className="h-4 w-4 text-muted-foreground" />
                            <span className="text-2xl font-bold">
                              {country._count.country}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              servidores
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-blue-600"
                              style={{
                                width: `${(country._count.country / stats.serversByCountry[0]._count.country) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {Math.round(
                              (country._count.country / stats.totalServers) *
                                100
                            )}
                            % del total
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-muted-foreground">
                    No hay datos de países disponibles
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regions Tab */}
          <TabsContent value="regions">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Distribución por Regiones
                </CardTitle>
                <CardDescription>
                  Análisis por regiones geográficas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats && stats.serversByRegion.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {stats.serversByRegion.map((region, index) => (
                      <Card
                        key={region.region}
                        className="transition-shadow hover:shadow-md"
                      >
                        <CardContent className="p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <h3 className="font-semibold">{region.region}</h3>
                            <Badge variant="outline">#{index + 1}</Badge>
                          </div>
                          <div className="mb-3 flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span className="text-2xl font-bold">
                              {region._count.region}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              servidores
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-purple-600"
                              style={{
                                width: `${(region._count.region / stats.serversByRegion[0]._count.region) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {Math.round(
                              (region._count.region / stats.totalServers) * 100
                            )}
                            % del total
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-muted-foreground">
                    No hay datos de regiones disponibles
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Mantenimientos Próximos
                </CardTitle>
                <CardDescription>
                  Servidores con mantenimientos programados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats && stats.upcomingMaintenance.length > 0 ? (
                  <div className="space-y-4">
                    {stats.upcomingMaintenance.map(server => (
                      <div
                        key={server.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                            <Clock className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{server.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {server.client.companyName} • {server.country}
                            </p>
                            <p className="text-sm text-orange-600">
                              Mantenimiento:{' '}
                              {new Date(
                                server.nextMaintenance
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className="bg-orange-100 text-orange-800"
                          >
                            Programado
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
                    No hay mantenimientos próximos programados
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
