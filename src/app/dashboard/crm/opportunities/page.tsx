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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  ArrowLeft,
  Target,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  TrendingUp,
  Save,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CreateOpportunitySchema,
  CreateOpportunityInput,
  formatOpportunityStage,
  getStageColor,
} from '@/lib/validations/crm'

interface Opportunity {
  id: string
  name: string
  description?: string
  value: number
  stage: string
  probability: number
  closeDate?: string
  leadId: string
  assignedTo?: string
  createdAt: string
  lead: {
    id: string
    firstName: string
    lastName: string
    email: string
    company?: string
  }
  communications?: Array<{
    id: string
    type: string
    content: string
    createdAt: string
  }>
  deals?: Array<{
    id: string
    name: string
    value: number
    status: string
  }>
}

interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  company?: string
}

export default function OpportunitiesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [opportunitiesLoading, setOpportunitiesLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [stageFilter, setStageFilter] = useState('all')
  const [assignedToFilter, setAssignedToFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showOpportunityForm, setShowOpportunityForm] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateOpportunityInput>({
    resolver: zodResolver(CreateOpportunitySchema),
  })

  useEffect(() => {
    if (user) {
      fetchOpportunities()
      fetchLeads()
    }
  }, [user, currentPage, searchTerm, stageFilter, assignedToFilter])

  const fetchOpportunities = async () => {
    try {
      setOpportunitiesLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(stageFilter !== 'all' && { stage: stageFilter }),
        ...(assignedToFilter !== 'all' && { assignedTo: assignedToFilter }),
      })

      const response = await fetch(`/api/crm/opportunities?${params}`)
      const result = await response.json()

      if (result.success) {
        setOpportunities(result.data.opportunities)
        setTotalPages(result.data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error)
    } finally {
      setOpportunitiesLoading(false)
    }
  }

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/crm/leads')
      const result = await response.json()

      if (result.success) {
        setLeads(result.data.leads)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    }
  }

  const onSubmitOpportunity = async (data: CreateOpportunityInput) => {
    try {
      const response = await fetch('/api/crm/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        alert('Oportunidad creada exitosamente')
        setShowOpportunityForm(false)
        reset()
        fetchOpportunities()
      } else {
        alert('Error al crear oportunidad: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating opportunity:', error)
      alert('Error al crear oportunidad')
    }
  }

  if (loading || opportunitiesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Cargando oportunidades...</p>
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
              <Link href="/dashboard/crm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a CRM
              </Link>
            </Button>
            <div>
              <h1 className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-3xl font-bold text-transparent">
                Gestión de Oportunidades
              </h1>
              <p className="text-muted-foreground">
                Administra tus oportunidades de venta
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Dialog
              open={showOpportunityForm}
              onOpenChange={setShowOpportunityForm}
            >
              <DialogTrigger asChild>
                <Button className="btn-primary-gradient">
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Oportunidad
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    Nueva Oportunidad
                  </DialogTitle>
                  <DialogDescription>
                    Complete la información de la oportunidad de venta
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={handleSubmit(onSubmitOpportunity)}
                  className="space-y-6"
                >
                  {/* Información Básica */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Información Básica
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre de la Oportunidad *</Label>
                        <Input
                          id="name"
                          {...register('name')}
                          placeholder="ej: Implementación ERP"
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="value">Valor *</Label>
                        <Input
                          id="value"
                          type="number"
                          step="0.01"
                          {...register('value', { valueAsNumber: true })}
                          placeholder="0"
                        />
                        {errors.value && (
                          <p className="text-sm text-red-500">
                            {errors.value.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="leadId">Lead *</Label>
                        <Select
                          value={watch('leadId')}
                          onValueChange={value => setValue('leadId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar lead" />
                          </SelectTrigger>
                          <SelectContent>
                            {leads.map(lead => (
                              <SelectItem key={lead.id} value={lead.id}>
                                {lead.firstName} {lead.lastName} -{' '}
                                {lead.company || lead.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.leadId && (
                          <p className="text-sm text-red-500">
                            {errors.leadId.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stage">Etapa</Label>
                        <Select
                          value={watch('stage')}
                          onValueChange={value =>
                            setValue('stage', value as any)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar etapa" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PROSPECTING">
                              Prospección
                            </SelectItem>
                            <SelectItem value="QUALIFICATION">
                              Calificación
                            </SelectItem>
                            <SelectItem value="PROPOSAL">Propuesta</SelectItem>
                            <SelectItem value="NEGOTIATION">
                              Negociación
                            </SelectItem>
                            <SelectItem value="CLOSED_WON">
                              Cerrado Ganado
                            </SelectItem>
                            <SelectItem value="CLOSED_LOST">
                              Cerrado Perdido
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="probability">Probabilidad (%)</Label>
                        <Input
                          id="probability"
                          type="number"
                          min="0"
                          max="100"
                          {...register('probability', { valueAsNumber: true })}
                          placeholder="10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="closeDate">
                          Fecha de Cierre Esperada
                        </Label>
                        <Input
                          id="closeDate"
                          type="date"
                          {...register('closeDate')}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="assignedTo">Asignado a</Label>
                        <Input
                          id="assignedTo"
                          {...register('assignedTo')}
                          placeholder="ej: Usuario ID"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      placeholder="Descripción detallada de la oportunidad..."
                      rows={4}
                    />
                  </div>

                  <DialogFooter className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowOpportunityForm(false)}
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
                          Guardar Oportunidad
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
        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nombre, descripción o lead..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por etapa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las etapas</SelectItem>
              <SelectItem value="PROSPECTING">Prospección</SelectItem>
              <SelectItem value="QUALIFICATION">Calificación</SelectItem>
              <SelectItem value="PROPOSAL">Propuesta</SelectItem>
              <SelectItem value="NEGOTIATION">Negociación</SelectItem>
              <SelectItem value="CLOSED_WON">Cerrado Ganado</SelectItem>
              <SelectItem value="CLOSED_LOST">Cerrado Perdido</SelectItem>
            </SelectContent>
          </Select>
          <Select value={assignedToFilter} onValueChange={setAssignedToFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por asignado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="assigned">Asignados</SelectItem>
              <SelectItem value="unassigned">Sin asignar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Opportunities List */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Lista de Oportunidades
            </CardTitle>
            <CardDescription>
              Gestiona todas tus oportunidades de venta
            </CardDescription>
          </CardHeader>
          <CardContent>
            {opportunities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Target className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  No hay oportunidades registradas
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Agrega tu primera oportunidad para comenzar la gestión
                </p>
                <Button onClick={() => setShowOpportunityForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Oportunidad
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {opportunities.map(opportunity => (
                  <div key={opportunity.id} className="rounded-lg border p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                          <Target className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {opportunity.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {opportunity.lead.firstName}{' '}
                            {opportunity.lead.lastName} •{' '}
                            {opportunity.lead.company || opportunity.lead.email}
                          </p>
                          {opportunity.description && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              {opportunity.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            ${opportunity.value.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {opportunity.probability}% probabilidad
                          </p>
                        </div>
                        <Badge className={getStageColor(opportunity.stage)}>
                          {formatOpportunityStage(opportunity.stage)}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Valor</p>
                          <p className="text-sm text-muted-foreground">
                            ${opportunity.value.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Probabilidad</p>
                          <p className="text-sm text-muted-foreground">
                            {opportunity.probability}%
                          </p>
                        </div>
                      </div>

                      {opportunity.closeDate && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              Fecha de Cierre
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(
                                opportunity.closeDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Creado</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(
                              opportunity.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {opportunity.deals && opportunity.deals.length > 0 && (
                      <div className="mt-4 border-t pt-4">
                        <p className="mb-2 text-sm font-medium">
                          Deals ({opportunity.deals.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {opportunity.deals.map(deal => (
                            <Badge key={deal.id} variant="outline">
                              {deal.name} - ${deal.value.toLocaleString()}
                            </Badge>
                          ))}
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
