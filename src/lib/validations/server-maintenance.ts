import { z } from 'zod'

// Schema para ventana de mantenimiento
export const MaintenanceWindowSchema = z.object({
  serverId: z.string().min(1, 'Debe seleccionar un servidor'),
  title: z.string().min(1, 'El título es requerido').max(200),
  description: z.string().min(1, 'La descripción es requerida').max(1000),
  type: z
    .enum(['SCHEDULED', 'EMERGENCY', 'PLANNED', 'PREVENTIVE', 'CORRECTIVE'])
    .default('SCHEDULED'),
  status: z
    .enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED'])
    .default('PLANNED'),

  // Fechas y horarios
  startTime: z.string().min(1, 'La fecha de inicio es requerida'),
  endTime: z.string().min(1, 'La fecha de fin es requerida'),
  timezone: z.string().min(1, 'La zona horaria es requerida'),
  estimatedDuration: z
    .number()
    .min(1, 'La duración debe ser mayor a 0')
    .optional(),

  // Notificaciones
  notificationsSent: z.boolean().default(false),
  notificationChannels: z
    .array(z.enum(['EMAIL', 'SMS', 'SLACK', 'TEAMS', 'WEBHOOK']))
    .default(['EMAIL']),

  // Impacto
  slaImpact: z.boolean().default(false),
  expectedDowntime: z
    .number()
    .min(0, 'El tiempo de inactividad no puede ser negativo')
    .optional(),

  // Planificación
  rollbackPlan: z.string().optional().or(z.literal('')),
  contactPerson: z.string().optional().or(z.literal('')),
  emergencyContact: z.string().optional().or(z.literal('')),

  // Auditoría
  createdBy: z.string().optional().or(z.literal('')),
  approvedBy: z.string().optional().or(z.literal('')),
  approvedAt: z.string().optional().or(z.literal('')),
})

// Schema para actualizar mantenimiento
export const UpdateMaintenanceWindowSchema = MaintenanceWindowSchema.partial()

// Schema para consultas de mantenimiento
export const MaintenanceQuerySchema = z.object({
  serverId: z.string().optional(),
  type: z
    .enum(['SCHEDULED', 'EMERGENCY', 'PLANNED', 'PREVENTIVE', 'CORRECTIVE'])
    .optional(),
  status: z
    .enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED'])
    .optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  slaImpact: z.boolean().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z
    .enum(['startTime', 'endTime', 'createdAt', 'title'])
    .default('startTime'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

// Schema para aprobar mantenimiento
export const ApproveMaintenanceSchema = z.object({
  approvedBy: z.string().min(1, 'El aprobador es requerido'),
  comments: z.string().optional().or(z.literal('')),
})

// Schema para completar mantenimiento
export const CompleteMaintenanceSchema = z.object({
  actualDuration: z
    .number()
    .min(0, 'La duración real no puede ser negativa')
    .optional(),
  actualDowntime: z
    .number()
    .min(0, 'El tiempo de inactividad real no puede ser negativo')
    .optional(),
  notes: z.string().optional().or(z.literal('')),
  issues: z.string().optional().or(z.literal('')),
  completedBy: z.string().min(1, 'El completador es requerido'),
})

// Schema para cancelar mantenimiento
export const CancelMaintenanceSchema = z.object({
  reason: z.string().min(1, 'La razón de cancelación es requerida'),
  cancelledBy: z.string().min(1, 'El cancelador es requerido'),
})

// Schema para reprogramar mantenimiento
export const RescheduleMaintenanceSchema = z.object({
  newStartTime: z.string().min(1, 'La nueva fecha de inicio es requerida'),
  newEndTime: z.string().min(1, 'La nueva fecha de fin es requerida'),
  reason: z.string().min(1, 'La razón de reprogramación es requerida'),
  rescheduledBy: z.string().min(1, 'El reprogramador es requerido'),
})

// Type exports
export type CreateMaintenanceWindowInput = z.infer<
  typeof MaintenanceWindowSchema
>
export type UpdateMaintenanceWindowInput = z.infer<
  typeof UpdateMaintenanceWindowSchema
>
export type MaintenanceQuery = z.infer<typeof MaintenanceQuerySchema>
export type ApproveMaintenanceInput = z.infer<typeof ApproveMaintenanceSchema>
export type CompleteMaintenanceInput = z.infer<typeof CompleteMaintenanceSchema>
export type CancelMaintenanceInput = z.infer<typeof CancelMaintenanceSchema>
export type RescheduleMaintenanceInput = z.infer<
  typeof RescheduleMaintenanceSchema
>

// Utility functions para formateo
export const formatMaintenanceType = (type: string) => {
  const types: { [key: string]: string } = {
    SCHEDULED: 'Programado',
    EMERGENCY: 'Emergencia',
    PLANNED: 'Planificado',
    PREVENTIVE: 'Preventivo',
    CORRECTIVE: 'Correctivo',
  }
  return types[type] || type
}

export const formatMaintenanceStatus = (status: string) => {
  const statuses: { [key: string]: string } = {
    PLANNED: 'Planificado',
    IN_PROGRESS: 'En Progreso',
    COMPLETED: 'Completado',
    CANCELLED: 'Cancelado',
    POSTPONED: 'Pospuesto',
  }
  return statuses[status] || status
}

// Funciones para colores
export const getMaintenanceTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    SCHEDULED: 'bg-blue-100 text-blue-800',
    EMERGENCY: 'bg-red-100 text-red-800',
    PLANNED: 'bg-green-100 text-green-800',
    PREVENTIVE: 'bg-yellow-100 text-yellow-800',
    CORRECTIVE: 'bg-orange-100 text-orange-800',
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

export const getMaintenanceStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    PLANNED: 'bg-gray-100 text-gray-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    POSTPONED: 'bg-yellow-100 text-yellow-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// Funciones de validación
export const validateMaintenanceWindow = (
  startTime: string,
  endTime: string,
  estimatedDuration?: number
): { valid: boolean; message?: string } => {
  const start = new Date(startTime)
  const end = new Date(endTime)
  const now = new Date()

  if (start >= end) {
    return {
      valid: false,
      message: 'La fecha de inicio debe ser anterior a la fecha de fin',
    }
  }

  if (start <= now) {
    return { valid: false, message: 'La fecha de inicio debe ser en el futuro' }
  }

  if (estimatedDuration) {
    const durationMs = end.getTime() - start.getTime()
    const estimatedMs = estimatedDuration * 60 * 1000 // Convertir minutos a ms

    if (Math.abs(durationMs - estimatedMs) > 30 * 60 * 1000) {
      // 30 minutos de diferencia
      return {
        valid: false,
        message:
          'La duración estimada no coincide con el rango de fechas (diferencia > 30 min)',
      }
    }
  }

  return { valid: true }
}

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`
  } else if (minutes < 1440) {
    // 24 horas
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  } else {
    const days = Math.floor(minutes / 1440)
    const remainingHours = Math.floor((minutes % 1440) / 60)
    return `${days}d ${remainingHours}h`
  }
}

export const formatDowntime = (minutes: number): string => {
  return formatDuration(minutes)
}

export const calculateMaintenanceImpact = (
  expectedDowntime?: number
): string => {
  if (!expectedDowntime) return 'Sin impacto estimado'

  if (expectedDowntime <= 5) {
    return 'Impacto mínimo (< 5 min)'
  } else if (expectedDowntime <= 30) {
    return 'Impacto bajo (< 30 min)'
  } else if (expectedDowntime <= 120) {
    return 'Impacto medio (< 2 horas)'
  } else {
    return 'Impacto alto (> 2 horas)'
  }
}

export const getMaintenancePriority = (
  type: string,
  slaImpact: boolean
): number => {
  const typePriority = {
    EMERGENCY: 1,
    CORRECTIVE: 2,
    PREVENTIVE: 3,
    SCHEDULED: 4,
    PLANNED: 5,
  }

  let priority = typePriority[type as keyof typeof typePriority] || 5

  // SLA impact aumenta la prioridad
  if (slaImpact) {
    priority = Math.max(1, priority - 1)
  }

  return priority
}

export const getMaintenancePriorityColor = (priority: number): string => {
  if (priority <= 1) return 'bg-red-100 text-red-800'
  if (priority <= 2) return 'bg-orange-100 text-orange-800'
  if (priority <= 3) return 'bg-yellow-100 text-yellow-800'
  if (priority <= 4) return 'bg-blue-100 text-blue-800'
  return 'bg-gray-100 text-gray-800'
}

export const getMaintenancePriorityLabel = (priority: number): string => {
  if (priority <= 1) return 'Crítica'
  if (priority <= 2) return 'Alta'
  if (priority <= 3) return 'Media'
  if (priority <= 4) return 'Baja'
  return 'Muy Baja'
}

export const validateTimezone = (timezone: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone })
    return true
  } catch {
    return false
  }
}

export const getUpcomingMaintenances = (
  maintenances: any[],
  days: number = 7
) => {
  const now = new Date()
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

  return maintenances
    .filter(m => {
      const startTime = new Date(m.startTime)
      return (
        startTime >= now && startTime <= futureDate && m.status === 'PLANNED'
      )
    })
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )
}

export const getOverdueMaintenances = (maintenances: any[]) => {
  const now = new Date()

  return maintenances
    .filter(m => {
      const startTime = new Date(m.startTime)
      return startTime < now && m.status === 'PLANNED'
    })
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )
}

export const calculateMaintenanceStats = (maintenances: any[]) => {
  const total = maintenances.length
  const completed = maintenances.filter(m => m.status === 'COMPLETED').length
  const inProgress = maintenances.filter(m => m.status === 'IN_PROGRESS').length
  const planned = maintenances.filter(m => m.status === 'PLANNED').length
  const cancelled = maintenances.filter(m => m.status === 'CANCELLED').length
  const postponed = maintenances.filter(m => m.status === 'POSTPONED').length

  const slaImpact = maintenances.filter(m => m.slaImpact).length

  // Calcular tiempo promedio de duración
  const completedWithDuration = maintenances.filter(
    m => m.status === 'COMPLETED' && m.actualDuration
  )
  const avgDuration =
    completedWithDuration.length > 0
      ? completedWithDuration.reduce((sum, m) => sum + m.actualDuration, 0) /
        completedWithDuration.length
      : 0

  return {
    total,
    completed,
    inProgress,
    planned,
    cancelled,
    postponed,
    slaImpact,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    avgDuration: Math.round(avgDuration),
  }
}
