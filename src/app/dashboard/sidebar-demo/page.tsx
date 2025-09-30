'use client'

import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, Info } from 'lucide-react'

export default function SidebarDemoPage() {
  const { user, refreshUser } = useAuth()

  const handleRefresh = async () => {
    await refreshUser()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sidebar Dinámico - Demo</h1>
          <p className="text-gray-600 mt-1">
            Demostración del sidebar dinámico basado en módulos habilitados
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Información del Usuario
          </CardTitle>
          <CardDescription>
            Datos del usuario actual y módulos habilitados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Usuario</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Nombre:</strong> {user?.firstName} {user?.lastName}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Rol:</strong> {user?.role}</p>
                <p><strong>Tenant:</strong> {user?.tenant?.name || 'N/A'}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Módulos Habilitados</h4>
              <div className="flex flex-wrap gap-2">
                {user?.enabledModules?.length ? (
                  user.enabledModules.map(module => (
                    <Badge key={module} variant="secondary">
                      {module}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No hay módulos habilitados</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Módulos</CardTitle>
          <CardDescription>
            Lista de todos los módulos disponibles en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: 'crm', name: 'CRM', description: 'Gestión de relaciones con clientes', category: 'BUSINESS' },
              { id: 'inventory', name: 'Inventario', description: 'Control de stock y productos', category: 'BUSINESS' },
              { id: 'billing', name: 'Facturación', description: 'Gestión de facturas y pagos', category: 'FINANCIAL' },
              { id: 'elevators', name: 'Ascensores', description: 'Mantenimiento y gestión de ascensores', category: 'BUSINESS' },
              { id: 'servers', name: 'Servidores', description: 'Gestión de servidores y monitoreo', category: 'TECHNICAL' },
              { id: 'schools', name: 'Colegios', description: 'Gestión escolar y académica', category: 'EDUCATION' },
              { id: 'hr', name: 'Recursos Humanos', description: 'Gestión de empleados y nómina', category: 'ADMINISTRATIVE' },
              { id: 'analytics', name: 'Analytics', description: 'Reportes y análisis de datos', category: 'ANALYTICS' }
            ].map(module => (
              <div key={module.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{module.name}</h4>
                  <Badge 
                    variant={user?.enabledModules?.includes(module.id) ? "default" : "outline"}
                  >
                    {user?.enabledModules?.includes(module.id) ? 'Habilitado' : 'Deshabilitado'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                <Badge variant="secondary" className="text-xs">
                  {module.category}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instrucciones</CardTitle>
          <CardDescription>
            Cómo usar el sidebar dinámico
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">1. Configuración de Módulos</h4>
            <p className="text-sm text-gray-600">
              Los módulos se configuran en el archivo <code className="bg-gray-100 px-1 rounded">DynamicSidebar.tsx</code> 
              en la constante <code className="bg-gray-100 px-1 rounded">MODULE_CONFIG</code>.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">2. Módulos Habilitados</h4>
            <p className="text-sm text-gray-600">
              Los módulos habilitados se obtienen del campo <code className="bg-gray-100 px-1 rounded">enabledModules</code> 
              del usuario, que viene del tenant en la base de datos.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">3. Navegación Dinámica</h4>
            <p className="text-sm text-gray-600">
              El sidebar solo muestra los módulos que están habilitados para el tenant actual. 
              Los módulos se agrupan por categoría y se pueden expandir/contraer.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">4. Responsive</h4>
            <p className="text-sm text-gray-600">
              El sidebar es completamente responsive y se adapta a dispositivos móviles 
              con un overlay y botón de toggle.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
