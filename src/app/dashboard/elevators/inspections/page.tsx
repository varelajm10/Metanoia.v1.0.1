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
  Shield,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Building2,
  User,
} from 'lucide-react'

interface Inspection {
  id: string
  inspectionNumber: string
  inspectionType:
    | 'PERIODIC'
    | 'ANNUAL'
    | 'POST_INSTALLATION'
    | 'POST_MODERNIZATION'
    | 'SPECIAL'
    | 'EMERGENCY'
  scheduledDate: string
  inspectionDate?: string
  expiryDate?: string
  inspector: string
  inspectorLicense?: string
  regulatoryBody?: string
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  result?: 'PASSED' | 'FAILED' | 'CONDITIONAL' | 'PENDING_CORRECTIONS'
  score?: number
  findings?: string
  defects?: any
  recommendations?: string
  correctiveActions?: string
  certificateNumber?: string
  certificateIssued: boolean
  certificateUrl?: string
  elevator: {
    id: string
    serialNumber: string
    model: string
    brand: string
    buildingName: string
    client: {
      name: string
    }
  }
}

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setInspections([
        {
          id: '1',
          inspectionNumber: 'INS-2025-001',
          inspectionType: 'ANNUAL',
          scheduledDate: '2025-09-15',
          inspectionDate: '2025-09-15',
          expiryDate: '2026-09-15',
          inspector: 'Ing. Carlos Mendoza',
          inspectorLicense: 'INSP-001-2025',
          regulatoryBody: 'Protección Civil',
          status: 'COMPLETED',
          result: 'PASSED',
          score: 95,
          findings:
            'Inspección satisfactoria, todos los sistemas funcionando correctamente',
          defects: null,
          recommendations: 'Continuar con mantenimiento preventivo regular',
          correctiveActions: null,
          certificateNumber: 'CERT-2025-001',
          certificateIssued: true,
          certificateUrl: '/certificates/cert-2025-001.pdf',
          elevator: {
            id: '1',
            serialNumber: 'ASC-001',
            model: 'Gen2',
            brand: 'Otis',
            buildingName: 'Torre Centro',
            client: {
              name: 'Empresa Constructora ABC',
            },
          },
        },
        {
          id: '2',
          inspectionNumber: 'INS-2025-002',
          inspectionType: 'PERIODIC',
          scheduledDate: '2025-09-20',
          inspectionDate: '2025-09-20',
          expiryDate: '2025-12-20',
          inspector: 'Ing. María García',
          inspectorLicense: 'INSP-002-2025',
          regulatoryBody: 'NOM-053',
          status: 'COMPLETED',
          result: 'CONDITIONAL',
          score: 78,
          findings:
            'Se encontraron algunas deficiencias menores en el sistema de frenos',
          defects: {
            'Sistema de frenos': 'Ajuste requerido en tensión de cables',
            Lubricación: 'Nivel de aceite bajo en motor',
          },
          recommendations:
            'Realizar ajustes en sistema de frenos y lubricación',
          correctiveActions:
            'Ajustar tensión de cables de freno y rellenar aceite del motor',
          certificateNumber: 'CERT-2025-002',
          certificateIssued: true,
          certificateUrl: '/certificates/cert-2025-002.pdf',
          elevator: {
            id: '2',
            serialNumber: 'ASC-002',
            model: 'MonoSpace',
            brand: 'Schindler',
            buildingName: 'Edificio Norte',
            client: {
              name: 'Juan Pérez',
            },
          },
        },
        {
          id: '3',
          inspectionNumber: 'INS-2025-003',
          inspectionType: 'ANNUAL',
          scheduledDate: '2025-10-10',
          inspectionDate: undefined,
          expiryDate: undefined,
          inspector: 'Ing. Luis Rodríguez',
          inspectorLicense: 'INSP-003-2025',
          regulatoryBody: 'Protección Civil',
          status: 'SCHEDULED',
          result: undefined,
          score: undefined,
          findings: undefined,
          defects: undefined,
          recommendations: undefined,
          correctiveActions: undefined,
          certificateNumber: undefined,
          certificateIssued: false,
          certificateUrl: undefined,
          elevator: {
            id: '3',
            serialNumber: 'ASC-003',
            model: 'KONE 3000',
            brand: 'KONE',
            buildingName: 'Plaza Comercial',
            client: {
              name: 'Centro Comercial XYZ',
            },
          },
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'Programada'
      case 'IN_PROGRESS':
        return 'En Progreso'
      case 'COMPLETED':
        return 'Completada'
      case 'FAILED':
        return 'Fallida'
      case 'CANCELLED':
        return 'Cancelada'
      default:
        return 'Desconocido'
    }
  }

  const getResultColor = (result?: string) => {
    switch (result) {
      case 'PASSED':
        return 'bg-green-100 text-green-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'CONDITIONAL':
        return 'bg-yellow-100 text-yellow-800'
      case 'PENDING_CORRECTIONS':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getResultText = (result?: string) => {
    switch (result) {
      case 'PASSED':
        return 'Aprobada'
      case 'FAILED':
        return 'Reprobada'
      case 'CONDITIONAL':
        return 'Condicional'
      case 'PENDING_CORRECTIONS':
        return 'Pendiente Correcciones'
      default:
        return 'Sin Resultado'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'PERIODIC':
        return 'Periódica'
      case 'ANNUAL':
        return 'Anual'
      case 'POST_INSTALLATION':
        return 'Post-Instalación'
      case 'POST_MODERNIZATION':
        return 'Post-Modernización'
      case 'SPECIAL':
        return 'Especial'
      case 'EMERGENCY':
        return 'Emergencia'
      default:
        return 'Desconocido'
    }
  }

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-600'
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch =
      inspection.inspectionNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      inspection.inspector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.elevator.serialNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      inspection.elevator.buildingName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      inspection.elevator.client.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || inspection.status === statusFilter
    const matchesType =
      typeFilter === 'all' || inspection.inspectionType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

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
            Inspecciones Técnicas
          </h1>
          <p className="text-muted-foreground">
            Gestión de inspecciones técnicas y certificaciones
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Programar Inspección
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Inspección
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inspecciones
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inspections.length}</div>
            <p className="text-xs text-muted-foreground">
              +10% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {inspections.filter(i => i.status === 'COMPLETED').length}
            </div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programadas</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {inspections.filter(i => i.status === 'SCHEDULED').length}
            </div>
            <p className="text-xs text-muted-foreground">Próximos 30 días</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasa de Aprobación
            </CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(
                (inspections.filter(i => i.result === 'PASSED').length /
                  inspections.filter(i => i.status === 'COMPLETED').length) *
                  100
              ) || 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Primera vez</p>
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
                  placeholder="Buscar por número de inspección, inspector, ascensor, edificio o cliente..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="SCHEDULED">Programada</SelectItem>
                <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                <SelectItem value="COMPLETED">Completada</SelectItem>
                <SelectItem value="FAILED">Fallida</SelectItem>
                <SelectItem value="CANCELLED">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Tipos</SelectItem>
                <SelectItem value="PERIODIC">Periódica</SelectItem>
                <SelectItem value="ANNUAL">Anual</SelectItem>
                <SelectItem value="POST_INSTALLATION">
                  Post-Instalación
                </SelectItem>
                <SelectItem value="POST_MODERNIZATION">
                  Post-Modernización
                </SelectItem>
                <SelectItem value="SPECIAL">Especial</SelectItem>
                <SelectItem value="EMERGENCY">Emergencia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid gap-4">
        {filteredInspections.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Shield className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">
                No se encontraron inspecciones
              </h3>
              <p className="mb-4 text-center text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza agregando tu primera inspección'}
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Inspección
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredInspections.map(inspection => (
            <Card
              key={inspection.id}
              className="transition-shadow hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-lg font-semibold">
                        {inspection.inspectionNumber}
                      </h3>
                      <Badge className={getStatusColor(inspection.status)}>
                        {getStatusText(inspection.status)}
                      </Badge>
                      {inspection.result && (
                        <Badge className={getResultColor(inspection.result)}>
                          {getResultText(inspection.result)}
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {getTypeText(inspection.inspectionType)}
                      </Badge>
                    </div>

                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Ascensor
                        </p>
                        <p className="font-medium">
                          {inspection.elevator.serialNumber}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {inspection.elevator.brand}{' '}
                          {inspection.elevator.model}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Ubicación
                        </p>
                        <p className="font-medium">
                          {inspection.elevator.buildingName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {inspection.elevator.client.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Inspector
                        </p>
                        <p className="font-medium">{inspection.inspector}</p>
                        {inspection.inspectorLicense && (
                          <p className="text-sm text-muted-foreground">
                            Lic: {inspection.inspectorLicense}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fechas</p>
                        <p className="font-medium">
                          Programada:{' '}
                          {new Date(
                            inspection.scheduledDate
                          ).toLocaleDateString()}
                        </p>
                        {inspection.inspectionDate && (
                          <p className="text-sm text-muted-foreground">
                            Realizada:{' '}
                            {new Date(
                              inspection.inspectionDate
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {inspection.score && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            Puntuación:
                          </span>
                          <span
                            className={`font-bold ${getScoreColor(inspection.score)}`}
                          >
                            {inspection.score}/100
                          </span>
                        </div>
                      </div>
                    )}

                    {inspection.findings && (
                      <div className="mb-4">
                        <p className="mb-1 text-sm font-medium">Hallazgos:</p>
                        <p className="text-sm text-muted-foreground">
                          {inspection.findings}
                        </p>
                      </div>
                    )}

                    {inspection.defects && (
                      <div className="mb-4">
                        <p className="mb-1 text-sm font-medium">
                          Defectos Encontrados:
                        </p>
                        <div className="text-sm text-muted-foreground">
                          {Object.entries(inspection.defects).map(
                            ([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span>{key}:</span>
                                <span className="text-red-600">
                                  {value as string}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {inspection.recommendations && (
                      <div className="mb-4">
                        <p className="mb-1 text-sm font-medium">
                          Recomendaciones:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {inspection.recommendations}
                        </p>
                      </div>
                    )}

                    {inspection.correctiveActions && (
                      <div className="mb-4">
                        <p className="mb-1 text-sm font-medium">
                          Acciones Correctivas:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {inspection.correctiveActions}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-6 text-sm">
                      {inspection.regulatoryBody && (
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span>{inspection.regulatoryBody}</span>
                        </div>
                      )}
                      {inspection.certificateIssued && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">
                            Certificado Emitido
                          </span>
                        </div>
                      )}
                      {inspection.expiryDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Vence:{' '}
                            {new Date(
                              inspection.expiryDate
                            ).toLocaleDateString()}
                          </span>
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
                    {inspection.certificateUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600"
                      >
                        <FileText className="h-4 w-4" />
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
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredInspections.length > 0 && (
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredInspections.length} de {inspections.length}{' '}
              inspecciones
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
