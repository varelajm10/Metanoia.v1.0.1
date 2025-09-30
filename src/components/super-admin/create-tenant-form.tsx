'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Loader2 } from 'lucide-react'
import { createTenant } from '@/lib/actions/super-admin-actions'

// Esquema de validación
const createTenantSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  slug: z
    .string()
    .min(2, 'El slug debe tener al menos 2 caracteres')
    .max(50, 'El slug no puede tener más de 50 caracteres')
    .regex(
      /^[a-z0-9-]+$/,
      'El slug solo puede contener letras minúsculas, números y guiones'
    ),
  domain: z.string().optional().or(z.literal('')),
})

type CreateTenantFormData = z.infer<typeof createTenantSchema>

export function CreateTenantForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateTenantFormData>({
    resolver: zodResolver(createTenantSchema),
  })

  const watchedSlug = watch('slug')

  // Función para generar slug automáticamente
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Remover guiones múltiples
      .trim()
  }

  const onSubmit = async (data: CreateTenantFormData) => {
    startTransition(async () => {
      try {
        const result = await createTenant(
          data.name,
          data.slug,
          data.domain || undefined
        )

        if (result.success) {
          toast.success(result.message)
          setIsOpen(false)
          reset()
          // Recargar la página para mostrar el nuevo tenant
          window.location.reload()
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error('Error creating tenant:', error)
        toast.error('Error al crear el tenant')
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Tenant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Tenant</DialogTitle>
          <DialogDescription>
            Crea una nueva organización en el sistema. Todos los campos son
            obligatorios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Organización</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Ej: Empresa ABC S.A."
              onChange={e => {
                const name = e.target.value
                const slug = generateSlug(name)
                // Actualizar el campo slug automáticamente
                const slugInput = document.getElementById(
                  'slug'
                ) as HTMLInputElement
                if (slugInput) {
                  slugInput.value = slug
                }
              }}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              {...register('slug')}
              placeholder="empresa-abc"
              value={watchedSlug}
            />
            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Se usará para la URL: metanoia.click/
              {watchedSlug || 'tenant-slug'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Dominio Personalizado (Opcional)</Label>
            <Input
              id="domain"
              {...register('domain')}
              placeholder="miempresa.com"
            />
            {errors.domain && (
              <p className="text-sm text-red-500">{errors.domain.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Si se proporciona, el tenant será accesible desde este dominio
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Tenant
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
