import { z } from 'zod'

// Schema para métricas de servidor
export const ServerMetricSchema = z.object({
  serverId: z.string().min(1, 'ID de servidor requerido'),
  metricType: z.enum([
    'CPU_USAGE',
    'MEMORY_USAGE',
    'DISK_USAGE',
    'NETWORK_IN',
    'NETWORK_OUT',
    'UPTIME',
    'RESPONSE_TIME',
    'TEMPERATURE',
    'POWER_CONSUMPTION',
  ]),
  value: z.number().min(0, 'El valor debe ser mayor o igual a 0'),
  unit: z.string().optional().or(z.literal('')),
  source: z.string().optional().or(z.literal('')),
  threshold: z.number().min(0).optional(),
  isAlert: z.boolean().default(false),
})

// Schema para umbrales de métricas
export const MetricThresholdSchema = z.object({
  serverId: z.string().min(1, 'ID de servidor requerido'),
  metricType: z.enum([
    'CPU_USAGE',
    'MEMORY_USAGE',
    'DISK_USAGE',
    'NETWORK_IN',
    'NETWORK_OUT',
    'UPTIME',
    'RESPONSE_TIME',
    'TEMPERATURE',
    'POWER_CONSUMPTION',
  ]),
  warningThreshold: z.number().min(0).max(100).optional(),
  criticalThreshold: z.number().min(0).max(100).optional(),
  isEnabled: z.boolean().default(true),
  notifyOnWarning: z.boolean().default(true),
  notifyOnCritical: z.boolean().default(true),
  notificationChannels: z
    .array(z.enum(['EMAIL', 'SMS', 'SLACK', 'TEAMS', 'WEBHOOK', 'PUSH']))
    .default(['EMAIL']),
  cooldownMinutes: z.number().min(1).max(1440).default(15), // 1 minuto a 24 horas
})

// Schema para notificaciones
export const NotificationSchema = z.object({
  serverId: z.string().min(1, 'ID de servidor requerido'),
  type: z.enum([
    'METRIC_THRESHOLD',
    'SERVER_DOWN',
    'MAINTENANCE_REMINDER',
    'SECURITY_ALERT',
    'PERFORMANCE_DEGRADED',
    'DISK_SPACE_LOW',
    'CERTIFICATE_EXPIRING',
    'BACKUP_FAILED',
  ]),
  severity: z.enum(['INFO', 'WARNING', 'ERROR', 'CRITICAL']),
  title: z.string().min(1, 'El título es requerido').max(200),
  message: z.string().min(1, 'El mensaje es requerido').max(1000),
  channel: z.enum(['EMAIL', 'SMS', 'SLACK', 'TEAMS', 'WEBHOOK', 'PUSH']),
  metadata: z.any().optional(),
  maxRetries: z.number().min(1).max(10).default(3),
})

// Schema para estado de salud del servidor
export const ServerHealthSchema = z.object({
  serverId: z.string().min(1, 'ID de servidor requerido'),
  overallStatus: z
    .enum(['HEALTHY', 'WARNING', 'CRITICAL', 'OFFLINE', 'MAINTENANCE'])
    .default('HEALTHY'),

  // Métricas actuales
  cpuUsage: z.number().min(0).max(100).optional(),
  memoryUsage: z.number().min(0).max(100).optional(),
  diskUsage: z.number().min(0).max(100).optional(),
  networkIn: z.number().min(0).optional(),
  networkOut: z.number().min(0).optional(),
  uptime: z.number().min(0).optional(),
  responseTime: z.number().min(0).optional(),

  // Alertas activas
  activeAlerts: z.number().min(0).default(0),
  criticalAlerts: z.number().min(0).default(0),
  warningAlerts: z.number().min(0).default(0),

  // Información del sistema
  loadAverage: z.number().min(0).optional(),
  processes: z.number().min(0).optional(),
  connections: z.number().min(0).optional(),
  temperature: z.number().min(0).optional(),
})

// Schemas de actualización (parciales)
export const UpdateMetricThresholdSchema = MetricThresholdSchema.partial()
export const UpdateNotificationSchema = NotificationSchema.partial()
export const UpdateServerHealthSchema = ServerHealthSchema.partial()

// Schema para consultas de métricas
export const MetricQuerySchema = z.object({
  serverId: z.string().optional(),
  metricType: z
    .enum([
      'CPU_USAGE',
      'MEMORY_USAGE',
      'DISK_USAGE',
      'NETWORK_IN',
      'NETWORK_OUT',
      'UPTIME',
      'RESPONSE_TIME',
      'TEMPERATURE',
      'POWER_CONSUMPTION',
    ])
    .optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  limit: z.coerce.number().min(1).max(1000).default(100),
  interval: z.enum(['1m', '5m', '15m', '1h', '1d']).default('5m'),
})

// Schema para consultas de notificaciones
export const NotificationQuerySchema = z.object({
  serverId: z.string().optional(),
  type: z
    .enum([
      'METRIC_THRESHOLD',
      'SERVER_DOWN',
      'MAINTENANCE_REMINDER',
      'SECURITY_ALERT',
      'PERFORMANCE_DEGRADED',
      'DISK_SPACE_LOW',
      'CERTIFICATE_EXPIRING',
      'BACKUP_FAILED',
    ])
    .optional(),
  severity: z.enum(['INFO', 'WARNING', 'ERROR', 'CRITICAL']).optional(),
  channel: z
    .enum(['EMAIL', 'SMS', 'SLACK', 'TEAMS', 'WEBHOOK', 'PUSH'])
    .optional(),
  status: z
    .enum(['PENDING', 'SENT', 'DELIVERED', 'FAILED', 'RETRYING'])
    .optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
})

// Type exports
export type CreateServerMetricInput = z.infer<typeof ServerMetricSchema>
export type CreateMetricThresholdInput = z.infer<typeof MetricThresholdSchema>
export type UpdateMetricThresholdInput = z.infer<
  typeof UpdateMetricThresholdSchema
>
export type CreateNotificationInput = z.infer<typeof NotificationSchema>
export type UpdateNotificationInput = z.infer<typeof UpdateNotificationSchema>
export type CreateServerHealthInput = z.infer<typeof ServerHealthSchema>
export type UpdateServerHealthInput = z.infer<typeof UpdateServerHealthSchema>
export type MetricQuery = z.infer<typeof MetricQuerySchema>
export type NotificationQuery = z.infer<typeof NotificationQuerySchema>

// Utility functions para formateo
export const formatMetricType = (type: string) => {
  const types: { [key: string]: string } = {
    CPU_USAGE: 'Uso de CPU',
    MEMORY_USAGE: 'Uso de Memoria',
    DISK_USAGE: 'Uso de Disco',
    NETWORK_IN: 'Red Entrada',
    NETWORK_OUT: 'Red Salida',
    UPTIME: 'Tiempo de Actividad',
    RESPONSE_TIME: 'Tiempo de Respuesta',
    TEMPERATURE: 'Temperatura',
    POWER_CONSUMPTION: 'Consumo de Energía',
  }
  return types[type] || type
}

export const formatNotificationType = (type: string) => {
  const types: { [key: string]: string } = {
    METRIC_THRESHOLD: 'Umbral de Métrica',
    SERVER_DOWN: 'Servidor Caído',
    MAINTENANCE_REMINDER: 'Recordatorio de Mantenimiento',
    SECURITY_ALERT: 'Alerta de Seguridad',
    PERFORMANCE_DEGRADED: 'Rendimiento Degradado',
    DISK_SPACE_LOW: 'Espacio en Disco Bajo',
    CERTIFICATE_EXPIRING: 'Certificado por Expirar',
    BACKUP_FAILED: 'Respaldo Fallido',
  }
  return types[type] || type
}

export const formatNotificationSeverity = (severity: string) => {
  const severities: { [key: string]: string } = {
    INFO: 'Informativo',
    WARNING: 'Advertencia',
    ERROR: 'Error',
    CRITICAL: 'Crítico',
  }
  return severities[severity] || severity
}

export const formatNotificationChannel = (channel: string) => {
  const channels: { [key: string]: string } = {
    EMAIL: 'Email',
    SMS: 'SMS',
    SLACK: 'Slack',
    TEAMS: 'Microsoft Teams',
    WEBHOOK: 'Webhook',
    PUSH: 'Push Notification',
  }
  return channels[channel] || channel
}

export const formatNotificationStatus = (status: string) => {
  const statuses: { [key: string]: string } = {
    PENDING: 'Pendiente',
    SENT: 'Enviado',
    DELIVERED: 'Entregado',
    FAILED: 'Fallido',
    RETRYING: 'Reintentando',
  }
  return statuses[status] || status
}

export const formatServerHealthStatus = (status: string) => {
  const statuses: { [key: string]: string } = {
    HEALTHY: 'Saludable',
    WARNING: 'Advertencia',
    CRITICAL: 'Crítico',
    OFFLINE: 'Desconectado',
    MAINTENANCE: 'Mantenimiento',
  }
  return statuses[status] || status
}

// Funciones para colores
export const getMetricTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    CPU_USAGE: 'bg-blue-100 text-blue-800',
    MEMORY_USAGE: 'bg-green-100 text-green-800',
    DISK_USAGE: 'bg-purple-100 text-purple-800',
    NETWORK_IN: 'bg-cyan-100 text-cyan-800',
    NETWORK_OUT: 'bg-indigo-100 text-indigo-800',
    UPTIME: 'bg-emerald-100 text-emerald-800',
    RESPONSE_TIME: 'bg-orange-100 text-orange-800',
    TEMPERATURE: 'bg-red-100 text-red-800',
    POWER_CONSUMPTION: 'bg-yellow-100 text-yellow-800',
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

export const getNotificationSeverityColor = (severity: string) => {
  const colors: { [key: string]: string } = {
    INFO: 'bg-blue-100 text-blue-800',
    WARNING: 'bg-yellow-100 text-yellow-800',
    ERROR: 'bg-orange-100 text-orange-800',
    CRITICAL: 'bg-red-100 text-red-800',
  }
  return colors[severity] || 'bg-gray-100 text-gray-800'
}

export const getNotificationStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    SENT: 'bg-blue-100 text-blue-800',
    DELIVERED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    RETRYING: 'bg-orange-100 text-orange-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const getServerHealthStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    HEALTHY: 'bg-green-100 text-green-800',
    WARNING: 'bg-yellow-100 text-yellow-800',
    CRITICAL: 'bg-red-100 text-red-800',
    OFFLINE: 'bg-gray-100 text-gray-800',
    MAINTENANCE: 'bg-blue-100 text-blue-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// Funciones de validación
export const validateMetricValue = (
  type: string,
  value: number
): { valid: boolean; message?: string } => {
  switch (type) {
    case 'CPU_USAGE':
    case 'MEMORY_USAGE':
    case 'DISK_USAGE':
      if (value < 0 || value > 100) {
        return { valid: false, message: 'El valor debe estar entre 0 y 100' }
      }
      break
    case 'TEMPERATURE':
      if (value < -50 || value > 150) {
        return {
          valid: false,
          message: 'La temperatura debe estar entre -50°C y 150°C',
        }
      }
      break
    case 'RESPONSE_TIME':
      if (value < 0 || value > 60000) {
        return {
          valid: false,
          message: 'El tiempo de respuesta debe estar entre 0 y 60000ms',
        }
      }
      break
    case 'UPTIME':
      if (value < 0) {
        return {
          valid: false,
          message: 'El tiempo de actividad debe ser mayor a 0',
        }
      }
      break
  }
  return { valid: true }
}

export const validateThreshold = (
  warning: number | undefined,
  critical: number | undefined
): { valid: boolean; message?: string } => {
  if (warning !== undefined && critical !== undefined) {
    if (warning >= critical) {
      return {
        valid: false,
        message: 'El umbral de advertencia debe ser menor al umbral crítico',
      }
    }
  }
  return { valid: true }
}

export const getMetricUnit = (type: string): string => {
  const units: { [key: string]: string } = {
    CPU_USAGE: '%',
    MEMORY_USAGE: '%',
    DISK_USAGE: '%',
    NETWORK_IN: 'MB/s',
    NETWORK_OUT: 'MB/s',
    UPTIME: 's',
    RESPONSE_TIME: 'ms',
    TEMPERATURE: '°C',
    POWER_CONSUMPTION: 'W',
  }
  return units[type] || ''
}

export const formatMetricValue = (type: string, value: number): string => {
  const unit = getMetricUnit(type)
  switch (type) {
    case 'CPU_USAGE':
    case 'MEMORY_USAGE':
    case 'DISK_USAGE':
      return `${value.toFixed(1)}${unit}`
    case 'RESPONSE_TIME':
      return `${value.toFixed(0)}${unit}`
    case 'TEMPERATURE':
      return `${value.toFixed(1)}${unit}`
    case 'UPTIME':
      return formatUptime(value)
    case 'NETWORK_IN':
    case 'NETWORK_OUT':
      return `${value.toFixed(2)}${unit}`
    default:
      return `${value}${unit}`
  }
}

export const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

export const calculateHealthScore = (metrics: {
  cpuUsage?: number
  memoryUsage?: number
  diskUsage?: number
  responseTime?: number
}): number => {
  let score = 100

  if (metrics.cpuUsage !== undefined) {
    if (metrics.cpuUsage > 90) score -= 30
    else if (metrics.cpuUsage > 80) score -= 20
    else if (metrics.cpuUsage > 70) score -= 10
  }

  if (metrics.memoryUsage !== undefined) {
    if (metrics.memoryUsage > 90) score -= 30
    else if (metrics.memoryUsage > 80) score -= 20
    else if (metrics.memoryUsage > 70) score -= 10
  }

  if (metrics.diskUsage !== undefined) {
    if (metrics.diskUsage > 95) score -= 40
    else if (metrics.diskUsage > 90) score -= 30
    else if (metrics.diskUsage > 80) score -= 20
  }

  if (metrics.responseTime !== undefined) {
    if (metrics.responseTime > 5000) score -= 25
    else if (metrics.responseTime > 2000) score -= 15
    else if (metrics.responseTime > 1000) score -= 10
  }

  return Math.max(0, score)
}
