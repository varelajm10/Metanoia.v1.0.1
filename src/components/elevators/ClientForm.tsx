'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  Building2,
  MapPin,
  Phone,
  Mail,
  Save,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'

const ClientFormSchema = z.object({
  name: z.string().min(1, 'Nombre es requerido'),
  company: z.string().optional(),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  address: z.string().min(1, 'Dirección es requerida'),
  city: z.string().min(1, 'Ciudad es requerida'),
  state: z.string().min(1, 'Estado es requerido'),
  clientType: z.enum([
    'INDIVIDUAL',
    'COMPANY',
    'PROPERTY_MANAGER',
    'CONSTRUCTOR',
    'ARCHITECT',
    'GOVERNMENT',
  ]),
  industry: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PROSPECTIVE', 'SUSPENDED']),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  notes: z.string().optional(),
})

type ClientFormData = z.infer<typeof ClientFormSchema>

interface ClientFormProps {
  client?: any
  onSave: (data: ClientFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export default function ClientForm({
  client,
  onSave,
  onCancel,
  isLoading = false,
}: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ClientFormData>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues: client
      ? {
          name: client.name || '',
          company: client.company || '',
          email: client.email || '',
          phone: client.phone || '',
          address: client.address || '',
          city: client.city || '',
          state: client.state || '',
          clientType: client.clientType || 'INDIVIDUAL',
          industry: client.industry || '',
          status: client.status || 'ACTIVE',
          emergencyContact: client.emergencyContact || '',
          emergencyPhone: client.emergencyPhone || '',
          notes: client.notes || '',
        }
      : {
          name: '',
          company: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          clientType: 'INDIVIDUAL',
          industry: '',
          status: 'ACTIVE',
          emergencyContact: '',
          emergencyPhone: '',
          notes: '',
        },
  })

  const watchedClientType = watch('clientType')
  const watchedStatus = watch('status')

  const onSubmit = async (data: ClientFormData) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)
      setSubmitSuccess(false)

      await onSave(data)

      setSubmitSuccess(true)
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 3000)
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Error al guardar cliente'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const getClientTypeText = (type: string) => {
    switch (type) {
      case 'INDIVIDUAL':
        return 'Individual'
      case 'COMPANY':
        return 'Empresa'
      case 'PROPERTY_MANAGER':
        return 'Administrador'
      case 'CONSTRUCTOR':
        return 'Constructor'
      case 'ARCHITECT':
        return 'Arquitecto'
      case 'GOVERNMENT':
        return 'Gobierno'
      default:
        return 'Desconocido'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600'
      case 'INACTIVE':
        return 'text-gray-600'
      case 'PROSPECTIVE':
        return 'text-blue-600'
      case 'SUSPENDED':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Activo'
      case 'INACTIVE':
        return 'Inactivo'
      case 'PROSPECTIVE':
        return 'Prospecto'
      case 'SUSPENDED':
        return 'Suspendido'
      default:
        return 'Desconocido'
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {client ? 'Editar Cliente' : 'Nuevo Cliente'}
              </CardTitle>
              <CardDescription>
                {client
                  ? 'Modifica la información del cliente'
                  : 'Completa la información del nuevo cliente'}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Información Básica</TabsTrigger>
                <TabsTrigger value="contact">Contacto</TabsTrigger>
                <TabsTrigger value="additional">
                  Información Adicional
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Juan Pérez"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa</Label>
                    <Input
                      id="company"
                      {...register('company')}
                      placeholder="Empresa Constructora ABC"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientType">Tipo de Cliente *</Label>
                    <Select
                      onValueChange={value =>
                        setValue('clientType', value as any)
                      }
                    >
                      <SelectTrigger
                        className={errors.clientType ? 'border-red-500' : ''}
                      >
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                        <SelectItem value="COMPANY">Empresa</SelectItem>
                        <SelectItem value="PROPERTY_MANAGER">
                          Administrador
                        </SelectItem>
                        <SelectItem value="CONSTRUCTOR">Constructor</SelectItem>
                        <SelectItem value="ARCHITECT">Arquitecto</SelectItem>
                        <SelectItem value="GOVERNMENT">Gobierno</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.clientType && (
                      <p className="text-sm text-red-600">
                        {errors.clientType.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industria</Label>
                    <Select
                      onValueChange={value => setValue('industry', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar industria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Construcción">
                          Construcción
                        </SelectItem>
                        <SelectItem value="Residencial">Residencial</SelectItem>
                        <SelectItem value="Comercial">Comercial</SelectItem>
                        <SelectItem value="Industrial">Industrial</SelectItem>
                        <SelectItem value="Gobierno">Gobierno</SelectItem>
                        <SelectItem value="Educación">Educación</SelectItem>
                        <SelectItem value="Salud">Salud</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Estado *</Label>
                    <Select
                      onValueChange={value => setValue('status', value as any)}
                    >
                      <SelectTrigger
                        className={errors.status ? 'border-red-500' : ''}
                      >
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Activo</SelectItem>
                        <SelectItem value="INACTIVE">Inactivo</SelectItem>
                        <SelectItem value="PROSPECTIVE">Prospecto</SelectItem>
                        <SelectItem value="SUSPENDED">Suspendido</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.status && (
                      <p className="text-sm text-red-600">
                        {errors.status.message}
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="cliente@email.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      placeholder="+52 55 1234-5678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">
                      Contacto de Emergencia
                    </Label>
                    <Input
                      id="emergencyContact"
                      {...register('emergencyContact')}
                      placeholder="María Pérez"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">
                      Teléfono de Emergencia
                    </Label>
                    <Input
                      id="emergencyPhone"
                      {...register('emergencyPhone')}
                      placeholder="+52 55 9876-5432"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección *</Label>
                    <Input
                      id="address"
                      {...register('address')}
                      placeholder="Av. Principal 123, Col. Centro"
                      className={errors.address ? 'border-red-500' : ''}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-600">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad *</Label>
                    <Input
                      id="city"
                      {...register('city')}
                      placeholder="Ciudad de México"
                      className={errors.city ? 'border-red-500' : ''}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado *</Label>
                    <Input
                      id="state"
                      {...register('state')}
                      placeholder="CDMX"
                      className={errors.state ? 'border-red-500' : ''}
                    />
                    {errors.state && (
                      <p className="text-sm text-red-600">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="additional" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notas Adicionales</Label>
                  <Textarea
                    id="notes"
                    {...register('notes')}
                    placeholder="Información adicional sobre el cliente..."
                    rows={4}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Status Indicators */}
            <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">
                  Tipo: {getClientTypeText(watchedClientType)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${
                    watchedStatus === 'ACTIVE'
                      ? 'bg-green-500'
                      : watchedStatus === 'INACTIVE'
                        ? 'bg-gray-500'
                        : watchedStatus === 'PROSPECTIVE'
                          ? 'bg-blue-500'
                          : watchedStatus === 'SUSPENDED'
                            ? 'bg-red-500'
                            : 'bg-gray-500'
                  }`}
                ></div>
                <span
                  className={`text-sm font-medium ${getStatusColor(watchedStatus)}`}
                >
                  Estado: {getStatusText(watchedStatus)}
                </span>
              </div>
            </div>

            {/* Submit Status */}
            {submitError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600">{submitError}</span>
              </div>
            )}

            {submitSuccess && (
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">
                  Cliente guardado correctamente
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 border-t pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {client ? 'Actualizar' : 'Crear'} Cliente
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
