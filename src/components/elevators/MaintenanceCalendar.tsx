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
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Shield,
  Building2,
  Filter,
} from 'lucide-react'

interface MaintenanceEvent {
  id: string
  title: string
  type: 'MAINTENANCE' | 'INSPECTION' | 'REPAIR' | 'EMERGENCY'
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'EMERGENCY'
  startDate: string
  endDate: string
  elevator: {
    serialNumber: string
    buildingName: string
    client: {
      name: string
    }
  }
  technician?: {
    name: string
  }
  description?: string
}

interface MaintenanceCalendarProps {
  events: MaintenanceEvent[]
  onEventClick: (event: MaintenanceEvent) => void
  onAddEvent: (date: string) => void
  onDateChange: (date: Date) => void
  loading?: boolean
}

export default function MaintenanceCalendar({
  events,
  onEventClick,
  onAddEvent,
  onDateChange,
  loading = false,
}: MaintenanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days = []

    // Días del mes anterior
    for (let i = startingDay - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day)
      days.push({ date: currentDate, isCurrentMonth: true })
    }

    // Días del mes siguiente
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day)
      days.push({ date: nextDate, isCurrentMonth: false })
    }

    return days
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(event => {
      const eventDate = new Date(event.startDate).toISOString().split('T')[0]
      return eventDate === dateStr
    })
  }

  const getEventColor = (type: string, priority: string) => {
    if (priority === 'EMERGENCY')
      return 'bg-red-100 text-red-800 border-red-200'
    if (priority === 'URGENT')
      return 'bg-orange-100 text-orange-800 border-orange-200'
    if (priority === 'HIGH')
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'

    switch (type) {
      case 'MAINTENANCE':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'INSPECTION':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'REPAIR':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'EMERGENCY':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'MAINTENANCE':
        return <Wrench className="h-3 w-3" />
      case 'INSPECTION':
        return <Shield className="h-3 w-3" />
      case 'REPAIR':
        return <AlertTriangle className="h-3 w-3" />
      case 'EMERGENCY':
        return <AlertTriangle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case 'IN_PROGRESS':
        return <Clock className="h-3 w-3 text-blue-600" />
      case 'CANCELLED':
        return <X className="h-3 w-3 text-red-600" />
      default:
        return <Clock className="h-3 w-3 text-gray-600" />
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
    onDateChange(newDate)
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    onDateChange(today)
  }

  const filteredEvents = events.filter(event => {
    const typeMatch = filterType === 'all' || event.type === filterType
    const statusMatch = filterStatus === 'all' || event.status === filterStatus
    return typeMatch && statusMatch
  })

  const days = getDaysInMonth(currentDate)

  if (loading) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Calendario de Mantenimientos
              </CardTitle>
              <CardDescription>
                Programación y seguimiento de mantenimientos e inspecciones
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={goToToday}>
                Hoy
              </Button>
              <Button onClick={() => onAddEvent(currentDate.toISOString())}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Evento
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Navigation */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <h2 className="text-xl font-semibold">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={view}
                onValueChange={(value: any) => setView(value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Mes</SelectItem>
                  <SelectItem value="week">Semana</SelectItem>
                  <SelectItem value="day">Día</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Tipos</SelectItem>
                <SelectItem value="MAINTENANCE">Mantenimiento</SelectItem>
                <SelectItem value="INSPECTION">Inspección</SelectItem>
                <SelectItem value="REPAIR">Reparación</SelectItem>
                <SelectItem value="EMERGENCY">Emergencia</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="SCHEDULED">Programado</SelectItem>
                <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                <SelectItem value="COMPLETED">Completado</SelectItem>
                <SelectItem value="CANCELLED">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {days.map((day, index) => (
              <div
                key={index}
                className="border-b p-2 text-center text-sm font-medium text-gray-600"
              >
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day.date)
              const isToday =
                day.date.toDateString() === new Date().toDateString()
              const isCurrentMonth = day.isCurrentMonth

              return (
                <div
                  key={index}
                  className={`min-h-[100px] border border-gray-200 p-1 ${
                    isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  } ${isToday ? 'border-blue-300 bg-blue-50' : ''}`}
                >
                  <div
                    className={`mb-1 text-sm font-medium ${
                      isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    } ${isToday ? 'text-blue-600' : ''}`}
                  >
                    {day.date.getDate()}
                  </div>

                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map(event => (
                      <div
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className={`cursor-pointer rounded border p-1 text-xs transition-shadow hover:shadow-sm ${getEventColor(event.type, event.priority)}`}
                      >
                        <div className="flex items-center gap-1">
                          {getEventIcon(event.type)}
                          <span className="truncate">{event.title}</span>
                          {getStatusIcon(event.status)}
                        </div>
                        <div className="truncate text-xs opacity-75">
                          {event.elevator.serialNumber}
                        </div>
                      </div>
                    ))}

                    {dayEvents.length > 3 && (
                      <div className="text-center text-xs text-gray-500">
                        +{dayEvents.length - 3} más
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded border border-blue-200 bg-blue-100"></div>
              <span>Mantenimiento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded border border-green-200 bg-green-100"></div>
              <span>Inspección</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded border border-purple-200 bg-purple-100"></div>
              <span>Reparación</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded border border-red-200 bg-red-100"></div>
              <span>Emergencia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded border border-orange-200 bg-orange-100"></div>
              <span>Urgente</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
