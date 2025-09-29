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
  Calendar as CalendarIcon,
  Wrench,
  Clock,
  AlertTriangle,
  CheckCircle,
  Building2,
  User,
  Settings,
  Plus,
  Search,
} from 'lucide-react'

interface MaintenanceSchedule {
  id: string
  elevatorId: string
  elevatorName: string
  type: 'preventive' | 'corrective' | 'emergency'
  scheduledDate: string
  technician: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

export default function MaintenancePage() {
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewSchedule, setShowNewSchedule] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [newScheduleData, setNewScheduleData] = useState({
    elevatorId: '',
    type: '',
    scheduledDate: '',
    technician: '',
    description: '',
    priority: 'medium'
  })

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setSchedules([
        {
          id: '1',
          elevatorId: 'ASC-001',
          elevatorName: 'Torre Centro - Ascensor A',
          type: 'preventive',
          scheduledDate: '2025-09-30',
          technician: 'Juan Pérez',
          status: 'scheduled',
          description: 'Mantenimiento preventivo mensual',
          priority: 'medium',
        },
        {
          id: '2',
          elevatorId: 'ASC-002',
          elevatorName: 'Edificio Norte - Ascensor B',
          type: 'corrective',
          scheduledDate: '2025-10-02',
          technician: 'María García',
          status: 'in_progress',
          description: 'Reparación de sistema de frenos',
          priority: 'high',
        },
        {
          id: '3',
          elevatorId: 'ASC-003',
          elevatorName: 'Plaza Comercial - Ascensor C',
          type: 'emergency',
          scheduledDate: '2025-09-29',
          technician: 'Carlos López',
          status: 'completed',
          description: 'Reparación de emergencia - falla eléctrica',
          priority: 'urgent',
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Programado'
      case 'in_progress':
        return 'En Progreso'
      case 'completed':
        return 'Completado'
      case 'cancelled':
        return 'Cancelado'
      default:
        return 'Desconocido'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'preventive':
        return 'bg-green-100 text-green-800'
      case 'corrective':
        return 'bg-yellow-100 text-yellow-800'
      case 'emergency':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'preventive':
        return 'Preventivo'
      case 'corrective':
        return 'Correctivo'
      case 'emergency':
        return 'Emergencia'
      default:
        return 'Desconocido'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800'
      case 'medium':
        return 'bg-blue-100 text-blue-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'urgent':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'Baja'
      case 'medium':
        return 'Media'
      case 'high':
        return 'Alta'
      case 'urgent':
        return 'Urgente'
      default:
        return 'Desconocida'
    }
  }

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch =
      schedule.elevatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.elevatorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.technician.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      filterStatus === 'all' || schedule.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const handleNewSchedule = () => {
    setShowNewSchedule(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setNewScheduleData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmitSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newScheduleData.elevatorId || !newScheduleData.type || !newScheduleData.scheduledDate || !newScheduleData.technician) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    const newSchedule: MaintenanceSchedule = {
      id: Date.now().toString(),
      elevatorId: newScheduleData.elevatorId,
      elevatorName: `Ascensor ${newScheduleData.elevatorId}`,
      type: newScheduleData.type as 'preventive' | 'corrective' | 'emergency',
      scheduledDate: newScheduleData.scheduledDate,
      technician: newScheduleData.technician,
      status: 'scheduled',
      description: newScheduleData.description,
      priority: newScheduleData.priority as 'low' | 'medium' | 'high' | 'urgent'
    }

    setSchedules(prev => [newSchedule, ...prev])
    setShowNewSchedule(false)
    setNewScheduleData({
      elevatorId: '',
      type: '',
      scheduledDate: '',
      technician: '',
      description: '',
      priority: 'medium'
    })
  }

  const handleCancelSchedule = () => {
    setShowNewSchedule(false)
    setNewScheduleData({
      elevatorId: '',
      type: '',
      scheduledDate: '',
      technician: '',
      description: '',
      priority: 'medium'
    })
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
            Programación de Mantenimiento
          </h1>
          <p className="text-muted-foreground">
            Gestiona y programa mantenimientos preventivos y correctivos
          </p>
        </div>
        <Button onClick={() => setShowNewSchedule(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Mantenimiento
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por ascensor, técnico..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="scheduled">Programado</SelectItem>
                  <SelectItem value="in_progress">En Progreso</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Filtros Avanzados
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Programados
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schedules.length}</div>
            <p className="text-xs text-muted-foreground">
              Mantenimientos programados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {schedules.filter(s => s.status === 'in_progress').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Actualmente en ejecución
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {schedules.filter(s => s.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Finalizados este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {schedules.filter(s => s.priority === 'urgent').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requieren atención inmediata
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Schedules List */}
      <Card>
        <CardHeader>
          <CardTitle>Mantenimientos Programados</CardTitle>
          <CardDescription>
            Lista de todos los mantenimientos programados y su estado actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSchedules.map(schedule => (
              <div
                key={schedule.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Wrench className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{schedule.elevatorName}</h4>
                      <Badge variant="outline">{schedule.elevatorId}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {schedule.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <User className="mr-1 h-3 w-3" />
                        {schedule.technician}
                      </span>
                      <span className="flex items-center">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {schedule.scheduledDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getTypeColor(schedule.type)}>
                    {getTypeText(schedule.type)}
                  </Badge>
                  <Badge className={getPriorityColor(schedule.priority)}>
                    {getPriorityText(schedule.priority)}
                  </Badge>
                  <Badge className={getStatusColor(schedule.status)}>
                    {getStatusText(schedule.status)}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Ver Detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Schedule Modal Placeholder */}
      {showNewSchedule && (
        <Card>
          <CardHeader>
            <CardTitle>Nuevo Mantenimiento</CardTitle>
            <CardDescription>
              Programar un nuevo mantenimiento preventivo o correctivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitSchedule} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="elevator">Ascensor *</Label>
                  <Select
                    value={newScheduleData.elevatorId}
                    onValueChange={(value) => handleInputChange('elevatorId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar ascensor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASC-001">
                        Torre Centro - Ascensor A
                      </SelectItem>
                      <SelectItem value="ASC-002">
                        Edificio Norte - Ascensor B
                      </SelectItem>
                      <SelectItem value="ASC-003">
                        Plaza Comercial - Ascensor C
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Tipo de Mantenimiento *</Label>
                  <Select
                    value={newScheduleData.type}
                    onValueChange={(value) => handleInputChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preventive">Preventivo</SelectItem>
                      <SelectItem value="corrective">Correctivo</SelectItem>
                      <SelectItem value="emergency">Emergencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Fecha Programada *</Label>
                  <Input 
                    type="date" 
                    id="date" 
                    value={newScheduleData.scheduledDate}
                    onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="technician">Técnico Asignado *</Label>
                  <Select
                    value={newScheduleData.technician}
                    onValueChange={(value) => handleInputChange('technician', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar técnico" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Juan Pérez">Juan Pérez</SelectItem>
                      <SelectItem value="María García">María García</SelectItem>
                      <SelectItem value="Carlos López">Carlos López</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select
                    value={newScheduleData.priority}
                    onValueChange={(value) => handleInputChange('priority', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe el mantenimiento a realizar..."
                  rows={3}
                  value={newScheduleData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCancelSchedule}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Programar Mantenimiento
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
