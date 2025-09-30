"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tenant } from "@prisma/client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Cog } from "lucide-react"

const ALL_MODULES = [
    { key: 'crm', name: 'Gestión de Clientes' },
    { key: 'inventory', name: 'Inventario' },
    { key: 'billing', name: 'Facturación' },
    { key: 'servers', name: 'Gestión de Servidores' },
    { key: 'elevators', name: 'Gestión de Ascensores' },
    { key: 'hr', name: 'Recursos Humanos' },
    { key: 'schools', name: 'Gestión de Colegios' },
];

interface ManageModulesDialogProps {
  tenant: Tenant;
}

export function ManageModulesDialog({ tenant }: ManageModulesDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // **LA CORRECCIÓN CLAVE ESTÁ AQUÍ**
  // Inicializamos el estado directamente con una función,
  // lo que garantiza que sea consistente entre servidor y cliente.
  // Se elimina la necesidad del `useEffect`.
  const [enabledModules, setEnabledModules] = useState<Record<string, boolean>>(
    () => {
      const modules = tenant.settings?.enabledModules as string[] || [];
      return ALL_MODULES.reduce((acc, module) => {
        acc[module.key] = modules.includes(module.key);
        return acc;
      }, {} as Record<string, boolean>);
    }
  );

  const handleSwitchChange = (moduleKey: string, checked: boolean) => {
    setEnabledModules(prev => ({ ...prev, [moduleKey]: checked }));
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Convertir el objeto enabledModules a un array de strings
      const enabledModulesArray = Object.entries(enabledModules)
        .filter(([_, enabled]) => enabled)
        .map(([key, _]) => key);
      
      const response = await fetch(`/api/superadmin/tenants/${tenant.id}/modules`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabledModules: enabledModulesArray }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar los módulos.");
      }

      toast({ title: "✅ Éxito", description: "Los módulos del cliente han sido actualizados." });
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({ variant: "destructive", title: "❌ Error", description: (error as Error).message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Gestionar Módulos">
          <Cog className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gestionar Módulos para {tenant.name}</DialogTitle>
          <DialogDescription>
            Activa o desactiva los módulos a los que este cliente tendrá acceso.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {ALL_MODULES.map((module) => (
            <div key={module.key} className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <Label htmlFor={`${module.key}-${tenant.id}`}>{module.name}</Label>
              <Switch
                id={`${module.key}-${tenant.id}`}
                checked={!!enabledModules[module.key]}
                onCheckedChange={(checked) => handleSwitchChange(module.key, checked)}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}