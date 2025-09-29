'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import {
  Server,
  Edit,
  Save,
  X,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Globe,
  HardDrive,
  Cpu,
  MemoryStick,
} from 'lucide-react'

interface ServerInfo {
  id: string
  name: string
  type: string
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'WARNING'
  ipAddress: string
  location: string
  clientName: string
  hostname?: string
  operatingSystem?: string
  cpu?: string
  ram?: string
  storage?: string
  bandwidth?: string
  port?: number
  protocol?: string
  sslCertificate?: boolean
  backupEnabled?: boolean
  monitoringEnabled?: boolean
  description?: string
  cost?: number
  costCurrency?: string
  costPeriod?: string
  installationDate?: string
  lastMaintenance?: string
  nextMaintenance?: string
}

interface ServerDetailDialogProps {
  server: ServerInfo
  isOpen: boolean
  onClose: () => void
  onSave: (serverData: Partial<ServerInfo>) => Promise<void>
}

export default function ServerDetailDialog({
  server,
  isOpen,
  onClose,
  onSave,
}: ServerDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<ServerInfo>>(server)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onSave(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving server:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(server)
    setIsEditing(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'OFFLINE':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'WARNING':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case 'MAINTENANCE':
        return <Clock className="h-5 w-5 text-blue-600" />
      default:
        return <Server className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return 'bg-green-100 text-green-800'
      case 'OFFLINE':
        return 'bg-red-100 text-red-800'
      case 'WARNING':
        return 'bg-orange-100 text-orange-800'
      case 'MAINTENANCE':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return 'En Línea'
      case 'OFFLINE':
        return 'Desconectado'
      case 'WARNING':
        return 'Advertencia'
      case 'MAINTENANCE':
        return 'Mantenimiento'
      default:
        return status
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon(server.status)}
            {isEditing ? 'Editar Servidor' : 'Detalles del Servidor'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifica la información del servidor'
              : 'Información detallada del servidor'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Server className="h-5 w-5" />
                Información Básica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre del Servidor</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={e =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium">{server.name}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="status">Estado</Label>
                  {isEditing ? (
                    <Select
                      value={formData.status || server.status}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ONLINE">En Línea</SelectItem>
                        <SelectItem value="OFFLINE">Desconectado</SelectItem>
                        <SelectItem value="WARNING">Advertencia</SelectItem>
                        <SelectItem value="MAINTENANCE">
                          Mantenimiento
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getStatusColor(server.status)}>
                      {getStatusText(server.status)}
                    </Badge>
                  )}
                </div>
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  {isEditing ? (
                    <Input
                      id="type"
                      value={formData.type || ''}
                      onChange={e =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium">{server.type}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="ipAddress">Dirección IP</Label>
                  {isEditing ? (
                    <Input
                      id="ipAddress"
                      value={formData.ipAddress || ''}
                      onChange={e =>
                        setFormData({ ...formData, ipAddress: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium">{server.ipAddress}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="hostname">Hostname</Label>
                  {isEditing ? (
                    <Input
                      id="hostname"
                      value={formData.hostname || ''}
                      onChange={e =>
                        setFormData({ ...formData, hostname: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium">
                      {server.hostname || 'N/A'}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="location">Ubicación</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={formData.location || ''}
                      onChange={e =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium">{server.location}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Especificaciones Técnicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Cpu className="h-5 w-5" />
                Especificaciones Técnicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="operatingSystem">Sistema Operativo</Label>
                  {isEditing ? (
                    <Input
                      id="operatingSystem"
                      value={formData.operatingSystem || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          operatingSystem: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium">
                      {server.operatingSystem || 'N/A'}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="cpu">Procesador</Label>
                  {isEditing ? (
                    <Input
                      id="cpu"
                      value={formData.cpu || ''}
                      onChange={e =>
                        setFormData({ ...formData, cpu: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium">{server.cpu || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="ram">Memoria RAM</Label>
                  {isEditing ? (
                    <Input
                      id="ram"
                      value={formData.ram || ''}
                      onChange={e =>
                        setFormData({ ...formData, ram: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium">{server.ram || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="storage">Almacenamiento</Label>
                  {isEditing ? (
                    <Input
                      id="storage"
                      value={formData.storage || ''}
                      onChange={e =>
                        setFormData({ ...formData, storage: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium">
                      {server.storage || 'N/A'}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="bandwidth">Ancho de Banda</Label>
                  {isEditing ? (
                    <Input
                      id="bandwidth"
                      value={formData.bandwidth || ''}
                      onChange={e =>
                        setFormData({ ...formData, bandwidth: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium">
                      {server.bandwidth || 'N/A'}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="port">Puerto</Label>
                  {isEditing ? (
                    <Input
                      id="port"
                      type="number"
                      value={formData.port || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          port: parseInt(e.target.value),
                        })
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium">
                      {server.port || 'N/A'}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuración */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <HardDrive className="h-5 w-5" />
                Configuración
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="sslCertificate">Certificado SSL</Label>
                  {isEditing ? (
                    <Switch
                      id="sslCertificate"
                      checked={formData.sslCertificate || false}
                      onCheckedChange={checked =>
                        setFormData({ ...formData, sslCertificate: checked })
                      }
                    />
                  ) : (
                    <Badge
                      className={
                        server.sslCertificate
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {server.sslCertificate ? 'Habilitado' : 'Deshabilitado'}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="backupEnabled">Backup Habilitado</Label>
                  {isEditing ? (
                    <Switch
                      id="backupEnabled"
                      checked={formData.backupEnabled || false}
                      onCheckedChange={checked =>
                        setFormData({ ...formData, backupEnabled: checked })
                      }
                    />
                  ) : (
                    <Badge
                      className={
                        server.backupEnabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {server.backupEnabled ? 'Habilitado' : 'Deshabilitado'}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="monitoringEnabled">
                    Monitoreo Habilitado
                  </Label>
                  {isEditing ? (
                    <Switch
                      id="monitoringEnabled"
                      checked={formData.monitoringEnabled || false}
                      onCheckedChange={checked =>
                        setFormData({ ...formData, monitoringEnabled: checked })
                      }
                    />
                  ) : (
                    <Badge
                      className={
                        server.monitoringEnabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {server.monitoringEnabled
                        ? 'Habilitado'
                        : 'Deshabilitado'}
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                {isEditing ? (
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={e =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                ) : (
                  <p className="text-sm">
                    {server.description || 'Sin descripción'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información del Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">{server.clientName}</p>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {isEditing && (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </Button>
              </>
            )}
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
