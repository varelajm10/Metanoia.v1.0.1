import { z } from 'zod'

// Schema para servidor mejorado con geolocalización
export const EnhancedServerSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre es demasiado largo'),
  hostname: z.string().optional().or(z.literal('')),
  type: z.string().min(1, 'El tipo es requerido'),
  status: z
    .enum(['ONLINE', 'OFFLINE', 'MAINTENANCE', 'WARNING'])
    .default('ONLINE'),
  ipAddress: z.string().ip('Dirección IP inválida'),
  port: z.number().min(1).max(65535).optional(),
  protocol: z.string().optional().or(z.literal('')),
  location: z.string().min(1, 'La ubicación es requerida'),

  // Información geográfica
  country: z.string().min(1, 'El país es requerido').max(100),
  region: z.string().min(1, 'La región es requerida').max(100),
  city: z.string().min(1, 'La ciudad es requerida').max(100),
  timezone: z.string().min(1, 'La zona horaria es requerida'),
  currency: z.string().min(3).max(3, 'La moneda debe tener 3 caracteres'),

  // Información del datacenter
  datacenter: z.string().optional().or(z.literal('')),
  datacenterCode: z.string().optional().or(z.literal('')),
  rack: z.string().optional().or(z.literal('')),
  rackPosition: z.string().optional().or(z.literal('')),
  provider: z.string().optional().or(z.literal('')),

  // Cumplimiento normativo
  compliance: z.array(z.string()).default([]),

  // Especificaciones técnicas
  operatingSystem: z.string().optional().or(z.literal('')),
  cpu: z.string().optional().or(z.literal('')),
  ram: z.string().optional().or(z.literal('')),
  storage: z.string().optional().or(z.literal('')),
  bandwidth: z.string().optional().or(z.literal('')),
  powerConsumption: z.string().optional().or(z.literal('')),
  temperature: z.string().optional().or(z.literal('')),

  // Configuraciones
  sslCertificate: z.boolean().default(false),
  backupEnabled: z.boolean().default(false),
  monitoringEnabled: z.boolean().default(true),

  // Información del cliente
  clientId: z.string().min(1, 'Debe seleccionar un cliente'),

  // Fechas importantes
  installationDate: z.string().optional().or(z.literal('')),
  lastMaintenance: z.string().optional().or(z.literal('')),
  nextMaintenance: z.string().optional().or(z.literal('')),

  // Costos y descripción
  cost: z.number().min(0).optional(),
  costCurrency: z.string().optional().or(z.literal('')),
  costPeriod: z.enum(['MONTHLY', 'ANNUAL']).optional(),
  description: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),

  // Información de red
  publicIP: z.string().ip().optional().or(z.literal('')),
  privateIP: z.string().ip().optional().or(z.literal('')),
  gateway: z.string().ip().optional().or(z.literal('')),
  subnet: z.string().optional().or(z.literal('')),
  dnsServers: z.array(z.string().ip()).default([]),
  connectionType: z
    .enum(['DEDICATED', 'SHARED', 'CLOUD', 'HYBRID', 'VIRTUAL'])
    .default('DEDICATED'),
})

// Schema para ventana de mantenimiento
export const MaintenanceWindowSchema = z.object({
  serverId: z.string().min(1, 'Debe seleccionar un servidor'),
  title: z.string().min(1, 'El título es requerido').max(200),
  description: z.string().min(1, 'La descripción es requerida'),
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
  estimatedDuration: z.number().min(1).optional(),

  // Notificaciones
  notificationsSent: z.boolean().default(false),
  notificationChannels: z.array(z.string()).default([]),

  // Impacto
  slaImpact: z.boolean().default(false),
  expectedDowntime: z.number().min(0).optional(),

  // Planificación
  rollbackPlan: z.string().optional().or(z.literal('')),
  contactPerson: z.string().optional().or(z.literal('')),
  emergencyContact: z.string().optional().or(z.literal('')),

  // Auditoría
  createdBy: z.string().optional().or(z.literal('')),
  approvedBy: z.string().optional().or(z.literal('')),
  approvedAt: z.string().optional().or(z.literal('')),
})

// Schema para costos de servidor
export const ServerCostSchema = z.object({
  serverId: z.string().min(1, 'Debe seleccionar un servidor'),
  costType: z.enum([
    'HARDWARE',
    'SOFTWARE',
    'BANDWIDTH',
    'POWER',
    'COOLING',
    'MAINTENANCE',
    'LICENSING',
    'SUPPORT',
    'BACKUP',
    'MONITORING',
  ]),
  description: z.string().min(1, 'La descripción es requerida'),
  amount: z.number().min(0, 'El monto debe ser mayor a 0'),
  currency: z.string().min(3).max(3, 'La moneda debe tener 3 caracteres'),
  period: z
    .enum(['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL'])
    .default('MONTHLY'),

  // Fechas
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
  endDate: z.string().optional().or(z.literal('')),

  // Proveedor y facturación
  provider: z.string().optional().or(z.literal('')),
  invoiceNumber: z.string().optional().or(z.literal('')),
  paymentStatus: z
    .enum(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'])
    .default('PENDING'),

  // Auditoría
  createdBy: z.string().optional().or(z.literal('')),
  approvedBy: z.string().optional().or(z.literal('')),
})

// Schema para configuración de red
export const NetworkConfigSchema = z.object({
  serverId: z.string().min(1, 'Debe seleccionar un servidor'),

  // Configuración de red
  publicIP: z.string().ip().optional().or(z.literal('')),
  privateIP: z.string().ip('IP privada inválida'),
  gateway: z.string().ip().optional().or(z.literal('')),
  subnet: z.string().optional().or(z.literal('')),
  dnsServers: z.array(z.string().ip()).default([]),
  bandwidth: z.string().optional().or(z.literal('')),
  connectionType: z
    .enum(['DEDICATED', 'SHARED', 'CLOUD', 'HYBRID', 'VIRTUAL'])
    .default('DEDICATED'),

  // Información del proveedor
  isp: z.string().optional().or(z.literal('')),
  contractNumber: z.string().optional().or(z.literal('')),
  contractEndDate: z.string().optional().or(z.literal('')),

  // Configuración avanzada
  vlan: z.string().optional().or(z.literal('')),
  routingTable: z.any().optional(),
  firewallRules: z.any().optional(),
})

// Schemas de actualización (parciales)
export const UpdateEnhancedServerSchema = EnhancedServerSchema.partial()
export const UpdateMaintenanceWindowSchema = MaintenanceWindowSchema.partial()
export const UpdateServerCostSchema = ServerCostSchema.partial()
export const UpdateNetworkConfigSchema = NetworkConfigSchema.partial()

// Schemas de consulta
export const ServerQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.enum(['ONLINE', 'OFFLINE', 'MAINTENANCE', 'WARNING']).optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  type: z.string().optional(),
  clientId: z.string().optional(),
  sortBy: z
    .enum(['name', 'status', 'country', 'createdAt', 'lastChecked'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Type exports
export type CreateEnhancedServerInput = z.infer<typeof EnhancedServerSchema>
export type UpdateEnhancedServerInput = z.infer<
  typeof UpdateEnhancedServerSchema
>
export type CreateMaintenanceWindowInput = z.infer<
  typeof MaintenanceWindowSchema
>
export type UpdateMaintenanceWindowInput = z.infer<
  typeof UpdateMaintenanceWindowSchema
>
export type CreateServerCostInput = z.infer<typeof ServerCostSchema>
export type UpdateServerCostInput = z.infer<typeof UpdateServerCostSchema>
export type CreateNetworkConfigInput = z.infer<typeof NetworkConfigSchema>
export type UpdateNetworkConfigInput = z.infer<typeof UpdateNetworkConfigSchema>
export type ServerQuery = z.infer<typeof ServerQuerySchema>

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

export const formatCostType = (type: string) => {
  const types: { [key: string]: string } = {
    HARDWARE: 'Hardware',
    SOFTWARE: 'Software',
    BANDWIDTH: 'Ancho de Banda',
    POWER: 'Energía',
    COOLING: 'Refrigeración',
    MAINTENANCE: 'Mantenimiento',
    LICENSING: 'Licencias',
    SUPPORT: 'Soporte',
    BACKUP: 'Respaldo',
    MONITORING: 'Monitoreo',
  }
  return types[type] || type
}

export const formatCostPeriod = (period: string) => {
  const periods: { [key: string]: string } = {
    HOURLY: 'Por Hora',
    DAILY: 'Diario',
    WEEKLY: 'Semanal',
    MONTHLY: 'Mensual',
    QUARTERLY: 'Trimestral',
    ANNUAL: 'Anual',
  }
  return periods[period] || period
}

export const formatConnectionType = (type: string) => {
  const types: { [key: string]: string } = {
    DEDICATED: 'Dedicado',
    SHARED: 'Compartido',
    CLOUD: 'Nube',
    HYBRID: 'Híbrido',
    VIRTUAL: 'Virtual',
  }
  return types[type] || type
}

export const formatPaymentStatus = (status: string) => {
  const statuses: { [key: string]: string } = {
    PENDING: 'Pendiente',
    PAID: 'Pagado',
    OVERDUE: 'Vencido',
    CANCELLED: 'Cancelado',
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

export const getCostTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    HARDWARE: 'bg-purple-100 text-purple-800',
    SOFTWARE: 'bg-blue-100 text-blue-800',
    BANDWIDTH: 'bg-green-100 text-green-800',
    POWER: 'bg-yellow-100 text-yellow-800',
    COOLING: 'bg-cyan-100 text-cyan-800',
    MAINTENANCE: 'bg-orange-100 text-orange-800',
    LICENSING: 'bg-pink-100 text-pink-800',
    SUPPORT: 'bg-indigo-100 text-indigo-800',
    BACKUP: 'bg-red-100 text-red-800',
    MONITORING: 'bg-gray-100 text-gray-800',
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

export const getConnectionTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    DEDICATED: 'bg-green-100 text-green-800',
    SHARED: 'bg-yellow-100 text-yellow-800',
    CLOUD: 'bg-blue-100 text-blue-800',
    HYBRID: 'bg-purple-100 text-purple-800',
    VIRTUAL: 'bg-gray-100 text-gray-800',
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

export const getPaymentStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    OVERDUE: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// Funciones de validación
export const validateTimezone = (timezone: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone })
    return true
  } catch {
    return false
  }
}

export const validateCurrency = (currency: string): boolean => {
  const validCurrencies = [
    'USD',
    'EUR',
    'COP',
    'GBP',
    'JPY',
    'CAD',
    'AUD',
    'CHF',
    'CNY',
    'MXN',
  ]
  return validCurrencies.includes(currency.toUpperCase())
}

export const validateIPAddress = (ip: string): boolean => {
  const ipRegex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  return ipRegex.test(ip)
}

export const validateSubnet = (subnet: string): boolean => {
  const subnetRegex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/(?:[0-9]|[1-2][0-9]|3[0-2])$/
  return subnetRegex.test(subnet)
}
