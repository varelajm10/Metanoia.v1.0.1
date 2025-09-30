'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import toast from 'react-hot-toast'
import { Loader2, Settings } from 'lucide-react'

interface ManageModulesDialogProps {
  isOpen: boolean
  onClose: () => void
  tenantId: string
  tenantName: string
  enabledModules: string[]
}

// Lista de módulos disponibles en Metanoia
const AVAILABLE_MODULES = [
  {
    id: 'crm',
    name: 'CRM',
    description: 'Gestión de relaciones con clientes',
    category: 'Ventas'
  },
  {
    id: 'inventory',
    name: 'Inventario',
    description: 'Control de stock y productos',
    category: 'Operaciones'
  },
  {
    id: 'billing',
    name: 'Facturación',
    description: 'Gestión de facturas y pagos',
    category: 'Finanzas'
  },
  {
    id: 'elevators',
    name: 'Ascensores',
    description: 'Mantenimiento y gestión de ascensores',
    category: 'Especializado'
  }
]

export function ManageModulesDialog({
  isOpen,
  onClose,
  tenantId,
  tenantName,
  enabledModules
}: ManageModulesDialogProps) {
  const [moduleStates, setModuleStates] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Inicializar estados de módulos cuando se abre el dialog
  useState(() => {
    if (isOpen) {
      const initialStates: Record<string, boolean> = {}
      AVAILABLE_MODULES.forEach(module => {
        initialStates[module.id] = enabledModules.includes(module.id)
      })
      setModuleStates(initialStates)
    }
  })

  const handleModuleToggle = (moduleId: string, checked: boolean) => {
    setModuleStates(prev => ({
      ...prev,
      [moduleId]: checked
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      const updatedModules = Object.entries(moduleStates)
        .filter(([_, isEnabled]) => isEnabled)
        .map(([moduleId, _]) => moduleId)

      const response = await fetch(`/api/superadmin/tenants/${tenantId}/modules`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enabledModules: updatedModules
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al actualizar módulos')
      }

      toast.success(`Los módulos para ${tenantName} han sido actualizados correctamente.`)

      onClose()
    } catch (error) {
      console.error('Error updating modules:', error)
      toast.error(error instanceof Error ? error.message : 'Error al actualizar módulos')
    } finally {
      setIsLoading(false)
    }
  }

  const hasChanges = () => {
    return AVAILABLE_MODULES.some(module => {
      const currentState = moduleStates[module.id] || false
      const originalState = enabledModules.includes(module.id)
      return currentState !== originalState
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Gestionar Módulos
          </DialogTitle>
          <DialogDescription>
            Activa o desactiva módulos para <strong>{tenantName}</strong>. 
            Los cambios se aplicarán inmediatamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {AVAILABLE_MODULES.map((module, index) => (
            <div key={module.id}>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Label 
                      htmlFor={`module-${module.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {module.name}
                    </Label>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {module.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {module.description}
                  </p>
                </div>
                <Switch
                  id={`module-${module.id}`}
                  checked={moduleStates[module.id] || false}
                  onCheckedChange={(checked) => handleModuleToggle(module.id, checked)}
                  disabled={isLoading}
                />
              </div>
              {index < AVAILABLE_MODULES.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading || !hasChanges()}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
