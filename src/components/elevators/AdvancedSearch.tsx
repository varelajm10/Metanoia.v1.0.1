'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Filter,
  X,
  Calendar,
  Building2,
  Wrench,
  Shield,
  Users,
  Package,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

interface SearchFilters {
  query: string
  entity: string
  dateRange: {
    start: string
    end: string
  }
  status: string[]
  priority: string[]
  type: string[]
  elevator: string[]
  technician: string[]
  client: string[]
}

interface SearchResult {
  id: string
  type: string
  title: string
  description: string
  entity: string
  metadata: any
  score: number
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => Promise<SearchResult[]>
  onResultClick: (result: SearchResult) => void
  loading?: boolean
}

export default function AdvancedSearch({
  onSearch,
  onResultClick,
  loading = false,
}: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    entity: 'all',
    dateRange: { start: '', end: '' },
    status: [],
    priority: [],
    type: [],
    elevator: [],
    technician: [],
    client: [],
  })

  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const entityOptions = [
    { value: 'all', label: 'Todos', icon: Search },
    { value: 'elevators', label: 'Ascensores', icon: Building2 },
    { value: 'maintenance', label: 'Mantenimiento', icon: Wrench },
    { value: 'inspections', label: 'Inspecciones', icon: Shield },
    { value: 'technicians', label: 'Técnicos', icon: Users },
    { value: 'clients', label: 'Clientes', icon: Users },
    { value: 'spare-parts', label: 'Repuestos', icon: Package },
    { value: 'work-orders', label: 'Órdenes', icon: FileText },
  ]

  const statusOptions = [
    'OPERATIONAL',
    'OUT_OF_SERVICE',
    'UNDER_MAINTENANCE',
    'UNDER_INSPECTION',
    'SCHEDULED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'ACTIVE',
    'INACTIVE',
    'PROSPECTIVE',
    'SUSPENDED',
  ]

  const priorityOptions = ['LOW', 'NORMAL', 'HIGH', 'URGENT', 'EMERGENCY']

  const typeOptions = [
    'PREVENTIVE',
    'CORRECTIVE',
    'EMERGENCY',
    'INSPECTION',
    'MODERNIZATION',
    'PERIODIC',
    'ANNUAL',
    'POST_INSTALLATION',
    'POST_MODERNIZATION',
    'SPECIAL',
  ]

  const handleSearch = async () => {
    if (!filters.query.trim()) return

    try {
      setIsSearching(true)
      const searchResults = await onSearch(filters)
      setResults(searchResults)
      setHasSearched(true)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleArrayFilterChange = (
    key: keyof SearchFilters,
    value: string,
    checked: boolean
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: checked
        ? [...(prev[key] as string[]), value]
        : (prev[key] as string[]).filter(item => item !== value),
    }))
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      entity: 'all',
      dateRange: { start: '', end: '' },
      status: [],
      priority: [],
      type: [],
      elevator: [],
      technician: [],
      client: [],
    })
    setResults([])
    setHasSearched(false)
  }

  const getEntityIcon = (entity: string) => {
    const option = entityOptions.find(opt => opt.value === entity)
    return option?.icon || Search
  }

  const getEntityLabel = (entity: string) => {
    const option = entityOptions.find(opt => opt.value === entity)
    return option?.label || 'Desconocido'
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'elevator':
        return <Building2 className="h-4 w-4" />
      case 'maintenance':
        return <Wrench className="h-4 w-4" />
      case 'inspection':
        return <Shield className="h-4 w-4" />
      case 'technician':
        return <Users className="h-4 w-4" />
      case 'client':
        return <Users className="h-4 w-4" />
      case 'spare-part':
        return <Package className="h-4 w-4" />
      case 'work-order':
        return <FileText className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    if (score >= 40) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  const activeFiltersCount = [
    filters.entity !== 'all',
    filters.dateRange.start || filters.dateRange.end,
    filters.status.length > 0,
    filters.priority.length > 0,
    filters.type.length > 0,
    filters.elevator.length > 0,
    filters.technician.length > 0,
    filters.client.length > 0,
  ].filter(Boolean).length

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Búsqueda Avanzada
          </CardTitle>
          <CardDescription>
            Busca en todos los módulos del sistema de ascensores
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Main Search */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search-query">Término de Búsqueda</Label>
                <Input
                  id="search-query"
                  value={filters.query}
                  onChange={e => handleFilterChange('query', e.target.value)}
                  placeholder="Buscar ascensores, mantenimientos, técnicos..."
                  className="h-10"
                />
              </div>
              <div className="w-48">
                <Label htmlFor="search-entity">Entidad</Label>
                <Select
                  value={filters.entity}
                  onValueChange={value => handleFilterChange('entity', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {entityOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  disabled={!filters.query.trim() || isSearching || loading}
                  className="h-10"
                >
                  {isSearching ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  Buscar
                </Button>
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtros Avanzados
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
                {showAdvanced ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>

              {activeFiltersCount > 0 && (
                <Button variant="ghost" onClick={clearFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Limpiar Filtros
                </Button>
              )}
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
              <div className="grid grid-cols-1 gap-4 rounded-lg border bg-gray-50 p-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Date Range */}
                <div className="space-y-2">
                  <Label>Rango de Fechas</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={e =>
                        handleFilterChange('dateRange', {
                          ...filters.dateRange,
                          start: e.target.value,
                        })
                      }
                      placeholder="Desde"
                    />
                    <Input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={e =>
                        handleFilterChange('dateRange', {
                          ...filters.dateRange,
                          end: e.target.value,
                        })
                      }
                      placeholder="Hasta"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <div className="max-h-32 space-y-1 overflow-y-auto">
                    {statusOptions.map(status => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={filters.status.includes(status)}
                          onCheckedChange={checked =>
                            handleArrayFilterChange(
                              'status',
                              status,
                              checked as boolean
                            )
                          }
                        />
                        <Label htmlFor={`status-${status}`} className="text-sm">
                          {status}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Priority Filter */}
                <div className="space-y-2">
                  <Label>Prioridad</Label>
                  <div className="space-y-1">
                    {priorityOptions.map(priority => (
                      <div
                        key={priority}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`priority-${priority}`}
                          checked={filters.priority.includes(priority)}
                          onCheckedChange={checked =>
                            handleArrayFilterChange(
                              'priority',
                              priority,
                              checked as boolean
                            )
                          }
                        />
                        <Label
                          htmlFor={`priority-${priority}`}
                          className="text-sm"
                        >
                          {priority}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <div className="max-h-32 space-y-1 overflow-y-auto">
                    {typeOptions.map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={filters.type.includes(type)}
                          onCheckedChange={checked =>
                            handleArrayFilterChange(
                              'type',
                              type,
                              checked as boolean
                            )
                          }
                        />
                        <Label htmlFor={`type-${type}`} className="text-sm">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Resultados de Búsqueda
              <Badge variant="secondary">{results.length} resultados</Badge>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {results.length === 0 ? (
              <div className="py-8 text-center">
                <Search className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium">
                  No se encontraron resultados
                </h3>
                <p className="text-gray-500">
                  Intenta ajustar los términos de búsqueda o filtros
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map(result => (
                  <div
                    key={result.id}
                    onClick={() => onResultClick(result)}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="mt-1 flex-shrink-0">
                      {getResultIcon(result.type)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-start justify-between">
                        <h4 className="truncate font-medium">{result.title}</h4>
                        <Badge className={getScoreColor(result.score)}>
                          {result.score}% match
                        </Badge>
                      </div>

                      <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                        {result.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          {getEntityIcon(result.entity)}
                          {getEntityLabel(result.entity)}
                        </span>
                        {result.metadata?.date && (
                          <span>
                            {new Date(
                              result.metadata.date
                            ).toLocaleDateString()}
                          </span>
                        )}
                        {result.metadata?.status && (
                          <span>Estado: {result.metadata.status}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
