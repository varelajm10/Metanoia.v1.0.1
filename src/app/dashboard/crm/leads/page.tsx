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
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
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
  CreateLeadSchema,
  CreateLeadInput,
  formatSource,
  formatStatus,
  formatLeadPriority,
  getPriorityColor,
  getStatusColor,
} from '@/lib/validations/crm'

interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  jobTitle?: string
  industry?: string
  source: string
  status: string
  score: number
  priority: string
  notes?: string
  assignedTo?: string
  lastContact?: string
  nextFollowUp?: string
  createdAt: string
  opportunities?: Array<{
    id: string
    name: string
    value: number
    stage: string
  }>
  communications?: Array<{
    id: string
    type: string
    content: string
    createdAt: string
  }>
}

export default function LeadsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [leads, setLeads] = useState<Lead[]>([])
  const [leadsLoading, setLeadsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showLeadForm, setShowLeadForm] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLeadInput>({
    resolver: zodResolver(CreateLeadSchema),
  })

  useEffect(() => {
    if (user) {
      fetchLeads()
    }
  }, [
    user,
    currentPage,
    searchTerm,
    statusFilter,
    sourceFilter,
    priorityFilter,
  ])

  const fetchLeads = async () => {
    try {
      setLeadsLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(sourceFilter !== 'all' && { source: sourceFilter }),
        ...(priorityFilter !== 'all' && { priority: priorityFilter }),
      })

      const response = await fetch(`/api/crm/leads?${params}`)
      const result = await response.json()

      if (result.success) {
        setLeads(result.data.leads)
        setTotalPages(result.data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLeadsLoading(false)
    }
  }

  const onSubmitLead = async (data: CreateLeadInput) => {
    try {
      const response = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        alert('Lead creado exitosamente')
        setShowLeadForm(false)
        reset()
        fetchLeads()
      } else {
        alert('Error al crear lead: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating lead:', error)
      alert('Error al crear lead')
    }
  }

  if (loading || leadsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Cargando leads...</p>
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
                Gestión de Leads
              </h1>
              <p className="text-muted-foreground">
                Administra y convierte tus prospectos en clientes
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Dialog open={showLeadForm} onOpenChange={setShowLeadForm}>
              <DialogTrigger asChild>
                <Button className="btn-primary-gradient">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Lead
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Nuevo Lead
                  </DialogTitle>
                  <DialogDescription>
                    Complete la información del prospecto
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={handleSubmit(onSubmitLead)}
                  className="space-y-6"
                >
                  {/* Información Personal */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Información Personal
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nombre *</Label>
                        <Input
                          id="firstName"
                          {...register('firstName')}
                          placeholder="ej: Juan"
                        />
                        {errors.firstName && (
                          <p className="text-sm text-red-500">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Apellido *</Label>
                        <Input
                          id="lastName"
                          {...register('lastName')}
                          placeholder="ej: Pérez"
                        />
                        {errors.lastName && (
                          <p className="text-sm text-red-500">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register('email')}
                          placeholder="ej: juan.perez@empresa.com"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          {...register('phone')}
                          placeholder="ej: +57 300 123 4567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Información Profesional */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Información Profesional
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="company">Empresa</Label>
                        <Input
                          id="company"
                          {...register('company')}
                          placeholder="ej: Empresa ABC S.A.S"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Cargo</Label>
                        <Input
                          id="jobTitle"
                          {...register('jobTitle')}
                          placeholder="ej: Gerente de Ventas"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="industry">Industria</Label>
                        <Input
                          id="industry"
                          {...register('industry')}
                          placeholder="ej: Tecnología"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="source">Fuente</Label>
                        <Select
                          value={watch('source')}
                          onValueChange={value =>
                            setValue('source', value as any)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar fuente" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WEBSITE">Sitio Web</SelectItem>
                            <SelectItem value="REFERRAL">Referido</SelectItem>
                            <SelectItem value="SOCIAL_MEDIA">
                              Redes Sociales
                            </SelectItem>
                            <SelectItem value="EMAIL_MARKETING">
                              Email Marketing
                            </SelectItem>
                            <SelectItem value="EVENT">Evento</SelectItem>
                            <SelectItem value="COLD_CALL">
                              Llamada Fría
                            </SelectItem>
                            <SelectItem value="ADVERTISEMENT">
                              Publicidad
                            </SelectItem>
                            <SelectItem value="PARTNER">Socio</SelectItem>
                            <SelectItem value="OTHER">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Clasificación */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Clasificación</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="status">Estado</Label>
                        <Select
                          value={watch('status')}
                          onValueChange={value =>
                            setValue('status', value as any)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NEW">Nuevo</SelectItem>
                            <SelectItem value="CONTACTED">
                              Contactado
                            </SelectItem>
                            <SelectItem value="QUALIFIED">
                              Calificado
                            </SelectItem>
                            <SelectItem value="PROPOSAL_SENT">
                              Propuesta Enviada
                            </SelectItem>
                            <SelectItem value="NEGOTIATING">
                              Negociando
                            </SelectItem>
                            <SelectItem value="CLOSED_WON">
                              Cerrado Ganado
                            </SelectItem>
                            <SelectItem value="CLOSED_LOST">
                              Cerrado Perdido
                            </SelectItem>
                            <SelectItem value="NURTURING">Nutrición</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority">Prioridad</Label>
                        <Select
                          value={watch('priority')}
                          onValueChange={value =>
                            setValue('priority', value as any)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar prioridad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LOW">Baja</SelectItem>
                            <SelectItem value="MEDIUM">Media</SelectItem>
                            <SelectItem value="HIGH">Alta</SelectItem>
                            <SelectItem value="URGENT">Urgente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="score">Score (0-100)</Label>
                        <Input
                          id="score"
                          type="number"
                          min="0"
                          max="100"
                          {...register('score', { valueAsNumber: true })}
                          placeholder="0"
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

                  {/* Fechas de Seguimiento */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Seguimiento</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="lastContact">Último Contacto</Label>
                        <Input
                          id="lastContact"
                          type="datetime-local"
                          {...register('lastContact')}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nextFollowUp">
                          Próximo Seguimiento
                        </Label>
                        <Input
                          id="nextFollowUp"
                          type="datetime-local"
                          {...register('nextFollowUp')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notas */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas</Label>
                    <Textarea
                      id="notes"
                      {...register('notes')}
                      placeholder="Notas importantes sobre el lead..."
                      rows={3}
                    />
                  </div>

                  <DialogFooter className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowLeadForm(false)}
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
                          Guardar Lead
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
              placeholder="Buscar por nombre, email, empresa..."
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
              <SelectItem value="NEW">Nuevo</SelectItem>
              <SelectItem value="CONTACTED">Contactado</SelectItem>
              <SelectItem value="QUALIFIED">Calificado</SelectItem>
              <SelectItem value="PROPOSAL_SENT">Propuesta Enviada</SelectItem>
              <SelectItem value="NEGOTIATING">Negociando</SelectItem>
              <SelectItem value="CLOSED_WON">Cerrado Ganado</SelectItem>
              <SelectItem value="CLOSED_LOST">Cerrado Perdido</SelectItem>
              <SelectItem value="NURTURING">Nutrición</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por fuente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las fuentes</SelectItem>
              <SelectItem value="WEBSITE">Sitio Web</SelectItem>
              <SelectItem value="REFERRAL">Referido</SelectItem>
              <SelectItem value="SOCIAL_MEDIA">Redes Sociales</SelectItem>
              <SelectItem value="EMAIL_MARKETING">Email Marketing</SelectItem>
              <SelectItem value="EVENT">Evento</SelectItem>
              <SelectItem value="COLD_CALL">Llamada Fría</SelectItem>
              <SelectItem value="ADVERTISEMENT">Publicidad</SelectItem>
              <SelectItem value="PARTNER">Socio</SelectItem>
              <SelectItem value="OTHER">Otro</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las prioridades</SelectItem>
              <SelectItem value="LOW">Baja</SelectItem>
              <SelectItem value="MEDIUM">Media</SelectItem>
              <SelectItem value="HIGH">Alta</SelectItem>
              <SelectItem value="URGENT">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Leads List */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Lista de Leads
            </CardTitle>
            <CardDescription>
              Gestiona todos tus prospectos y oportunidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  No hay leads registrados
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Agrega tu primer lead para comenzar la gestión
                </p>
                <Button onClick={() => setShowLeadForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Lead
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {leads.map(lead => (
                  <div key={lead.id} className="rounded-lg border p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                          <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {lead.firstName} {lead.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {lead.email} • {lead.company || 'Sin empresa'}
                          </p>
                          {lead.phone && (
                            <p className="text-sm text-muted-foreground">
                              {lead.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            Score: {lead.score}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatSource(lead.source)}
                          </p>
                        </div>
                        <Badge className={getStatusColor(lead.status)}>
                          {formatStatus(lead.status)}
                        </Badge>
                        <Badge className={getPriorityColor(lead.priority)}>
                          {formatLeadPriority(lead.priority)}
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
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">
                            {lead.email}
                          </p>
                        </div>
                      </div>

                      {lead.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Teléfono</p>
                            <p className="text-sm text-muted-foreground">
                              {lead.phone}
                            </p>
                          </div>
                        </div>
                      )}

                      {lead.company && (
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Empresa</p>
                            <p className="text-sm text-muted-foreground">
                              {lead.company}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Creado</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {lead.opportunities && lead.opportunities.length > 0 && (
                      <div className="mt-4 border-t pt-4">
                        <p className="mb-2 text-sm font-medium">
                          Oportunidades ({lead.opportunities.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {lead.opportunities.map(opportunity => (
                            <Badge key={opportunity.id} variant="outline">
                              {opportunity.name} - $
                              {opportunity.value.toLocaleString()}
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
