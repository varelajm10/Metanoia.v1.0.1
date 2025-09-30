'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestNavigationPage() {
  const testRoutes = [
    { name: 'CRM', href: '/dashboard/crm' },
    { name: 'Inventario', href: '/dashboard/inventory' },
    { name: 'Configuración', href: '/dashboard/settings' },
    { name: 'Módulos', href: '/dashboard/modules' },
    { name: 'Servidores', href: '/dashboard/servers' },
    { name: 'Ascensores', href: '/dashboard/elevators' },
  ]

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Prueba de Navegación</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testRoutes.map((route) => (
            <Card key={route.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{route.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={route.href} className="block">
                  <Button className="w-full">
                    Ir a {route.name}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/dashboard">
            <Button variant="outline">
              Volver al Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
