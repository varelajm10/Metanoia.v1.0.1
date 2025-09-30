'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'cmdk'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import {
  Users,
  Package,
  Calculator,
  Building2,
  Settings,
  BarChart3,
  ShoppingCart,
  School,
  Server,
  Elevator,
  Globe,
  UserPlus,
  PackagePlus,
  FileText,
  Plus,
  Search,
  Home,
  UserCheck,
  Calendar,
  Wrench,
  AlertTriangle,
  Network,
  MapPin,
  GraduationCap,
  Database,
  TrendingUp,
  CreditCard,
  FileSpreadsheet,
  Shield,
  Cog,
} from 'lucide-react'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')

  // Acciones principales
  const mainActions = [
    {
      id: 'new-customer',
      label: 'Agregar Nuevo Cliente',
      description: 'Crear un nuevo cliente en el CRM',
      icon: UserPlus,
      action: () => router.push('/dashboard/crm'),
    },
    {
      id: 'new-product',
      label: 'Agregar Nuevo Producto',
      description: 'Crear un nuevo producto en inventario',
      icon: PackagePlus,
      action: () => router.push('/dashboard/inventory'),
    },
    {
      id: 'new-employee',
      label: 'Agregar Nuevo Empleado',
      description: 'Registrar un nuevo empleado en RRHH',
      icon: UserCheck,
      action: () => router.push('/dashboard/hr/employees/new'),
    },
    {
      id: 'new-elevator',
      label: 'Registrar Nuevo Ascensor',
      description: 'Agregar un nuevo ascensor al sistema',
      icon: Elevator,
      action: () => router.push('/dashboard/elevators/new'),
    },
  ]

  // Navegación por módulos
  const navigation = [
    {
      group: 'Módulos Principales',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard Principal',
          description: 'Vista general del sistema',
          icon: Home,
          path: '/dashboard',
        },
        {
          id: 'crm',
          label: 'CRM - Gestión de Clientes',
          description: 'Gestionar clientes y oportunidades',
          icon: Users,
          path: '/dashboard/crm',
        },
        {
          id: 'inventory',
          label: 'Inventario',
          description: 'Gestionar productos y stock',
          icon: Package,
          path: '/dashboard/inventory',
        },
        {
          id: 'accounting',
          label: 'Contabilidad',
          description: 'Gestión financiera y contable',
          icon: Calculator,
          path: '/dashboard/accounting',
        },
        {
          id: 'hr',
          label: 'Recursos Humanos',
          description: 'Gestión de empleados y nómina',
          icon: Building2,
          path: '/dashboard/hr',
        },
        {
          id: 'sales',
          label: 'Ventas',
          description: 'Gestión de ventas y pedidos',
          icon: ShoppingCart,
          path: '/dashboard/sales',
        },
      ],
    },
    {
      group: 'Módulos Especializados',
      items: [
        {
          id: 'elevators',
          label: 'Gestión de Ascensores',
          description: 'Mantenimiento y gestión de ascensores',
          icon: Elevator,
          path: '/dashboard/elevators',
        },
        {
          id: 'servers',
          label: 'Gestión de Servidores',
          description: 'Monitoreo y administración de servidores',
          icon: Server,
          path: '/dashboard/servers',
        },
        {
          id: 'schools',
          label: 'Gestión Escolar',
          description: 'Administración de instituciones educativas',
          icon: School,
          path: '/dashboard/schools',
        },
        {
          id: 'foreign-trade',
          label: 'Comercio Exterior',
          description: 'Gestión de importaciones y exportaciones',
          icon: Globe,
          path: '/dashboard/foreign-trade',
        },
      ],
    },
    {
      group: 'Herramientas y Reportes',
      items: [
        {
          id: 'reports',
          label: 'Reportes y Analytics',
          description: 'Generar reportes y análisis',
          icon: BarChart3,
          path: '/dashboard/reports',
        },
        {
          id: 'billing',
          label: 'Facturación',
          description: 'Gestión de facturas y pagos',
          icon: CreditCard,
          path: '/dashboard/billing',
        },
        {
          id: 'settings',
          label: 'Configuración',
          description: 'Configurar el sistema',
          icon: Settings,
          path: '/dashboard/settings',
        },
      ],
    },
  ]

  // Acciones de búsqueda
  const searchActions = [
    {
      id: 'search-customers',
      label: 'Buscar Clientes...',
      description: 'Encontrar clientes específicos',
      icon: Search,
      action: () => router.push('/dashboard/crm'),
    },
    {
      id: 'search-products',
      label: 'Buscar Productos...',
      description: 'Encontrar productos en inventario',
      icon: Package,
      action: () => router.push('/dashboard/inventory'),
    },
    {
      id: 'search-employees',
      label: 'Buscar Empleados...',
      description: 'Encontrar empleados en RRHH',
      icon: Users,
      action: () => router.push('/dashboard/hr'),
    },
    {
      id: 'search-elevators',
      label: 'Buscar Ascensores...',
      description: 'Encontrar ascensores específicos',
      icon: Elevator,
      action: () => router.push('/dashboard/elevators'),
    },
  ]

  const handleSelect = (action: () => void) => {
    action()
    onOpenChange(false)
    setSearch('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        <Command className="rounded-lg border shadow-md">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Buscar comandos, módulos o acciones..."
              value={search}
              onValueChange={setSearch}
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList className="max-h-[400px] overflow-y-auto">
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>

            {/* Acciones principales */}
            <CommandGroup heading="Acciones Rápidas">
              {mainActions.map((action) => (
                <CommandItem
                  key={action.id}
                  value={action.label}
                  onSelect={() => handleSelect(action.action)}
                  className="flex cursor-pointer items-center space-x-3 px-3 py-2"
                >
                  <action.icon className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">{action.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {action.description}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Navegación por módulos */}
            {navigation.map((group) => (
              <CommandGroup key={group.group} heading={group.group}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.label}
                    onSelect={() => handleSelect(() => router.push(item.path))}
                    className="flex cursor-pointer items-center space-x-3 px-3 py-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}

            {/* Acciones de búsqueda */}
            <CommandGroup heading="Búsquedas">
              {searchActions.map((action) => (
                <CommandItem
                  key={action.id}
                  value={action.label}
                  onSelect={() => handleSelect(action.action)}
                  className="flex cursor-pointer items-center space-x-3 px-3 py-2"
                >
                  <action.icon className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">{action.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {action.description}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

// Hook para manejar el atajo de teclado
export function useCommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return { open, setOpen }
}
