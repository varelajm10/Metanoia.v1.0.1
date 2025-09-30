'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Users,
  Package,
  BarChart3,
  Calculator,
  ShoppingCart,
  Globe,
  Server,
  Building2,
  GraduationCap,
  UserPlus,
  Plus,
  Settings,
  Search,
  Home,
  Sparkles,
  Wand2,
  Brain,
  TrendingUp,
  FileText,
  CreditCard,
  Bell,
} from 'lucide-react'

interface CommandPaletteProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange?.(!open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  if (!mounted) {
    return null
  }

  const runCommand = (command: () => unknown) => {
    command()
    onOpenChange?.(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Buscar comandos, módulos o acciones..." 
        className="border-0 focus:ring-0"
      />
      <CommandList className="max-h-[400px]">
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
        
        {/* Sección de IA - Futuro */}
        <CommandGroup heading="🤖 Asistencia con IA">
          <CommandItem
            onSelect={() => runCommand(() => {
              // TODO: Implementar análisis de datos con IA
              console.log('Análisis de datos con IA')
            })}
            className="cursor-pointer"
          >
            <Brain className="mr-2 h-4 w-4 text-purple-500" />
            <span>Analizar rendimiento del negocio</span>
            <span className="ml-auto text-xs text-muted-foreground">Próximamente</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => {
              // TODO: Implementar sugerencias de IA
              console.log('Sugerencias de IA')
            })}
            className="cursor-pointer"
          >
            <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
            <span>Obtener sugerencias inteligentes</span>
            <span className="ml-auto text-xs text-muted-foreground">Próximamente</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => {
              // TODO: Implementar reportes automáticos
              console.log('Generar reporte automático')
            })}
            className="cursor-pointer"
          >
            <FileText className="mr-2 h-4 w-4 text-blue-500" />
            <span>Generar reporte automático</span>
            <span className="ml-auto text-xs text-muted-foreground">Próximamente</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Acciones Rápidas */}
        <CommandGroup heading="⚡ Acciones Rápidas">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/dashboard/crm?action=add-customer'))}
            className="cursor-pointer"
          >
            <UserPlus className="mr-2 h-4 w-4 text-green-500" />
            <span>Agregar Cliente</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/dashboard/inventory?action=add-product'))}
            className="cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4 text-blue-500" />
            <span>Agregar Producto</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/dashboard/orders?action=create-order'))}
            className="cursor-pointer"
          >
            <ShoppingCart className="mr-2 h-4 w-4 text-orange-500" />
            <span>Crear Orden</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/dashboard/accounting?action=new-invoice'))}
            className="cursor-pointer"
          >
            <CreditCard className="mr-2 h-4 w-4 text-purple-500" />
            <span>Crear Factura</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Navegación Principal */}
        <CommandGroup heading="🧭 Navegación">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/dashboard'))}
            className="cursor-pointer"
          >
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard Principal</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/dashboard/crm'))}
            className="cursor-pointer"
          >
            <Users className="mr-2 h-4 w-4" />
            <span>Gestión de Clientes</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/dashboard/inventory'))}
            className="cursor-pointer"
          >
            <Package className="mr-2 h-4 w-4" />
            <span>Inventario</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/dashboard/orders'))}
            className="cursor-pointer"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Órdenes</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/dashboard/accounting'))}
            className="cursor-pointer"
          >
            <Calculator className="mr-2 h-4 w-4" />
            <span>Contabilidad</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/dashboard/reports'))}
            className="cursor-pointer"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Reportes y Analytics</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Módulos Especializados */}
        <CommandGroup heading="🔧 Módulos Especializados">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/dashboard/elevators'))}
            className="cursor-pointer"
          >
            <Building2 className="mr-2 h-4 w-4" />
            <span>Gestión de Ascensores</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/dashboard/servers'))}
            className="cursor-pointer"
          >
            <Server className="mr-2 h-4 w-4" />
            <span>Gestión de Servidores</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/dashboard/schools'))}
            className="cursor-pointer"
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            <span>Gestión Escolar</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/dashboard/foreign-trade'))}
            className="cursor-pointer"
          >
            <Globe className="mr-2 h-4 w-4" />
            <span>Comercio Exterior</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Configuración */}
        <CommandGroup heading="⚙️ Configuración">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/dashboard/settings'))}
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración del Sistema</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/dashboard/modules'))}
            className="cursor-pointer"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            <span>Gestionar Módulos</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

// Hook para usar la paleta de comandos
export function useCommandPalette() {
  const [open, setOpen] = useState(false)

  return {
    open,
    setOpen,
    CommandPalette: () => <CommandPalette open={open} onOpenChange={setOpen} />
  }
}
