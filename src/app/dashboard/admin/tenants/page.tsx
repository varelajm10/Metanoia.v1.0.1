'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  Building,
  Eye,
  Settings,
  CheckCircle,
  XCircle,
  Trash2,
  BarChart3,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { ManageModulesDialog } from '@/components/admin/ManageModulesDialog'
import { CreateTenantDialog } from '@/components/admin/CreateTenantDialog'

export default function AdminTenantsPage() {
  const { user, loading } = useAuth()
  const [tenants, setTenants] = useState([])
  const [selectedTenant, setSelectedTenant] = useState(null)
  const [activeTab, setActiveTab] = useState('list')
  const [systemStats, setSystemStats] = useState<any>(null)
  const [showModulesDialog, setShowModulesDialog] = useState(false)
  const [selectedTenantForModules, setSelectedTenantForModules] = useState<any>(null)


  const availableModules = [
    { id: 'customers', name: 'Gestión de Clientes', category: 'BUSINESS' },
    { id: 'servers', name: 'Gestión de Servidores', category: 'TECHNICAL' },
    { id: 'products', name: 'Inventario', category: 'BUSINESS' },
    { id: 'orders', name: 'Ventas', category: 'BUSINESS' },
    { id: 'invoices', name: 'Facturación', category: 'BUSINESS' },
    { id: 'hr', name: 'Recursos Humanos', category: 'ADMINISTRATIVE' },
    { id: 'crm', name: 'CRM Avanzado', category: 'BUSINESS' },
    { id: 'reports', name: 'Reportes', category: 'ANALYTICS' },
    { id: 'settings', name: 'Configuración', category: 'ADMINISTRATIVE' },
  ]

  useEffect(() => {
    if (user) {
      fetchTenants()
      fetchSystemStats()
    }
  }, [user])

  const fetchTenants = async () => {
    try {
      const response = await fetch('/api/admin/tenants')
      const result = await response.json()

      if (result.success) {
        setTenants(result.data)
      }
    } catch (error) {
      console.error('Error fetching tenants:', error)
    }
  }

  const fetchSystemStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const result = await response.json()

      if (result.success) {
        setSystemStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching system stats:', error)
    }
  }


  const handleToggleModule = async (
    tenantId: string,
    moduleId: string,
    isEnabled: boolean
  ) => {
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId,
          isEnabled,
          reason: isEnabled
            ? 'Habilitado por administrador'
            : 'Deshabilitado por administrador',
        }),
      })

      const result = await response.json()

      if (result.success) {
        fetchTenants()
        alert(
          `Módulo ${isEnabled ? 'habilitado' : 'deshabilitado'} exitosamente`
        )
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error toggling module:', error)
      alert('Error al cambiar estado del módulo')
    }
  }

  const handleOpenModulesDialog = (tenant: any) => {
    setSelectedTenantForModules(tenant)
    setShowModulesDialog(true)
  }

  const handleCloseModulesDialog = () => {
    setShowModulesDialog(false)
    setSelectedTenantForModules(null)
    // Refrescar la lista de tenants para obtener los módulos actualizados
    fetchTenants()
  }

  const handleDeleteTenant = async (tenantId: string, tenantName: string) => {
    if (
      confirm(
        `¿Estás seguro de que quieres eliminar el tenant "${tenantName}"? Esta acción no se puede deshacer.`
      )
    ) {
      try {
        const response = await fetch(`/api/admin/tenants/${tenantId}`, {
          method: 'DELETE',
        })

        const result = await response.json()

        if (result.success) {
          fetchTenants()
          fetchSystemStats()
          alert('Tenant eliminado exitosamente')
        } else {
          alert(`Error: ${result.error}`)
        }
      } catch (error) {
        console.error('Error deleting tenant:', error)
        alert('Error al eliminar tenant')
      }
    }
  }


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Cargando administración de tenants...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-3xl font-bold text-transparent">
              Administración de Tenants
            </h1>
            <p className="text-muted-foreground">
              Gestión de clientes y módulos del sistema Metanoia
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list">Lista de Tenants</TabsTrigger>
            <TabsTrigger value="modules">Gestión de Módulos</TabsTrigger>
            <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          </TabsList>

          {/* List Tab */}
          <TabsContent value="list">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Building className="mr-2 h-5 w-5" />
                    Tenants Registrados
                  </span>
                  <CreateTenantDialog onTenantCreated={fetchTenants} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tenants.length > 0 ? (
                  <div className="space-y-4">
                    {tenants.map((tenant: any) => (
                      <div
                        key={tenant.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                            <Building className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{tenant.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {tenant.email} • {tenant.slug}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {tenant.contactName} • {tenant.city},{' '}
                              {tenant.country}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={
                              tenant.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {tenant.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                          <Badge variant="outline">
                            {tenant.subscriptionPlan}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {tenant.enabledModules?.length || 0} módulos
                          </span>
                          <div className="flex space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedTenant(tenant)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDeleteTenant(tenant.id, tenant.name)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-muted-foreground">
                    No hay tenants registrados
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>


          {/* Modules Tab */}
          <TabsContent value="modules">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Gestión de Módulos por Tenant</CardTitle>
                <CardDescription>
                  Activar o desactivar módulos específicos para cada tenant
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tenants.length > 0 ? (
                  <div className="space-y-6">
                    {tenants.map((tenant: any) => (
                      <div key={tenant.id} className="rounded-lg border p-4">
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{tenant.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {tenant.subscriptionPlan} •{' '}
                              {tenant.enabledModules?.length || 0} módulos
                              activos
                            </p>
                          </div>
                          <Badge
                            className={
                              tenant.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {tenant.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          {availableModules.map(module => {
                            const isEnabled =
                              tenant.enabledModules?.includes(module.id) ||
                              false
                            return (
                              <div
                                key={module.id}
                                className="flex items-center justify-between rounded-lg border p-3"
                              >
                                <div>
                                  <p className="text-sm font-medium">
                                    {module.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {module.category}
                                  </p>
                                </div>
                                <Switch
                                  checked={isEnabled}
                                  onCheckedChange={checked =>
                                    handleToggleModule(
                                      tenant.id,
                                      module.id,
                                      checked
                                    )
                                  }
                                  disabled={!tenant.isActive}
                                />
                              </div>
                            )
                          })}
                        </div>

                        <div className="mt-4 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenModulesDialog(tenant)}
                            className="flex items-center gap-2"
                          >
                            <Settings className="h-4 w-4" />
                            Gestionar Módulos
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-muted-foreground">
                    No hay tenants para gestionar módulos
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Tenants
                  </CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {systemStats?.totalTenants || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {systemStats?.activeTenants || 0} activos
                  </p>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tenants Activos
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {systemStats?.activeTenants || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {systemStats?.totalTenants
                      ? Math.round(
                          (systemStats.activeTenants /
                            systemStats.totalTenants) *
                            100
                        )
                      : 0}
                    % del total
                  </p>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tenants Inactivos
                  </CardTitle>
                  <XCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {systemStats?.inactiveTenants || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Requieren atención
                  </p>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Módulos en Uso
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {systemStats?.modulesUsage?.length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Módulos activos en el sistema
                  </p>
                </CardContent>
              </Card>
            </div>

            {systemStats?.tenantsByPlan &&
              systemStats.tenantsByPlan.length > 0 && (
                <Card className="card-enhanced mt-6">
                  <CardHeader>
                    <CardTitle>Distribución por Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {systemStats.tenantsByPlan.map((plan: any) => (
                        <div
                          key={plan.subscriptionPlan}
                          className="flex items-center justify-between"
                        >
                          <span className="font-medium">
                            {plan.subscriptionPlan}
                          </span>
                          <Badge variant="outline">
                            {plan._count.subscriptionPlan} tenants
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialog para gestionar módulos */}
      {selectedTenantForModules && (
        <ManageModulesDialog
          isOpen={showModulesDialog}
          onClose={handleCloseModulesDialog}
          tenantId={selectedTenantForModules.id}
          tenantName={selectedTenantForModules.name}
          enabledModules={selectedTenantForModules.enabledModules || []}
        />
      )}
    </div>
  )
}
