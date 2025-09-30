"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Loader2 } from "lucide-react"

// 1. Definimos el esquema de validación con Zod
const tenantFormSchema = z.object({
  companyName: z.string().min(2, "El nombre de la empresa es requerido."),
  adminFirstName: z.string().min(2, "El nombre es requerido."),
  adminLastName: z.string().min(2, "El apellido es requerido."),
  adminEmail: z.string().email("El email no es válido."),
})

type TenantFormValues = z.infer<typeof tenantFormSchema>

export function CreateTenantDialog() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      companyName: "",
      adminFirstName: "",
      adminLastName: "",
      adminEmail: "",
    },
  })

  const onSubmit = async (data: TenantFormValues) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/superadmin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al crear el cliente.")
      }

      const result = await response.json()

      toast.success("El nuevo cliente ha sido creado correctamente.")

      setOpen(false) // Cierra el modal
      form.reset() // Resetea el formulario
      router.refresh() // Refresca los datos de la página

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Algo salió mal al crear el cliente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Nuevo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Cliente Empresa</DialogTitle>
          <DialogDescription>
            Completa los datos para dar de alta un nuevo tenant y su administrador principal.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">
              Nombre de la Empresa <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="companyName" 
              {...form.register("companyName")} 
              placeholder="Ej: Empresa ABC S.A."
            />
            {form.formState.errors.companyName && (
              <p className="text-red-500 text-xs">
                {form.formState.errors.companyName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminFirstName">
              Nombre del Administrador <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="adminFirstName" 
              {...form.register("adminFirstName")} 
              placeholder="Ej: Juan"
            />
            {form.formState.errors.adminFirstName && (
              <p className="text-red-500 text-xs">
                {form.formState.errors.adminFirstName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminLastName">
              Apellido del Administrador <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="adminLastName" 
              {...form.register("adminLastName")} 
              placeholder="Ej: Pérez"
            />
            {form.formState.errors.adminLastName && (
              <p className="text-red-500 text-xs">
                {form.formState.errors.adminLastName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminEmail">
              Email del Administrador <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="adminEmail" 
              {...form.register("adminEmail")} 
              type="email"
              placeholder="admin@empresa.com"
            />
            {form.formState.errors.adminEmail && (
              <p className="text-red-500 text-xs">
                {form.formState.errors.adminEmail.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Se enviará un email con la contraseña temporal a esta dirección
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Creando..." : "Crear Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
