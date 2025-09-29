import { z } from 'zod'

// Server User Access Schema
export const ServerUserAccessSchema = z.object({
  username: z
    .string()
    .min(1, 'El nombre de usuario es requerido')
    .max(50, 'El nombre de usuario es demasiado largo'),
  email: z.string().email('Email inválido'),
  fullName: z
    .string()
    .min(1, 'El nombre completo es requerido')
    .max(100, 'El nombre completo es demasiado largo'),
  department: z.string().optional().or(z.literal('')),
  jobTitle: z.string().optional().or(z.literal('')),

  // Información de acceso
  accessType: z
    .enum(['SSH', 'RDP', 'FTP', 'SFTP', 'WEB', 'API', 'DATABASE', 'CUSTOM'])
    .default('SSH'),
  accessLevel: z
    .enum(['READ_ONLY', 'LIMITED', 'STANDARD', 'ADMINISTRATOR', 'SUPER_ADMIN'])
    .default('READ_ONLY'),
  status: z
    .enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'EXPIRED', 'PENDING_APPROVAL'])
    .default('ACTIVE'),

  // Credenciales y configuración
  sshKey: z.string().optional().or(z.literal('')),
  password: z.string().optional().or(z.literal('')),
  twoFactorEnabled: z.boolean().default(false),

  // Fechas de acceso
  lastLogin: z.string().optional().or(z.literal('')),
  lastActivity: z.string().optional().or(z.literal('')),
  expiresAt: z.string().optional().or(z.literal('')),

  // Información adicional
  notes: z.string().optional().or(z.literal('')),
  createdBy: z.string().optional().or(z.literal('')),

  // Relación con servidor
  serverId: z.string().min(1, 'Debe seleccionar un servidor'),
})

// Update Schema (partial)
export const UpdateServerUserAccessSchema = ServerUserAccessSchema.partial()

// Query Schema para filtros
export const ServerUserQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  serverId: z.string().optional(),
  status: z
    .enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'EXPIRED', 'PENDING_APPROVAL'])
    .optional(),
  accessType: z
    .enum(['SSH', 'RDP', 'FTP', 'SFTP', 'WEB', 'API', 'DATABASE', 'CUSTOM'])
    .optional(),
  accessLevel: z
    .enum(['READ_ONLY', 'LIMITED', 'STANDARD', 'ADMINISTRATOR', 'SUPER_ADMIN'])
    .optional(),
  sortBy: z
    .enum(['username', 'fullName', 'email', 'createdAt', 'lastLogin'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Server Access Log Schema
export const ServerAccessLogSchema = z.object({
  action: z.enum([
    'LOGIN',
    'LOGOUT',
    'COMMAND_EXECUTION',
    'FILE_UPLOAD',
    'FILE_DOWNLOAD',
    'CONFIGURATION_CHANGE',
    'ACCESS_DENIED',
    'PASSWORD_CHANGE',
    'KEY_ROTATION',
    'SUSPENSION',
    'ACTIVATION',
  ]),
  ipAddress: z.string().optional().or(z.literal('')),
  userAgent: z.string().optional().or(z.literal('')),
  success: z.boolean().default(true),
  failureReason: z.string().optional().or(z.literal('')),
  sessionDuration: z.number().min(0).optional(),
  commandsExecuted: z.array(z.string()).default([]),
  userAccessId: z.string().min(1, 'ID de acceso de usuario requerido'),
})

// Type exports
export type CreateServerUserAccessInput = z.infer<typeof ServerUserAccessSchema>
export type UpdateServerUserAccessInput = z.infer<
  typeof UpdateServerUserAccessSchema
>
export type ServerUserQuery = z.infer<typeof ServerUserQuerySchema>
export type CreateServerAccessLogInput = z.infer<typeof ServerAccessLogSchema>

// Utility functions for formatting
export const formatAccessType = (type: string) => {
  const types: { [key: string]: string } = {
    SSH: 'SSH',
    RDP: 'RDP (Escritorio Remoto)',
    FTP: 'FTP',
    SFTP: 'SFTP (FTP Seguro)',
    WEB: 'Web',
    API: 'API',
    DATABASE: 'Base de Datos',
    CUSTOM: 'Personalizado',
  }
  return types[type] || type
}

export const formatAccessLevel = (level: string) => {
  const levels: { [key: string]: string } = {
    READ_ONLY: 'Solo Lectura',
    LIMITED: 'Limitado',
    STANDARD: 'Estándar',
    ADMINISTRATOR: 'Administrador',
    SUPER_ADMIN: 'Super Administrador',
  }
  return levels[level] || level
}

export const formatUserStatus = (status: string) => {
  const statuses: { [key: string]: string } = {
    ACTIVE: 'Activo',
    INACTIVE: 'Inactivo',
    SUSPENDED: 'Suspendido',
    EXPIRED: 'Expirado',
    PENDING_APPROVAL: 'Pendiente de Aprobación',
  }
  return statuses[status] || status
}

export const formatAccessAction = (action: string) => {
  const actions: { [key: string]: string } = {
    LOGIN: 'Inicio de Sesión',
    LOGOUT: 'Cierre de Sesión',
    COMMAND_EXECUTION: 'Ejecución de Comando',
    FILE_UPLOAD: 'Subida de Archivo',
    FILE_DOWNLOAD: 'Descarga de Archivo',
    CONFIGURATION_CHANGE: 'Cambio de Configuración',
    ACCESS_DENIED: 'Acceso Denegado',
    PASSWORD_CHANGE: 'Cambio de Contraseña',
    KEY_ROTATION: 'Rotación de Clave',
    SUSPENSION: 'Suspensión',
    ACTIVATION: 'Activación',
  }
  return actions[action] || action
}

export const getAccessTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    SSH: 'bg-blue-100 text-blue-800',
    RDP: 'bg-green-100 text-green-800',
    FTP: 'bg-yellow-100 text-yellow-800',
    SFTP: 'bg-purple-100 text-purple-800',
    WEB: 'bg-pink-100 text-pink-800',
    API: 'bg-indigo-100 text-indigo-800',
    DATABASE: 'bg-red-100 text-red-800',
    CUSTOM: 'bg-gray-100 text-gray-800',
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

export const getAccessLevelColor = (level: string) => {
  const colors: { [key: string]: string } = {
    READ_ONLY: 'bg-gray-100 text-gray-800',
    LIMITED: 'bg-yellow-100 text-yellow-800',
    STANDARD: 'bg-blue-100 text-blue-800',
    ADMINISTRATOR: 'bg-orange-100 text-orange-800',
    SUPER_ADMIN: 'bg-red-100 text-red-800',
  }
  return colors[level] || 'bg-gray-100 text-gray-800'
}

export const getUserStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
    SUSPENDED: 'bg-red-100 text-red-800',
    EXPIRED: 'bg-orange-100 text-orange-800',
    PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const getActionColor = (action: string) => {
  const colors: { [key: string]: string } = {
    LOGIN: 'bg-green-100 text-green-800',
    LOGOUT: 'bg-gray-100 text-gray-800',
    COMMAND_EXECUTION: 'bg-blue-100 text-blue-800',
    FILE_UPLOAD: 'bg-purple-100 text-purple-800',
    FILE_DOWNLOAD: 'bg-indigo-100 text-indigo-800',
    CONFIGURATION_CHANGE: 'bg-orange-100 text-orange-800',
    ACCESS_DENIED: 'bg-red-100 text-red-800',
    PASSWORD_CHANGE: 'bg-yellow-100 text-yellow-800',
    KEY_ROTATION: 'bg-pink-100 text-pink-800',
    SUSPENSION: 'bg-red-100 text-red-800',
    ACTIVATION: 'bg-green-100 text-green-800',
  }
  return colors[action] || 'bg-gray-100 text-gray-800'
}

// Validation helpers
export const validateSSHKey = (key: string): boolean => {
  // Basic SSH key validation
  const sshKeyPattern =
    /^(ssh-rsa|ssh-ed25519|ecdsa-sha2-nistp256|ecdsa-sha2-nistp384|ecdsa-sha2-nistp521)\s+[A-Za-z0-9+/=]+/
  return sshKeyPattern.test(key.trim())
}

export const validatePasswordStrength = (
  password: string
): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return {
      valid: false,
      message: 'La contraseña debe tener al menos 8 caracteres',
    }
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return {
      valid: false,
      message: 'La contraseña debe contener al menos una letra minúscula',
    }
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return {
      valid: false,
      message: 'La contraseña debe contener al menos una letra mayúscula',
    }
  }

  if (!/(?=.*\d)/.test(password)) {
    return {
      valid: false,
      message: 'La contraseña debe contener al menos un número',
    }
  }

  return { valid: true }
}
