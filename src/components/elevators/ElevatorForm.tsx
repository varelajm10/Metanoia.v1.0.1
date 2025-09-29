'use client'

import { useState, useEffect } from 'react'
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
  Building2,
  Settings,
  MapPin,
  User,
  Save,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'

const ElevatorFormSchema = z.object({
  serialNumber: z.string().min(1, 'Número de serie es requerido'),
  model: z.string().min(1, 'Modelo es requerido'),
  brand: z.string().min(1, 'Marca es requerida'),
  buildingName: z.string().min(1, 'Nombre del edificio es requerido'),
  buildingAddress: z.string().min(1, 'Dirección del edificio es requerida'),
  status: z.enum([
    'OPERATIONAL',
    'OUT_OF_SERVICE',
    'UNDER_MAINTENANCE',
    'UNDER_INSPECTION',
    'DECOMMISSIONED',
    'EMERGENCY_STOP',
  ]),
  capacity: z.number().min(1, 'Capacidad debe ser mayor a 0'),
  floors: z.number().min(1, 'Número de pisos debe ser mayor a 0'),
  speed: z.number().min(0.1, 'Velocidad debe ser mayor a 0'),
  clientId: z.string().min(1, 'Cliente es requerido'),
  installationDate: z.string().optional(),
  lastInspection: z.string().optional(),
  nextInspection: z.string().optional(),
  notes: z.string().optional(),
})

type ElevatorFormData = z.infer<typeof ElevatorFormSchema>

interface ElevatorFormProps {
  elevator?: any
  clients: any[]
  onSave: (data: ElevatorFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export default function ElevatorForm({
  elevator,
  clients,
  onSave,
  onCancel,
  isLoading = false,
}: ElevatorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<ElevatorFormData>({
    resolver: zodResolver(ElevatorFormSchema),
    defaultValues: elevator
      ? {
          serialNumber: elevator.serialNumber || '',
          model: elevator.model || '',
          brand: elevator.brand || '',
          buildingName: elevator.buildingName || '',
          buildingAddress: elevator.buildingAddress || '',
          status: elevator.status || 'OPERATIONAL',
          capacity: elevator.capacity || 1000,
          floors: elevator.floors || 1,
          speed: elevator.speed || 1.0,
          clientId: elevator.clientId || '',
          installationDate: elevator.installationDate || '',
          lastInspection: elevator.lastInspection || '',
          nextInspection: elevator.nextInspection || '',
          notes: elevator.notes || '',
        }
      : {
          serialNumber: '',
          model: '',
          brand: '',
          buildingName: '',
          buildingAddress: '',
          status: 'OPERATIONAL',
          capacity: 1000,
          floors: 1,
          speed: 1.0,
          clientId: '',
          installationDate: '',
          lastInspection: '',
          nextInspection: '',
          notes: '',
        },
  })

  const watchedStatus = watch('status')

  const onSubmit = async (data: ElevatorFormData) => {
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
        error instanceof Error ? error.message : 'Error al guardar ascensor'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPERATIONAL':
        return 'text-green-600'
      case 'UNDER_MAINTENANCE':
        return 'text-yellow-600'
      case 'OUT_OF_SERVICE':
        return 'text-red-600'
      case 'UNDER_INSPECTION':
        return 'text-blue-600'
      case 'DECOMMISSIONED':
        return 'text-gray-600'
      case 'EMERGENCY_STOP':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPERATIONAL':
        return 'Operativo'
      case 'UNDER_MAINTENANCE':
        return 'En Mantenimiento'
      case 'OUT_OF_SERVICE':
        return 'Fuera de Servicio'
      case 'UNDER_INSPECTION':
        return 'En Inspección'
      case 'DECOMMISSIONED':
        return 'Desmantelado'
      case 'EMERGENCY_STOP':
        return 'Parada de Emergencia'
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
                <Building2 className="h-5 w-5" />
                {elevator ? 'Editar Ascensor' : 'Nuevo Ascensor'}
              </CardTitle>
              <CardDescription>
                {elevator
                  ? 'Modifica la información del ascensor'
                  : 'Completa la información del nuevo ascensor'}
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
                <TabsTrigger value="technical">
                  Especificaciones Técnicas
                </TabsTrigger>
                <TabsTrigger value="maintenance">Mantenimiento</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="serialNumber">Número de Serie *</Label>
                    <Input
                      id="serialNumber"
                      {...register('serialNumber')}
                      placeholder="ASC-001"
                      className={errors.serialNumber ? 'border-red-500' : ''}
                    />
                    {errors.serialNumber && (
                      <p className="text-sm text-red-600">
                        {errors.serialNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca *</Label>
                    <Select onValueChange={value => setValue('brand', value)}>
                      <SelectTrigger
                        className={errors.brand ? 'border-red-500' : ''}
                      >
                        <SelectValue placeholder="Seleccionar marca" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Otis">Otis</SelectItem>
                        <SelectItem value="Schindler">Schindler</SelectItem>
                        <SelectItem value="KONE">KONE</SelectItem>
                        <SelectItem value="ThyssenKrupp">
                          ThyssenKrupp
                        </SelectItem>
                        <SelectItem value="Mitsubishi">Mitsubishi</SelectItem>
                        <SelectItem value="Fujitec">Fujitec</SelectItem>
                        <SelectItem value="Hyundai">Hyundai</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.brand && (
                      <p className="text-sm text-red-600">
                        {errors.brand.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Modelo *</Label>
                    <Input
                      id="model"
                      {...register('model')}
                      placeholder="Gen2, MonoSpace, 3000..."
                      className={errors.model ? 'border-red-500' : ''}
                    />
                    {errors.model && (
                      <p className="text-sm text-red-600">
                        {errors.model.message}
                      </p>
                    )}
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
                        <SelectItem value="OPERATIONAL">Operativo</SelectItem>
                        <SelectItem value="UNDER_MAINTENANCE">
                          En Mantenimiento
                        </SelectItem>
                        <SelectItem value="OUT_OF_SERVICE">
                          Fuera de Servicio
                        </SelectItem>
                        <SelectItem value="UNDER_INSPECTION">
                          En Inspección
                        </SelectItem>
                        <SelectItem value="DECOMMISSIONED">
                          Desmantelado
                        </SelectItem>
                        <SelectItem value="EMERGENCY_STOP">
                          Parada de Emergencia
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.status && (
                      <p className="text-sm text-red-600">
                        {errors.status.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buildingName">Nombre del Edificio *</Label>
                    <Input
                      id="buildingName"
                      {...register('buildingName')}
                      placeholder="Torre Centro, Edificio Norte..."
                      className={errors.buildingName ? 'border-red-500' : ''}
                    />
                    {errors.buildingName && (
                      <p className="text-sm text-red-600">
                        {errors.buildingName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientId">Cliente *</Label>
                    <Select
                      onValueChange={value => setValue('clientId', value)}
                    >
                      <SelectTrigger
                        className={errors.clientId ? 'border-red-500' : ''}
                      >
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}{' '}
                            {client.company && `(${client.company})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.clientId && (
                      <p className="text-sm text-red-600">
                        {errors.clientId.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buildingAddress">
                    Dirección del Edificio *
                  </Label>
                  <Input
                    id="buildingAddress"
                    {...register('buildingAddress')}
                    placeholder="Av. Principal 123, Col. Centro, Ciudad"
                    className={errors.buildingAddress ? 'border-red-500' : ''}
                  />
                  {errors.buildingAddress && (
                    <p className="text-sm text-red-600">
                      {errors.buildingAddress.message}
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="technical" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacidad (kg) *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      {...register('capacity', { valueAsNumber: true })}
                      placeholder="1000"
                      className={errors.capacity ? 'border-red-500' : ''}
                    />
                    {errors.capacity && (
                      <p className="text-sm text-red-600">
                        {errors.capacity.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="floors">Número de Pisos *</Label>
                    <Input
                      id="floors"
                      type="number"
                      {...register('floors', { valueAsNumber: true })}
                      placeholder="15"
                      className={errors.floors ? 'border-red-500' : ''}
                    />
                    {errors.floors && (
                      <p className="text-sm text-red-600">
                        {errors.floors.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="speed">Velocidad (m/s) *</Label>
                    <Input
                      id="speed"
                      type="number"
                      step="0.1"
                      {...register('speed', { valueAsNumber: true })}
                      placeholder="1.5"
                      className={errors.speed ? 'border-red-500' : ''}
                    />
                    {errors.speed && (
                      <p className="text-sm text-red-600">
                        {errors.speed.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="installationDate">Fecha de Instalación</Label>
                  <Input
                    id="installationDate"
                    type="date"
                    {...register('installationDate')}
                  />
                </div>
              </TabsContent>

              <TabsContent value="maintenance" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="lastInspection">Última Inspección</Label>
                    <Input
                      id="lastInspection"
                      type="date"
                      {...register('lastInspection')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nextInspection">Próxima Inspección</Label>
                    <Input
                      id="nextInspection"
                      type="date"
                      {...register('nextInspection')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas Adicionales</Label>
                  <Textarea
                    id="notes"
                    {...register('notes')}
                    placeholder="Información adicional sobre el ascensor..."
                    rows={4}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Status Indicator */}
            {watchedStatus && (
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                <div
                  className={`h-3 w-3 rounded-full ${
                    watchedStatus === 'OPERATIONAL'
                      ? 'bg-green-500'
                      : watchedStatus === 'UNDER_MAINTENANCE'
                        ? 'bg-yellow-500'
                        : watchedStatus === 'OUT_OF_SERVICE'
                          ? 'bg-red-500'
                          : watchedStatus === 'UNDER_INSPECTION'
                            ? 'bg-blue-500'
                            : 'bg-gray-500'
                  }`}
                ></div>
                <span
                  className={`font-medium ${getStatusColor(watchedStatus)}`}
                >
                  Estado: {getStatusText(watchedStatus)}
                </span>
              </div>
            )}

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
                  Ascensor guardado correctamente
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
                    {elevator ? 'Actualizar' : 'Crear'} Ascensor
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
