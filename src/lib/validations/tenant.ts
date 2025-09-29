import { z } from 'zod'

// Schema para crear un tenant/cliente
export const CreateTenantSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre es demasiado largo'),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .max(50)
    .regex(
      /^[a-z0-9-]+$/,
      'El slug solo puede contener letras minúsculas, números y guiones'
    ),
  email: z.string().email('Email inválido'),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  timezone: z.string().min(1, 'La zona horaria es requerida'),
  currency: z.string().min(3).max(3, 'La moneda debe tener 3 caracteres'),

  // Información del contacto principal
  contactName: z.string().min(1, 'El nombre del contacto es requerido'),
  contactEmail: z.string().email('Email del contacto inválido'),
  contactPhone: z.string().optional().or(z.literal('')),

  // Configuración del tenant
  isActive: z.boolean().default(true),
  subscriptionPlan: z
    .enum(['BASIC', 'STANDARD', 'PREMIUM', 'ENTERPRISE'])
    .default('BASIC'),
  subscriptionStartDate: z.string().min(1, 'La fecha de inicio es requerida'),
  subscriptionEndDate: z.string().optional().or(z.literal('')),

  // Configuración de módulos
  enabledModules: z.array(z.string()).default([]),

  // Configuración adicional
  maxUsers: z.number().min(1).default(5),
  maxServers: z.number().min(1).default(10),
  maxStorageGB: z.number().min(1).default(100),

  // Notas y configuración
  notes: z.string().optional().or(z.literal('')),
  customDomain: z.string().optional().or(z.literal('')),
})

// Schema para actualizar un tenant
export const UpdateTenantSchema = CreateTenantSchema.partial()

// Schema para activar/desactivar módulos
export const ToggleModuleSchema = z.object({
  moduleId: z.string().min(1, 'ID del módulo requerido'),
  isEnabled: z.boolean(),
  reason: z.string().optional().or(z.literal('')),
})

// Schema para cambiar plan de suscripción
export const ChangeSubscriptionSchema = z.object({
  newPlan: z.enum(['BASIC', 'STANDARD', 'PREMIUM', 'ENTERPRISE']),
  reason: z.string().optional().or(z.literal('')),
  changeDate: z.string().min(1, 'La fecha de cambio es requerida'),
})

// Schema para consultas de tenants
export const TenantQuerySchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  subscriptionPlan: z
    .enum(['BASIC', 'STANDARD', 'PREMIUM', 'ENTERPRISE'])
    .optional(),
  country: z.string().optional(),
  hasModule: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z
    .enum(['name', 'createdAt', 'subscriptionPlan', 'isActive'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Type exports
export type CreateTenantInput = z.infer<typeof CreateTenantSchema>
export type UpdateTenantInput = z.infer<typeof UpdateTenantSchema>
export type ToggleModuleInput = z.infer<typeof ToggleModuleSchema>
export type ChangeSubscriptionInput = z.infer<typeof ChangeSubscriptionSchema>
export type TenantQuery = z.infer<typeof TenantQuerySchema>

// Utility functions para formateo
export const formatSubscriptionPlan = (plan: string) => {
  const plans: { [key: string]: string } = {
    BASIC: 'Básico',
    STANDARD: 'Estándar',
    PREMIUM: 'Premium',
    ENTERPRISE: 'Empresarial',
  }
  return plans[plan] || plan
}

export const formatModuleName = (moduleId: string) => {
  const modules: { [key: string]: string } = {
    customers: 'Gestión de Clientes',
    products: 'Inventario',
    orders: 'Ventas',
    invoices: 'Facturación',
    hr: 'Recursos Humanos',
    servers: 'Gestión de Servidores',
    crm: 'CRM',
    reports: 'Reportes',
    settings: 'Configuración',
  }
  return modules[moduleId] || moduleId
}

export const formatModuleCategory = (category: string) => {
  const categories: { [key: string]: string } = {
    BUSINESS: 'Negocio',
    TECHNICAL: 'Técnico',
    ADMINISTRATIVE: 'Administrativo',
    ANALYTICS: 'Analítica',
  }
  return categories[category] || category
}

// Funciones para colores
export const getSubscriptionPlanColor = (plan: string) => {
  const colors: { [key: string]: string } = {
    BASIC: 'bg-gray-100 text-gray-800',
    STANDARD: 'bg-blue-100 text-blue-800',
    PREMIUM: 'bg-purple-100 text-purple-800',
    ENTERPRISE: 'bg-yellow-100 text-yellow-800',
  }
  return colors[plan] || 'bg-gray-100 text-gray-800'
}

export const getModuleStatusColor = (isEnabled: boolean) => {
  return isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
}

export const getTenantStatusColor = (isActive: boolean) => {
  return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
}

// Funciones de validación
export const validateSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9-]+$/
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 50
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
    'ARS',
  ]
  return validCurrencies.includes(currency.toUpperCase())
}

export const validateTimezone = (timezone: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone })
    return true
  } catch {
    return false
  }
}

export const getPlanLimits = (plan: string) => {
  const limits = {
    BASIC: {
      maxUsers: 5,
      maxServers: 10,
      maxStorageGB: 100,
      maxModules: 3,
      supportLevel: 'Email',
    },
    STANDARD: {
      maxUsers: 25,
      maxServers: 50,
      maxStorageGB: 500,
      maxModules: 6,
      supportLevel: 'Email + Chat',
    },
    PREMIUM: {
      maxUsers: 100,
      maxServers: 200,
      maxStorageGB: 2000,
      maxModules: 10,
      supportLevel: 'Email + Chat + Phone',
    },
    ENTERPRISE: {
      maxUsers: -1, // Ilimitado
      maxServers: -1, // Ilimitado
      maxStorageGB: -1, // Ilimitado
      maxModules: -1, // Ilimitado
      supportLevel: '24/7 Premium Support',
    },
  }
  return limits[plan as keyof typeof limits] || limits['BASIC']
}

export const canEnableModule = (
  currentPlan: string,
  moduleId: string,
  enabledModules: string[]
): { canEnable: boolean; reason?: string } => {
  const limits = getPlanLimits(currentPlan)

  // Verificar límite de módulos
  if (limits.maxModules !== -1 && enabledModules.length >= limits.maxModules) {
    return {
      canEnable: false,
      reason: `Plan ${currentPlan} permite máximo ${limits.maxModules} módulos`,
    }
  }

  // Verificar si el módulo ya está habilitado
  if (enabledModules.includes(moduleId)) {
    return {
      canEnable: false,
      reason: 'El módulo ya está habilitado',
    }
  }

  return { canEnable: true }
}

export const calculateUsagePercentage = (
  current: number,
  limit: number
): number => {
  if (limit === -1) return 0 // Ilimitado
  return Math.round((current / limit) * 100)
}

export const getUsageColor = (percentage: number): string => {
  if (percentage >= 90) return 'text-red-600'
  if (percentage >= 75) return 'text-orange-600'
  if (percentage >= 50) return 'text-yellow-600'
  return 'text-green-600'
}

export const formatUsage = (current: number, limit: number): string => {
  if (limit === -1) return `${current} (Ilimitado)`
  return `${current} / ${limit}`
}

export const getAvailableModules = () => {
  return [
    {
      id: 'customers',
      name: 'Gestión de Clientes',
      category: 'BUSINESS',
      description: 'CRM y gestión de clientes',
    },
    {
      id: 'products',
      name: 'Inventario',
      category: 'BUSINESS',
      description: 'Gestión de productos e inventario',
    },
    {
      id: 'orders',
      name: 'Ventas',
      category: 'BUSINESS',
      description: 'Gestión de órdenes y ventas',
    },
    {
      id: 'invoices',
      name: 'Facturación',
      category: 'BUSINESS',
      description: 'Facturación y contabilidad',
    },
    {
      id: 'hr',
      name: 'Recursos Humanos',
      category: 'ADMINISTRATIVE',
      description: 'Gestión de empleados y RRHH',
    },
    {
      id: 'servers',
      name: 'Gestión de Servidores',
      category: 'TECHNICAL',
      description: 'Monitoreo y gestión de servidores',
    },
    {
      id: 'crm',
      name: 'CRM Avanzado',
      category: 'BUSINESS',
      description: 'CRM con leads y oportunidades',
    },
    {
      id: 'reports',
      name: 'Reportes',
      category: 'ANALYTICS',
      description: 'Reportes y analytics',
    },
    {
      id: 'settings',
      name: 'Configuración',
      category: 'ADMINISTRATIVE',
      description: 'Configuración del sistema',
    },
  ]
}

export const getModuleDependencies = (moduleId: string): string[] => {
  const dependencies: { [key: string]: string[] } = {
    orders: ['customers', 'products'],
    invoices: ['customers', 'orders'],
    crm: ['customers'],
    reports: ['customers', 'orders', 'invoices'],
    settings: [], // No tiene dependencias
  }
  return dependencies[moduleId] || []
}

export const canDisableModule = (
  moduleId: string,
  enabledModules: string[]
): { canDisable: boolean; reason?: string; dependencies?: string[] } => {
  // Verificar si otros módulos dependen de este
  const dependentModules = []
  for (const enabledModule of enabledModules) {
    const deps = getModuleDependencies(enabledModule)
    if (deps.includes(moduleId)) {
      dependentModules.push(enabledModule)
    }
  }

  if (dependentModules.length > 0) {
    return {
      canDisable: false,
      reason: `No se puede deshabilitar porque otros módulos dependen de él`,
      dependencies: dependentModules,
    }
  }

  return { canDisable: true }
}
