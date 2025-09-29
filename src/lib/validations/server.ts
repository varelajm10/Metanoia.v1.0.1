import { z } from 'zod'

export const ServerClientSchema = z.object({
  companyName: z.string().min(1, 'El nombre de la empresa es requerido'),
  contactName: z.string().min(1, 'El nombre del contacto es requerido'),
  email: z.string().email('Email inválido').min(1, 'El email es requerido'),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE'),
  monthlyFee: z.preprocess(
    val => (val === '' ? undefined : Number(val)),
    z.number().min(0, 'La tarifa mensual no puede ser negativa').optional()
  ),
  serviceLevel: z.string().optional().or(z.literal('')),
  contractStart: z.string().optional().or(z.literal('')),
  contractEnd: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
})

export const ServerSchema = z.object({
  name: z.string().min(1, 'El nombre del servidor es requerido'),
  hostname: z.string().optional().or(z.literal('')),
  type: z.string().min(1, 'El tipo de servidor es requerido'),
  status: z
    .enum(['ONLINE', 'OFFLINE', 'MAINTENANCE', 'WARNING'])
    .default('ONLINE'),
  ipAddress: z.string().min(1, 'La dirección IP es requerida'),
  port: z.preprocess(
    val => (val === '' ? undefined : Number(val)),
    z.number().min(1).max(65535, 'Puerto inválido').optional()
  ),
  protocol: z.string().optional().or(z.literal('')),
  location: z.string().min(1, 'La ubicación es requerida'),
  datacenter: z.string().optional().or(z.literal('')),
  rack: z.string().optional().or(z.literal('')),
  provider: z.string().optional().or(z.literal('')),

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
  cost: z.preprocess(
    val => (val === '' ? undefined : Number(val)),
    z.number().min(0, 'El costo no puede ser negativo').optional()
  ),
  description: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
})

export const ServerAlertSchema = z.object({
  type: z.enum([
    'CPU_HIGH',
    'MEMORY_HIGH',
    'DISK_FULL',
    'NETWORK_DOWN',
    'SERVICE_DOWN',
    'CERTIFICATE_EXPIRING',
    'BACKUP_FAILED',
    'SECURITY_BREACH',
    'PERFORMANCE_DEGRADED',
  ]),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  status: z
    .enum(['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED'])
    .default('ACTIVE'),
  acknowledged: z.boolean().default(false),
  resolvedAt: z.string().optional().or(z.literal('')),
  resolvedBy: z.string().optional().or(z.literal('')),
})

export const ServerMetricSchema = z.object({
  metricType: z.enum([
    'CPU_USAGE',
    'MEMORY_USAGE',
    'DISK_USAGE',
    'NETWORK_IN',
    'NETWORK_OUT',
    'RESPONSE_TIME',
    'UPTIME',
    'TEMPERATURE',
    'POWER_CONSUMPTION',
  ]),
  value: z.number().min(0, 'El valor debe ser positivo'),
  unit: z.string().optional().or(z.literal('')),
  timestamp: z.string().optional().or(z.literal('')),
})

// export type CreateServerClientInput = z.infer<typeof ServerClientSchema>
// export type UpdateServerClientInput = Partial<CreateServerClientInput>

// export type CreateServerInput = any
// export type UpdateServerInput = any

export type CreateServerAlertInput = z.infer<typeof ServerAlertSchema>
export type UpdateServerAlertInput = Partial<CreateServerAlertInput>

export type CreateServerMetricInput = z.infer<typeof ServerMetricSchema>
export type UpdateServerMetricInput = Partial<CreateServerMetricInput>

// Additional schemas for compatibility
export const CreateServerClientSchema = ServerClientSchema
export type CreateServerClientInput = any

export const UpdateServerSchema = ServerSchema.partial()
export type UpdateServerInput = any
