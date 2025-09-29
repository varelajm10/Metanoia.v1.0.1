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
import {
  ArrowLeft,
  Settings,
  User,
  Building2,
  Shield,
  Bell,
  Palette,
  Database,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Cargando...</p>
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
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Dashboard
              </Link>
            </Button>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
              <Settings className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Configuración del Sistema</h1>
              <p className="text-sm text-muted-foreground">
                Ajustes y preferencias del sistema
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Settings Categories */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Settings */}
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-blue-600" />
                Configuración de Usuario
              </CardTitle>
              <CardDescription>
                Gestiona tu perfil y preferencias personales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  • Perfil de usuario
                </p>
                <p className="text-sm text-muted-foreground">
                  • Cambiar contraseña
                </p>
                <p className="text-sm text-muted-foreground">
                  • Preferencias de notificación
                </p>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                Configurar
              </Button>
            </CardContent>
          </Card>

          {/* Tenant Settings */}
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="mr-2 h-5 w-5 text-green-600" />
                Configuración del Tenant
              </CardTitle>
              <CardDescription>
                Configuración de la organización
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  • Información de la empresa
                </p>
                <p className="text-sm text-muted-foreground">
                  • Configuración de dominio
                </p>
                <p className="text-sm text-muted-foreground">
                  • Módulos activos
                </p>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                Configurar
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-red-600" />
                Seguridad
              </CardTitle>
              <CardDescription>
                Configuración de seguridad y permisos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  • Permisos de usuario
                </p>
                <p className="text-sm text-muted-foreground">
                  • Autenticación de dos factores
                </p>
                <p className="text-sm text-muted-foreground">
                  • Logs de seguridad
                </p>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                Configurar
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-yellow-600" />
                Notificaciones
              </CardTitle>
              <CardDescription>
                Configuración de alertas y notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  • Alertas de stock bajo
                </p>
                <p className="text-sm text-muted-foreground">
                  • Notificaciones de órdenes
                </p>
                <p className="text-sm text-muted-foreground">
                  • Recordatorios de facturas
                </p>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                Configurar
              </Button>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5 text-purple-600" />
                Apariencia
              </CardTitle>
              <CardDescription>
                Personaliza la interfaz del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  • Tema claro/oscuro
                </p>
                <p className="text-sm text-muted-foreground">
                  • Colores personalizados
                </p>
                <p className="text-sm text-muted-foreground">• Idioma</p>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                Configurar
              </Button>
            </CardContent>
          </Card>

          {/* System */}
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5 text-gray-600" />
                Sistema
              </CardTitle>
              <CardDescription>
                Configuración avanzada del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  • Respaldo de datos
                </p>
                <p className="text-sm text-muted-foreground">
                  • Logs del sistema
                </p>
                <p className="text-sm text-muted-foreground">• Mantenimiento</p>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                Configurar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Current Settings Summary */}
        <div className="mt-8">
          <h2 className="mb-6 text-2xl font-bold">Configuración Actual</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Información del Usuario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Nombre:</span>
                    <span className="text-sm">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Rol:</span>
                    <Badge variant="default">{user.role}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Estado:</span>
                    <Badge variant="default">Activo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información del Tenant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Nombre:</span>
                    <span className="text-sm">
                      {user.tenant?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Slug:</span>
                    <span className="text-sm">
                      {user.tenant?.slug || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Dominio:</span>
                    <span className="text-sm">
                      {user.tenant?.domain || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Estado:</span>
                    <Badge variant="default">Activo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
