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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  Shield,
  Building2,
  X,
  MarkAsRead,
  Settings,
  Filter,
} from 'lucide-react'

interface Notification {
  id: string
  type: 'MAINTENANCE' | 'INSPECTION' | 'EMERGENCY' | 'WARNING' | 'INFO'
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  elevator?: {
    serialNumber: string
    buildingName: string
  }
  technician?: {
    name: string
  }
}

interface NotificationCenterProps {
  notifications: Notification[]
  onMarkAsRead: (notificationId: string) => void
  onMarkAllAsRead: () => void
  onDelete: (notificationId: string) => void
  onNavigate: (url: string) => void
  loading?: boolean
}

export default function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onNavigate,
  loading = false,
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'MAINTENANCE':
        return <Wrench className="h-4 w-4" />
      case 'INSPECTION':
        return <Shield className="h-4 w-4" />
      case 'EMERGENCY':
        return <AlertTriangle className="h-4 w-4" />
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4" />
      case 'INFO':
        return <Bell className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'URGENT') return 'bg-red-100 text-red-800 border-red-200'
    if (priority === 'HIGH')
      return 'bg-orange-100 text-orange-800 border-orange-200'

    switch (type) {
      case 'EMERGENCY':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'MAINTENANCE':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'INSPECTION':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'INFO':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-500'
      case 'HIGH':
        return 'bg-orange-500'
      case 'NORMAL':
        return 'bg-blue-500'
      case 'LOW':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'MAINTENANCE':
        return 'Mantenimiento'
      case 'INSPECTION':
        return 'Inspección'
      case 'EMERGENCY':
        return 'Emergencia'
      case 'WARNING':
        return 'Advertencia'
      case 'INFO':
        return 'Información'
      default:
        return 'Notificación'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'Urgente'
      case 'HIGH':
        return 'Alta'
      case 'NORMAL':
        return 'Normal'
      case 'LOW':
        return 'Baja'
      default:
        return 'Normal'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    )

    if (diffInMinutes < 1) return 'Ahora'
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`
    return date.toLocaleDateString()
  }

  const filteredNotifications = notifications.filter(notification => {
    const filterMatch =
      filter === 'all' ||
      (filter === 'unread' && !notification.read) ||
      (filter === 'urgent' && notification.priority === 'URGENT')

    const typeMatch = typeFilter === 'all' || notification.type === typeFilter

    return filterMatch && typeMatch
  })

  const unreadCount = notifications.filter(n => !n.read).length
  const urgentCount = notifications.filter(n => n.priority === 'URGENT').length

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
                <Bell className="h-5 w-5" />
                Centro de Notificaciones
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Mantente informado sobre el estado de tus ascensores
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <MarkAsRead className="mr-2 h-4 w-4" />
                Marcar Todo como Leído
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="mb-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>

            <Tabs
              value={filter}
              onValueChange={(value: any) => setFilter(value)}
            >
              <TabsList>
                <TabsTrigger value="all">
                  Todas ({notifications.length})
                </TabsTrigger>
                <TabsTrigger value="unread">
                  No Leídas ({unreadCount})
                </TabsTrigger>
                <TabsTrigger value="urgent">
                  Urgentes ({urgentCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm"
            >
              <option value="all">Todos los Tipos</option>
              <option value="MAINTENANCE">Mantenimiento</option>
              <option value="INSPECTION">Inspección</option>
              <option value="EMERGENCY">Emergencia</option>
              <option value="WARNING">Advertencia</option>
              <option value="INFO">Información</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium">
                No hay notificaciones
              </h3>
              <p className="text-center text-gray-500">
                {filter === 'unread'
                  ? 'No tienes notificaciones sin leer'
                  : filter === 'urgent'
                    ? 'No hay notificaciones urgentes'
                    : 'No hay notificaciones para mostrar'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map(notification => (
            <Card
              key={notification.id}
              className={`transition-all hover:shadow-md ${
                !notification.read ? 'border-blue-200 bg-blue-50' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={`rounded-full p-2 ${getNotificationColor(notification.type, notification.priority)}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{notification.title}</h4>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                        )}
                        <Badge
                          className={getNotificationColor(
                            notification.type,
                            notification.priority
                          )}
                        >
                          {getTypeText(notification.type)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getPriorityColor(notification.priority)}
                        >
                          {getPriorityText(notification.priority)}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onMarkAsRead(notification.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="mb-3 text-gray-600">{notification.message}</p>

                    {/* Additional Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimestamp(notification.timestamp)}</span>
                      </div>

                      {notification.elevator && (
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          <span>
                            {notification.elevator.serialNumber} -{' '}
                            {notification.elevator.buildingName}
                          </span>
                        </div>
                      )}

                      {notification.technician && (
                        <div className="flex items-center gap-1">
                          <Wrench className="h-3 w-3" />
                          <span>{notification.technician.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    {notification.actionUrl && (
                      <div className="mt-3">
                        <Button
                          size="sm"
                          onClick={() => onNavigate(notification.actionUrl!)}
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-blue-50 p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {notifications.length}
              </div>
              <div className="text-sm text-blue-600">Total</div>
            </div>
            <div className="rounded-lg bg-orange-50 p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {unreadCount}
              </div>
              <div className="text-sm text-orange-600">No Leídas</div>
            </div>
            <div className="rounded-lg bg-red-50 p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {urgentCount}
              </div>
              <div className="text-sm text-red-600">Urgentes</div>
            </div>
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {notifications.filter(n => n.read).length}
              </div>
              <div className="text-sm text-green-600">Leídas</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
