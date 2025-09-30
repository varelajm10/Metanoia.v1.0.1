'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DebugNavigationPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [clickLogs, setClickLogs] = useState<string[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const testRoutes = [
    { name: 'CRM', href: '/dashboard/crm' },
    { name: 'Inventario', href: '/dashboard/inventory' },
    { name: 'Configuración', href: '/dashboard/settings' },
    { name: 'Módulos', href: '/dashboard/modules' },
    { name: 'Servidores', href: '/dashboard/servers' },
    { name: 'Ascensores', href: '/dashboard/elevators' },
    { name: 'Reportes', href: '/dashboard/reports' },
  ]

  const logClick = (routeName: string, method: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `[${timestamp}] ${method}: ${routeName}`
    setClickLogs(prev => [...prev, logMessage])
    console.log(logMessage)
  }

  const testRouterPush = (href: string, name: string) => {
    logClick(name, 'router.push')
    router.push(href)
  }

  const testWindowLocation = (href: string, name: string) => {
    logClick(name, 'window.location.href')
    window.location.href = href
  }

  const testWindowOpen = (href: string, name: string) => {
    logClick(name, 'window.open')
    window.open(href, '_self')
  }

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
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">🔍 Diagnóstico de Navegación</h1>
          <p className="text-muted-foreground mb-4">
            Esta página te permite probar diferentes métodos de navegación y ver cuál funciona.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">📋 Instrucciones:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Haz clic en los botones de abajo para probar la navegación</li>
              <li>• Observa los logs en la consola del navegador (F12)</li>
              <li>• Verifica que la navegación funcione correctamente</li>
              <li>• Si un método no funciona, prueba el siguiente</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Buttons */}
          <div>
            <h2 className="text-2xl font-bold mb-6">🧪 Pruebas de Navegación</h2>
            
            {testRoutes.map((route) => (
              <Card key={route.name} className="mb-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{route.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => testRouterPush(route.href, route.name)}
                      className="w-full"
                    >
                      🚀 router.push()
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => testWindowLocation(route.href, route.name)}
                      className="w-full"
                    >
                      🌐 window.location.href
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => testWindowOpen(route.href, route.name)}
                      className="w-full"
                    >
                      📂 window.open()
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Click Logs */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">📊 Logs de Clics</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setClickLogs([])}
              >
                Limpiar Logs
              </Button>
            </div>
            
            <Card className="h-96 overflow-hidden">
              <CardContent className="p-4 h-full overflow-y-auto">
                {clickLogs.length === 0 ? (
                  <p className="text-muted-foreground text-center mt-8">
                    No hay logs aún. Haz clic en los botones de arriba para generar logs.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {clickLogs.map((log, index) => (
                      <div 
                        key={index}
                        className="text-sm font-mono bg-gray-50 p-2 rounded border-l-4 border-blue-500"
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Button 
            variant="outline"
            onClick={() => router.push('/dashboard')}
          >
            ← Volver al Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
