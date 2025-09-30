'use client'

import { useAuth } from './useAuth'
import { useMemo } from 'react'

// Configuración de módulos disponibles
const MODULE_CONFIG = {
  crm: {
    id: 'crm',
    name: 'CRM',
    description: 'Gestión de relaciones con clientes',
    category: 'BUSINESS',
    icon: 'Users',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    routes: [
      { path: '/dashboard/crm', label: 'Dashboard', permission: 'crm:view' },
      { path: '/dashboard/crm/leads', label: 'Leads', permission: 'crm:leads' },
      { path: '/dashboard/crm/opportunities', label: 'Oportunidades', permission: 'crm:opportunities' },
    ]
  },
  inventory: {
    id: 'inventory',
    name: 'Inventario',
    description: 'Control de stock y productos',
    category: 'BUSINESS',
    icon: 'Package',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    routes: [
      { path: '/dashboard/inventory', label: 'Dashboard', permission: 'inventory:view' },
      { path: '/dashboard/inventory/products', label: 'Productos', permission: 'inventory:products' },
      { path: '/dashboard/inventory/suppliers', label: 'Proveedores', permission: 'inventory:suppliers' },
    ]
  },
  billing: {
    id: 'billing',
    name: 'Facturación',
    description: 'Gestión de facturas y pagos',
    category: 'FINANCIAL',
    icon: 'Calculator',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    routes: [
      { path: '/dashboard/billing', label: 'Dashboard', permission: 'billing:view' },
      { path: '/dashboard/invoices', label: 'Facturas', permission: 'billing:invoices' },
      { path: '/dashboard/orders', label: 'Pedidos', permission: 'billing:orders' },
    ]
  },
  elevators: {
    id: 'elevators',
    name: 'Ascensores',
    description: 'Mantenimiento y gestión de ascensores',
    category: 'BUSINESS',
    icon: 'Wrench',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    routes: [
      { path: '/dashboard/elevators', label: 'Dashboard', permission: 'elevators:view' },
      { path: '/dashboard/elevators/clients', label: 'Clientes', permission: 'elevators:clients' },
      { path: '/dashboard/elevators/maintenance', label: 'Mantenimiento', permission: 'elevators:maintenance' },
    ]
  },
  servers: {
    id: 'servers',
    name: 'Servidores',
    description: 'Gestión de servidores y monitoreo',
    category: 'TECHNICAL',
    icon: 'Server',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    routes: [
      { path: '/dashboard/servers', label: 'Dashboard', permission: 'servers:view' },
      { path: '/dashboard/servers/monitoring', label: 'Monitoreo', permission: 'servers:monitoring' },
      { path: '/dashboard/servers/maintenance', label: 'Mantenimiento', permission: 'servers:maintenance' },
    ]
  },
  schools: {
    id: 'schools',
    name: 'Colegios',
    description: 'Gestión escolar y académica',
    category: 'EDUCATION',
    icon: 'GraduationCap',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    routes: [
      { path: '/dashboard/schools', label: 'Dashboard', permission: 'schools:view' },
      { path: '/dashboard/schools/students', label: 'Estudiantes', permission: 'schools:students' },
      { path: '/dashboard/schools/teachers', label: 'Profesores', permission: 'schools:teachers' },
    ]
  },
  hr: {
    id: 'hr',
    name: 'Recursos Humanos',
    description: 'Gestión de empleados y nómina',
    category: 'ADMINISTRATIVE',
    icon: 'Users',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    routes: [
      { path: '/dashboard/hr', label: 'Dashboard', permission: 'hr:view' },
      { path: '/dashboard/hr/employees', label: 'Empleados', permission: 'hr:employees' },
      { path: '/dashboard/hr/payroll', label: 'Nómina', permission: 'hr:payroll' },
    ]
  },
  analytics: {
    id: 'analytics',
    name: 'Analytics',
    description: 'Reportes y análisis de datos',
    category: 'ANALYTICS',
    icon: 'BarChart3',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    routes: [
      { path: '/dashboard/reports', label: 'Reportes', permission: 'analytics:view' },
      { path: '/dashboard/analytics', label: 'Dashboard', permission: 'analytics:dashboard' },
    ]
  }
}

export interface ModuleInfo {
  id: string
  name: string
  description: string
  category: string
  icon: string
  color: string
  bgColor: string
  routes: Array<{
    path: string
    label: string
    permission: string
  }>
}

export interface UseEnabledModulesReturn {
  enabledModules: string[]
  availableModules: ModuleInfo[]
  categorizedModules: Record<string, ModuleInfo[]>
  hasModule: (moduleId: string) => boolean
  getModuleInfo: (moduleId: string) => ModuleInfo | null
  loading: boolean
}

export function useEnabledModules(): UseEnabledModulesReturn {
  const { user, loading } = useAuth()

  const enabledModules = useMemo(() => {
    return user?.enabledModules || []
  }, [user?.enabledModules])

  const availableModules = useMemo(() => {
    return Object.values(MODULE_CONFIG).filter(module => 
      enabledModules.includes(module.id)
    )
  }, [enabledModules])

  const categorizedModules = useMemo(() => {
    return availableModules.reduce((acc, module) => {
      const category = module.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(module)
      return acc
    }, {} as Record<string, ModuleInfo[]>)
  }, [availableModules])

  const hasModule = (moduleId: string): boolean => {
    return enabledModules.includes(moduleId)
  }

  const getModuleInfo = (moduleId: string): ModuleInfo | null => {
    return MODULE_CONFIG[moduleId as keyof typeof MODULE_CONFIG] || null
  }

  return {
    enabledModules,
    availableModules,
    categorizedModules,
    hasModule,
    getModuleInfo,
    loading
  }
}
