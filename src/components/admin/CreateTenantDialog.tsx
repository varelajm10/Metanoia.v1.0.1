"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"

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
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle } from "lucide-react"

// Este esquema es para el FORMULARIO
const formSchema = z.object({
  companyName: z.string().min(2, "El nombre de la empresa es requerido."),
  adminFirstName: z.string().min(2, "El nombre es requerido."),
  adminLastName: z.string().min(2, "El apellido es requerido."),
  adminEmail: z.string().email("El email no es válido."),
})

type FormValues = z.infer<typeof formSchema>

export function CreateTenantDialog() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      // El endpoint /api/superadmin/tenants espera los datos del formulario original
      const response = await fetch('/api/superadmin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), // Enviamos los datos del formulario directamente
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al crear el cliente.")
      }

      toast({
        title: "✅ Cliente Creado",
        description: "El nuevo tenant ha sido creado exitosamente.",
      })
      
      setOpen(false)
      form.reset()
      router.refresh()

    } catch (error) {
      toast({
        variant: "destructive",
        title: "❌ Error",
        description: error instanceof Error ? error.message : "Algo salió mal.",
      })
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Cliente Empresa</DialogTitle>
          <DialogDescription>
            Completa los datos para dar de alta un nuevo tenant y su administrador.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="companyName" className="text-right">Empresa</Label>
            <Input id="companyName" {...form.register("companyName")} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="adminFirstName" className="text-right">Nombre Admin</Label>
            <Input id="adminFirstName" {...form.register("adminFirstName")} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="adminLastName" className="text-right">Apellido Admin</Label>
            <Input id="adminLastName" {...form.register("adminLastName")} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="adminEmail" className="text-right">Email Admin</Label>
            <Input id="adminEmail" {...form.register("adminEmail")} className="col-span-3" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}