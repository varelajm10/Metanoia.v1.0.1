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
import {
  ArrowLeft,
  Globe,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  FileText,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Shipment {
  id: string
  shipmentNumber: string
  incoterm: string
  countryOrigin: string
  countryDestination: string
  hsCode: string
  customsValue: number
  status: 'PENDING' | 'IN_TRANSIT' | 'CUSTOMS' | 'DELIVERED' | 'DELAYED'
  createdAt: string
}

export default function ForeignTradePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [shipmentsLoading, setShipmentsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchShipments()
    }
  }, [user])

  const fetchShipments = async () => {
    try {
      // Simular datos de envíos
      const mockShipments: Shipment[] = [
        {
          id: '1',
          shipmentNumber: 'SH-001',
          incoterm: 'FOB',
          countryOrigin: 'China',
          countryDestination: 'México',
          hsCode: '8471.30.01',
          customsValue: 15000,
          status: 'IN_TRANSIT',
          createdAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          shipmentNumber: 'SH-002',
          incoterm: 'CIF',
          countryOrigin: 'Estados Unidos',
          countryDestination: 'México',
          hsCode: '8517.12.00',
          customsValue: 8500,
          status: 'CUSTOMS',
          createdAt: '2024-01-20T14:30:00Z',
        },
      ]
      setShipments(mockShipments)
    } catch (error) {
      console.error('Error fetching shipments:', error)
    } finally {
      setShipmentsLoading(false)
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

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      IN_TRANSIT: 'bg-blue-100 text-blue-800',
      CUSTOMS: 'bg-orange-100 text-orange-800',
      DELIVERED: 'bg-green-100 text-green-800',
      DELAYED: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      PENDING: 'Pendiente',
      IN_TRANSIT: 'En Tránsito',
      CUSTOMS: 'En Aduana',
      DELIVERED: 'Entregado',
      DELAYED: 'Retrasado',
    }
    return labels[status] || status
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Dashboard
              </Link>
            </Button>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100">
              <Globe className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Comercio Exterior</h1>
              <p className="text-sm text-muted-foreground">
                Gestión de importaciones y exportaciones
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Envío
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Envíos
              </CardTitle>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold">{shipments.length}</div>
              </CardContent>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En Tránsito
              </CardTitle>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-blue-600">
                  {shipments.filter(s => s.status === 'IN_TRANSIT').length}
                </div>
              </CardContent>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En Aduana
              </CardTitle>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-orange-600">
                  {shipments.filter(s => s.status === 'CUSTOMS').length}
                </div>
              </CardContent>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valor Total
              </CardTitle>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold">
                  $
                  {shipments
                    .reduce((sum, s) => sum + s.customsValue, 0)
                    .toLocaleString()}
                </div>
              </CardContent>
            </CardHeader>
          </Card>
        </div>

        {/* Shipments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Envíos de Comercio Exterior</CardTitle>
            <CardDescription>
              Gestiona todos tus envíos internacionales desde esta vista
            </CardDescription>
          </CardHeader>
          <CardContent>
            {shipmentsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="flex animate-pulse items-center space-x-4"
                  >
                    <div className="h-10 w-10 rounded-full bg-muted"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/4 rounded bg-muted"></div>
                      <div className="h-3 w-1/3 rounded bg-muted"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : shipments.length > 0 ? (
              <div className="space-y-4">
                {shipments.map(shipment => (
                  <div
                    key={shipment.id}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100">
                        <Globe className="h-5 w-5 text-cyan-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {shipment.shipmentNumber}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {shipment.countryOrigin} →{' '}
                          {shipment.countryDestination}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Incoterm: {shipment.incoterm} | HS: {shipment.hsCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="font-semibold">
                          ${shipment.customsValue.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Valor en Aduana
                        </p>
                      </div>
                      <Badge className={getStatusColor(shipment.status)}>
                        {getStatusLabel(shipment.status)}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Globe className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No hay envíos</h3>
                <p className="mb-4 text-muted-foreground">
                  Comienza agregando tu primer envío de comercio exterior
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Envío
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Compliance Alerts */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Alertas de Cumplimiento
              </CardTitle>
              <CardDescription className="text-orange-700">
                Documentos que requieren atención
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Certificados de Origen</span>
                  <Badge
                    variant="outline"
                    className="border-orange-300 text-orange-600"
                  >
                    2 Pendientes
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Facturas Comerciales</span>
                  <Badge
                    variant="outline"
                    className="border-orange-300 text-orange-600"
                  >
                    1 Pendiente
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <CheckCircle className="mr-2 h-5 w-5" />
                Documentos Completos
              </CardTitle>
              <CardDescription className="text-green-700">
                Documentos procesados correctamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Listas de Empaque</span>
                  <Badge
                    variant="outline"
                    className="border-green-300 text-green-600"
                  >
                    5 Completas
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Conocimientos de Embarque</span>
                  <Badge
                    variant="outline"
                    className="border-green-300 text-green-600"
                  >
                    3 Completos
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
