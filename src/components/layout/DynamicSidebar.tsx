'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useEnabledModules } from '@/hooks/useEnabledModules'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  ChevronDown,
  ChevronRight,
  Users,
  Package,
  ShoppingCart,
  Calculator,
  BarChart3,
  Settings,
  Building2,
  Server,
  GraduationCap,
  Wrench,
  Home,
  Menu,
  X,
} from 'lucide-react'

// Configuración de módulos disponibles
const MODULE_CONFIG = {
  crm: {
    id: 'crm',
    name: 'CRM',
    description: 'Gestión de relaciones con clientes',
    category: 'BUSINESS',
    icon: Users,
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
    icon: Package,
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
    icon: Calculator,
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
    icon: Wrench,
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
    icon: Server,
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
    icon: GraduationCap,
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
    icon: Users,
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
    icon: BarChart3,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    routes: [
      { path: '/dashboard/reports', label: 'Reportes', permission: 'analytics:view' },
      { path: '/dashboard/analytics', label: 'Dashboard', permission: 'analytics:dashboard' },
    ]
  }
}

const CATEGORY_CONFIG = {
  BUSINESS: {
    name: 'Negocio',
    icon: ShoppingCart,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  FINANCIAL: {
    name: 'Finanzas',
    icon: Calculator,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  TECHNICAL: {
    name: 'Técnico',
    icon: Server,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  EDUCATION: {
    name: 'Educación',
    icon: GraduationCap,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  ADMINISTRATIVE: {
    name: 'Administrativo',
    icon: Settings,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50'
  },
  ANALYTICS: {
    name: 'Análisis',
    icon: BarChart3,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50'
  }
}

interface DynamicSidebarProps {
  isOpen?: boolean
  onToggle?: () => void
  className?: string
}

export function DynamicSidebar({ 
  isOpen = true, 
  onToggle,
  className = '' 
}: DynamicSidebarProps) {
  const { user } = useAuth()
  const { availableModules, categorizedModules, loading } = useEnabledModules()
  const pathname = usePathname()
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  const getCategoryIcon = (category: string) => {
    const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG]
    return config?.icon || Package
  }

  const getCategoryColor = (category: string) => {
    const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG]
    return config?.color || 'text-gray-600'
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const isRouteActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/')
  }

  if (!user || loading) {
    return (
      <div className={`h-full bg-white border-r border-gray-200 ${className}`}>
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`h-full bg-white border-r border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Metanoia</span>
          </div>
          {onToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="md:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {user.tenant?.name || 'Tenant'}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {/* Dashboard Link */}
        <Link
          href="/dashboard"
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
            isRouteActive('/dashboard') && !pathname.includes('/dashboard/')
              ? 'bg-primary text-primary-foreground'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Home className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>

        {/* Modules by Category */}
        {Object.entries(categorizedModules).map(([category, modules]) => (
          <Collapsible
            key={category}
            open={expandedCategories[category] ?? true}
            onOpenChange={() => toggleCategory(category)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto w-full justify-between p-2"
              >
                <div className="flex items-center space-x-2">
                  <span className={getCategoryColor(category)}>
                    {(() => {
                      const IconComponent = getCategoryIcon(category)
                      return <IconComponent className="h-4 w-4" />
                    })()}
                  </span>
                  <span className="text-sm font-medium">
                    {CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG]?.name || category}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {modules.length}
                  </Badge>
                </div>
                {(expandedCategories[category] ?? true) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="ml-6 space-y-1">
              {modules.map(module => (
                <div key={module.id} className="space-y-1">
                  <div className="flex items-center space-x-2 px-2 py-1">
                    <div className={`h-3 w-3 rounded-full ${module.bgColor}`} />
                    <span className="text-sm font-medium text-gray-700">
                      {module.name}
                    </span>
                  </div>

                  <div className="ml-5 space-y-1">
                    {module.routes.map((route) => (
                      <Link
                        key={route.path}
                        href={route.path}
                        className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                          isRouteActive(route.path)
                            ? 'bg-primary text-primary-foreground'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        {route.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}

        {/* No modules message */}
        {availableModules.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500">
              No hay módulos habilitados
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Contacta al administrador
            </p>
          </div>
        )}
      </nav>
    </div>
  )
}
