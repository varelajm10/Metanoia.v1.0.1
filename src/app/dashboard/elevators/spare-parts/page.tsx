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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Package,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  MapPin,
  Calendar,
  Building2,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

interface SparePart {
  id: string
  partNumber: string
  partName: string
  description?: string
  category: string
  manufacturer?: string
  supplier?: string
  compatibleBrands: string[]
  compatibleModels: string[]
  currentStock: number
  minStock: number
  maxStock?: number
  location?: string
  unitCost: number
  unitPrice: number
  weight?: number
  dimensions?: string
  warranty?: string
  notes?: string
  photo?: string
  lastRestocked?: string
  totalValue: number
}

export default function SparePartsPage() {
  const [spareParts, setSpareParts] = useState<SparePart[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setSpareParts([
        {
          id: '1',
          partNumber: 'CAB-001',
          partName: 'Cable de Tracción 8mm',
          description: 'Cable de acero galvanizado para ascensores de tracción',
          category: 'Cables',
          manufacturer: 'Bridon',
          supplier: 'Cables Industriales S.A.',
          compatibleBrands: ['Otis', 'Schindler', 'KONE'],
          compatibleModels: ['Gen2', 'MonoSpace', '3000'],
          currentStock: 15,
          minStock: 10,
          maxStock: 50,
          location: 'Almacén A - Estante 3',
          unitCost: 250,
          unitPrice: 350,
          weight: 2.5,
          dimensions: '100m x 8mm',
          warranty: '2 años',
          notes: 'Cable de alta resistencia para ascensores de hasta 15 pisos',
          photo: '/photos/cable-traction.jpg',
          lastRestocked: '2025-09-15',
          totalValue: 3750,
        },
        {
          id: '2',
          partNumber: 'MOT-002',
          partName: 'Motor de Tracción 15HP',
          description: 'Motor eléctrico para ascensores de tracción',
          category: 'Motor',
          manufacturer: 'ABB',
          supplier: 'Motores Eléctricos S.A.',
          compatibleBrands: ['Otis', 'Schindler'],
          compatibleModels: ['Gen2', 'MonoSpace'],
          currentStock: 3,
          minStock: 5,
          maxStock: 10,
          location: 'Almacén B - Estante 1',
          unitCost: 15000,
          unitPrice: 20000,
          weight: 45,
          dimensions: '40cm x 30cm x 25cm',
          warranty: '3 años',
          notes: 'Motor de alta eficiencia energética',
          photo: '/photos/motor-traction.jpg',
          lastRestocked: '2025-08-20',
          totalValue: 45000,
        },
        {
          id: '3',
          partNumber: 'PUE-003',
          partName: 'Puerta de Cabina',
          description: 'Puerta automática de cabina para ascensores',
          category: 'Puertas',
          manufacturer: 'KONE',
          supplier: 'Componentes de Ascensores S.A.',
          compatibleBrands: ['KONE', 'ThyssenKrupp'],
          compatibleModels: ['3000', 'Evolution'],
          currentStock: 8,
          minStock: 5,
          maxStock: 15,
          location: 'Almacén C - Estante 2',
          unitCost: 3500,
          unitPrice: 4500,
          weight: 25,
          dimensions: '80cm x 210cm',
          warranty: '2 años',
          notes: 'Puerta con sistema de seguridad integrado',
          photo: '/photos/puerta-cabina.jpg',
          lastRestocked: '2025-09-10',
          totalValue: 28000,
        },
        {
          id: '4',
          partNumber: 'CON-004',
          partName: 'Controlador Principal',
          description: 'Tarjeta de control principal para ascensores',
          category: 'Controles',
          manufacturer: 'Schindler',
          supplier: 'Electrónicos de Ascensores S.A.',
          compatibleBrands: ['Schindler', 'Otis'],
          compatibleModels: ['MonoSpace', 'Gen2'],
          currentStock: 0,
          minStock: 3,
          maxStock: 8,
          location: 'Almacén D - Estante 1',
          unitCost: 8000,
          unitPrice: 12000,
          weight: 1.5,
          dimensions: '20cm x 15cm x 5cm',
          warranty: '1 año',
          notes: 'Controlador con protocolo Modbus integrado',
          photo: '/photos/controlador.jpg',
          lastRestocked: '2025-07-15',
          totalValue: 0,
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStockStatus = (current: number, min: number) => {
    if (current === 0)
      return {
        status: 'out',
        color: 'bg-red-100 text-red-800',
        text: 'Sin Stock',
      }
    if (current <= min)
      return {
        status: 'low',
        color: 'bg-orange-100 text-orange-800',
        text: 'Stock Bajo',
      }
    return {
      status: 'ok',
      color: 'bg-green-100 text-green-800',
      text: 'Stock OK',
    }
  }

  const getStockIcon = (current: number, min: number) => {
    if (current === 0) return <AlertTriangle className="h-4 w-4" />
    if (current <= min) return <AlertTriangle className="h-4 w-4" />
    return <CheckCircle className="h-4 w-4" />
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Motor: 'bg-blue-100 text-blue-800',
      Cables: 'bg-green-100 text-green-800',
      Puertas: 'bg-purple-100 text-purple-800',
      Controles: 'bg-yellow-100 text-yellow-800',
      Seguridad: 'bg-red-100 text-red-800',
      Hidráulica: 'bg-orange-100 text-orange-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const filteredSpareParts = spareParts.filter(part => {
    const matchesSearch =
      part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.compatibleBrands.some(brand =>
        brand.toLowerCase().includes(searchTerm.toLowerCase())
      )

    const matchesCategory =
      categoryFilter === 'all' || part.category === categoryFilter

    let matchesStock = true
    if (stockFilter === 'low') matchesStock = part.currentStock <= part.minStock
    if (stockFilter === 'out') matchesStock = part.currentStock === 0
    if (stockFilter === 'ok') matchesStock = part.currentStock > part.minStock

    return matchesSearch && matchesCategory && matchesStock
  })

  const totalValue = spareParts.reduce((sum, part) => sum + part.totalValue, 0)
  const lowStockCount = spareParts.filter(
    part => part.currentStock <= part.minStock
  ).length
  const outOfStockCount = spareParts.filter(
    part => part.currentStock === 0
  ).length

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
          <h1 className="text-3xl font-bold tracking-tight">Repuestos</h1>
          <p className="text-muted-foreground">
            Gestión de inventario de repuestos y componentes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Reabastecer
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Repuesto
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Repuestos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{spareParts.length}</div>
            <p className="text-xs text-muted-foreground">
              +8% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Inventario actual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {lowStockCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Requieren reabastecimiento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {outOfStockCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Urgente reabastecimiento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  placeholder="Buscar por número de parte, nombre, fabricante o marca compatible..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Categorías</SelectItem>
                <SelectItem value="Motor">Motor</SelectItem>
                <SelectItem value="Cables">Cables</SelectItem>
                <SelectItem value="Puertas">Puertas</SelectItem>
                <SelectItem value="Controles">Controles</SelectItem>
                <SelectItem value="Seguridad">Seguridad</SelectItem>
                <SelectItem value="Hidráulica">Hidráulica</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Estado Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ok">Stock OK</SelectItem>
                <SelectItem value="low">Stock Bajo</SelectItem>
                <SelectItem value="out">Sin Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid gap-4">
        {filteredSpareParts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">
                No se encontraron repuestos
              </h3>
              <p className="mb-4 text-center text-muted-foreground">
                {searchTerm || categoryFilter !== 'all' || stockFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza agregando tu primer repuesto'}
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Repuesto
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredSpareParts.map(part => {
            const stockStatus = getStockStatus(part.currentStock, part.minStock)

            return (
              <Card key={part.id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="text-lg font-semibold">
                          {part.partNumber}
                        </h3>
                        <Badge className={getCategoryColor(part.category)}>
                          {part.category}
                        </Badge>
                        <Badge className={stockStatus.color}>
                          {getStockIcon(part.currentStock, part.minStock)}
                          <span className="ml-1">{stockStatus.text}</span>
                        </Badge>
                      </div>

                      <h4 className="mb-2 text-xl font-medium">
                        {part.partName}
                      </h4>
                      {part.description && (
                        <p className="mb-4 text-muted-foreground">
                          {part.description}
                        </p>
                      )}

                      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Fabricante
                          </p>
                          <p className="font-medium">
                            {part.manufacturer || 'No especificado'}
                          </p>
                          {part.supplier && (
                            <p className="text-sm text-muted-foreground">
                              Proveedor: {part.supplier}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Stock</p>
                          <p className="font-medium">
                            {part.currentStock} unidades
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Mín: {part.minStock} | Máx:{' '}
                            {part.maxStock || 'Sin límite'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Precios
                          </p>
                          <p className="font-medium">
                            Costo: ${part.unitCost.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Venta: ${part.unitPrice.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Ubicación
                          </p>
                          <p className="font-medium">
                            {part.location || 'No especificada'}
                          </p>
                          {part.dimensions && (
                            <p className="text-sm text-muted-foreground">
                              {part.dimensions}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="mb-2 text-sm font-medium">
                          Marcas Compatibles:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {part.compatibleBrands.map((brand, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {brand}
                            </Badge>
                          ))}
                        </div>
                        {part.compatibleModels.length > 0 && (
                          <div className="mt-2">
                            <p className="mb-1 text-sm font-medium">
                              Modelos Compatibles:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {part.compatibleModels.map((model, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {model}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {part.notes && (
                        <div className="mb-4">
                          <p className="mb-1 text-sm font-medium">Notas:</p>
                          <p className="text-sm text-muted-foreground">
                            {part.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Valor total: ${part.totalValue.toLocaleString()}
                          </span>
                        </div>
                        {part.warranty && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Garantía: {part.warranty}</span>
                          </div>
                        )}
                        {part.lastRestocked && (
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span>
                              Último reabastecimiento:{' '}
                              {new Date(
                                part.lastRestocked
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {part.weight && (
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span>Peso: {part.weight}kg</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="ml-4 flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {part.currentStock <= part.minStock && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-orange-600"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {filteredSpareParts.length > 0 && (
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredSpareParts.length} de {spareParts.length}{' '}
              repuestos
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm">
                Siguiente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
