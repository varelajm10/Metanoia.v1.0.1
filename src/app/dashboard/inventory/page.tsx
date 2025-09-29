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
  Package,
  Plus,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface DashboardStats {
  totalProducts: number
  activeProducts: number
  totalSuppliers: number
  activeSuppliers: number
  totalPurchaseOrders: number
  pendingPurchaseOrders: number
  totalStockMovements: number
  lowStockProducts: number
  outOfStockProducts: number
  activeAlerts: number
  totalInventoryValue: number
}

interface Product {
  id: string
  name: string
  sku: string
  stock: number
  minStock: number
  category: string
}

interface Alert {
  id: string
  type: string
  message: string
  product: {
    id: string
    name: string
    sku: string
    stock: number
  }
}

export default function InventoryDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  const [outOfStockProducts, setOutOfStockProducts] = useState<Product[]>([])
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([])
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/inventory/dashboard', {
        headers: {
          'x-tenant-id': user?.tenantId || '',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setLowStockProducts(data.lowStockProducts)
        setOutOfStockProducts(data.outOfStockProducts)
        setActiveAlerts(data.activeAlerts)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'OUT_OF_STOCK':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'LOW_STOCK':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'OVERSTOCK':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'OUT_OF_STOCK':
        return '🚨'
      case 'LOW_STOCK':
        return '⚠️'
      case 'OVERSTOCK':
        return '📦'
      default:
        return 'ℹ️'
    }
  }

  if (loading || statsLoading) {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground">
            Gestión completa de productos, stock y proveedores
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeProducts || 0} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proveedores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSuppliers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeSuppliers || 0} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats?.lowStockProducts || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.outOfStockProducts || 0} agotados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats?.activeAlerts || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Productos con Stock Bajo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              Productos con Stock Bajo
            </CardTitle>
            <CardDescription>
              Productos que requieren reabastecimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay productos con stock bajo
              </p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        SKU: {product.sku} • Stock: {product.stock} / Mín: {product.minStock}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                      Stock Bajo
                    </Badge>
                  </div>
                ))}
                {lowStockProducts.length > 5 && (
                  <Button variant="outline" size="sm" className="w-full">
                    Ver todos ({lowStockProducts.length})
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Productos Agotados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              Productos Agotados
            </CardTitle>
            <CardDescription>
              Productos sin stock disponible
            </CardDescription>
          </CardHeader>
          <CardContent>
            {outOfStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay productos agotados
              </p>
            ) : (
              <div className="space-y-3">
                {outOfStockProducts.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        SKU: {product.sku} • Categoría: {product.category}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-red-600 border-red-200">
                      Agotado
                    </Badge>
                  </div>
                ))}
                {outOfStockProducts.length > 5 && (
                  <Button variant="outline" size="sm" className="w-full">
                    Ver todos ({outOfStockProducts.length})
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alertas Activas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Alertas Activas
          </CardTitle>
          <CardDescription>
            Alertas del sistema que requieren atención
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeAlerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay alertas activas
            </p>
          ) : (
            <div className="space-y-3">
              {activeAlerts.slice(0, 10).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">
                      {getAlertTypeIcon(alert.type)}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-muted-foreground">
                        Producto: {alert.product.name} (SKU: {alert.product.sku})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className={getAlertTypeColor(alert.type)}
                    >
                      {alert.type.replace('_', ' ')}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Resolver
                    </Button>
                  </div>
                </div>
              ))}
              {activeAlerts.length > 10 && (
                <Button variant="outline" size="sm" className="w-full">
                  Ver todas las alertas ({activeAlerts.length})
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Accesos directos a las funciones más utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col">
              <Package className="mb-2 h-6 w-6" />
              <span>Gestionar Productos</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="mb-2 h-6 w-6" />
              <span>Gestionar Proveedores</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <ShoppingCart className="mb-2 h-6 w-6" />
              <span>Órdenes de Compra</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="mb-2 h-6 w-6" />
              <span>Movimientos de Stock</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}