'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useRouter } from 'next/navigation'
import {
  Building2,
  Save,
  ArrowLeft,
  MapPin,
  Settings,
  User,
  Calendar,
  Shield,
} from 'lucide-react'

export default function NewElevatorPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    // Información básica
    name: '',
    model: '',
    brand: '',
    serialNumber: '',
    installationDate: '',
    capacity: '',
    speed: '',
    floors: '',

    // Ubicación
    buildingName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',

    // Cliente
    clientName: '',
    clientContact: '',
    clientPhone: '',
    clientEmail: '',

    // Configuración técnica
    motorType: '',
    controlSystem: '',
    doorType: '',
    carMaterial: '',

    // Mantenimiento
    maintenanceContract: false,
    maintenanceFrequency: '',
    lastInspection: '',
    nextInspection: '',

    // Estado
    status: 'operational',
    notes: '',
  })

  const [loading, setLoading] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simular envío de datos
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('Datos del ascensor:', formData)

      // Redirigir al dashboard
      router.push('/dashboard/elevators')
    } catch (error) {
      console.error('Error al crear ascensor:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Nuevo Ascensor
            </h1>
            <p className="text-muted-foreground">
              Registra un nuevo ascensor en el sistema
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              Información Básica
            </CardTitle>
            <CardDescription>Datos principales del ascensor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Nombre del Ascensor *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder="Ej: Torre Centro - Ascensor A"
                  required
                />
              </div>
              <div>
                <Label htmlFor="model">Modelo *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={e => handleInputChange('model', e.target.value)}
                  placeholder="Ej: Gen2-MR"
                  required
                />
              </div>
              <div>
                <Label htmlFor="brand">Marca *</Label>
                <Select
                  value={formData.brand}
                  onValueChange={value => handleInputChange('brand', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar marca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="otis">Otis</SelectItem>
                    <SelectItem value="schindler">Schindler</SelectItem>
                    <SelectItem value="kone">KONE</SelectItem>
                    <SelectItem value="thyssenkrupp">ThyssenKrupp</SelectItem>
                    <SelectItem value="mitsubishi">Mitsubishi</SelectItem>
                    <SelectItem value="fujitec">Fujitec</SelectItem>
                    <SelectItem value="hyundai">Hyundai</SelectItem>
                    <SelectItem value="other">Otra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="serialNumber">Número de Serie *</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={e =>
                    handleInputChange('serialNumber', e.target.value)
                  }
                  placeholder="Ej: ASC-001-2025"
                  required
                />
              </div>
              <div>
                <Label htmlFor="installationDate">Fecha de Instalación</Label>
                <Input
                  id="installationDate"
                  type="date"
                  value={formData.installationDate}
                  onChange={e =>
                    handleInputChange('installationDate', e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="status">Estado Actual</Label>
                <Select
                  value={formData.status}
                  onValueChange={value => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operational">Operativo</SelectItem>
                    <SelectItem value="maintenance">
                      En Mantenimiento
                    </SelectItem>
                    <SelectItem value="out_of_service">
                      Fuera de Servicio
                    </SelectItem>
                    <SelectItem value="installation">En Instalación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Especificaciones Técnicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Especificaciones Técnicas
            </CardTitle>
            <CardDescription>
              Características técnicas del ascensor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="capacity">Capacidad (kg) *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={e => handleInputChange('capacity', e.target.value)}
                  placeholder="1000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="speed">Velocidad (m/s) *</Label>
                <Input
                  id="speed"
                  type="number"
                  step="0.1"
                  value={formData.speed}
                  onChange={e => handleInputChange('speed', e.target.value)}
                  placeholder="1.0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="floors">Número de Pisos *</Label>
                <Input
                  id="floors"
                  type="number"
                  value={formData.floors}
                  onChange={e => handleInputChange('floors', e.target.value)}
                  placeholder="10"
                  required
                />
              </div>
              <div>
                <Label htmlFor="motorType">Tipo de Motor</Label>
                <Select
                  value={formData.motorType}
                  onValueChange={value => handleInputChange('motorType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gearless">Sin Engranaje</SelectItem>
                    <SelectItem value="geared">Con Engranaje</SelectItem>
                    <SelectItem value="hydraulic">Hidráulico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="controlSystem">Sistema de Control</Label>
                <Select
                  value={formData.controlSystem}
                  onValueChange={value =>
                    handleInputChange('controlSystem', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sistema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relay">Relé</SelectItem>
                    <SelectItem value="microprocessor">
                      Microprocesador
                    </SelectItem>
                    <SelectItem value="destination">Destino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="doorType">Tipo de Puerta</Label>
                <Select
                  value={formData.doorType}
                  onValueChange={value => handleInputChange('doorType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center_opening">
                      Apertura Central
                    </SelectItem>
                    <SelectItem value="side_opening">
                      Apertura Lateral
                    </SelectItem>
                    <SelectItem value="single_slide">
                      Deslizante Simple
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ubicación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Ubicación
            </CardTitle>
            <CardDescription>
              Información de ubicación del ascensor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="buildingName">Nombre del Edificio *</Label>
                <Input
                  id="buildingName"
                  value={formData.buildingName}
                  onChange={e =>
                    handleInputChange('buildingName', e.target.value)
                  }
                  placeholder="Ej: Torre Centro"
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={e => handleInputChange('address', e.target.value)}
                  placeholder="Ej: Av. Principal 123"
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={e => handleInputChange('city', e.target.value)}
                  placeholder="Ej: Buenos Aires"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">Provincia/Estado *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={e => handleInputChange('state', e.target.value)}
                  placeholder="Ej: CABA"
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode">Código Postal</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={e => handleInputChange('zipCode', e.target.value)}
                  placeholder="Ej: 1000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Información del Cliente
            </CardTitle>
            <CardDescription>
              Datos del cliente propietario del ascensor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="clientName">Nombre del Cliente *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={e =>
                    handleInputChange('clientName', e.target.value)
                  }
                  placeholder="Ej: Empresa Constructora S.A."
                  required
                />
              </div>
              <div>
                <Label htmlFor="clientContact">Contacto Principal</Label>
                <Input
                  id="clientContact"
                  value={formData.clientContact}
                  onChange={e =>
                    handleInputChange('clientContact', e.target.value)
                  }
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div>
                <Label htmlFor="clientPhone">Teléfono</Label>
                <Input
                  id="clientPhone"
                  value={formData.clientPhone}
                  onChange={e =>
                    handleInputChange('clientPhone', e.target.value)
                  }
                  placeholder="Ej: +54 11 1234-5678"
                />
              </div>
              <div>
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={e =>
                    handleInputChange('clientEmail', e.target.value)
                  }
                  placeholder="Ej: contacto@empresa.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mantenimiento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Configuración de Mantenimiento
            </CardTitle>
            <CardDescription>
              Configuración de mantenimiento e inspecciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="maintenanceContract"
                checked={formData.maintenanceContract}
                onCheckedChange={checked =>
                  handleInputChange('maintenanceContract', checked)
                }
              />
              <Label htmlFor="maintenanceContract">
                Contrato de Mantenimiento Activo
              </Label>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="maintenanceFrequency">
                  Frecuencia de Mantenimiento
                </Label>
                <Select
                  value={formData.maintenanceFrequency}
                  onValueChange={value =>
                    handleInputChange('maintenanceFrequency', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensual</SelectItem>
                    <SelectItem value="quarterly">Trimestral</SelectItem>
                    <SelectItem value="semi_annual">Semestral</SelectItem>
                    <SelectItem value="annual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="lastInspection">Última Inspección</Label>
                <Input
                  id="lastInspection"
                  type="date"
                  value={formData.lastInspection}
                  onChange={e =>
                    handleInputChange('lastInspection', e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="nextInspection">Próxima Inspección</Label>
                <Input
                  id="nextInspection"
                  type="date"
                  value={formData.nextInspection}
                  onChange={e =>
                    handleInputChange('nextInspection', e.target.value)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notas */}
        <Card>
          <CardHeader>
            <CardTitle>Notas Adicionales</CardTitle>
            <CardDescription>
              Información adicional sobre el ascensor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.notes}
              onChange={e => handleInputChange('notes', e.target.value)}
              placeholder="Agrega cualquier información adicional relevante..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Ascensor
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
