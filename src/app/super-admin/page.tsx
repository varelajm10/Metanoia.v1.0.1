import { Suspense } from 'react'
import { prisma } from '@/lib/db'
import { SuperAdminTable } from '@/components/super-admin/super-admin-table'
import { CreateTenantDialog } from '@/components/admin/CreateTenantDialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { BarChart3 } from 'lucide-react'
import Link from 'next/link'

// Función para obtener todos los tenants
async function getAllTenants() {
  try {
    const tenants = await prisma.tenant.findMany({
      include: {
        _count: {
          select: {
            users: true,
            customers: true,
            products: true,
            orders: true,
            invoices: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return tenants
  } catch (error) {
    console.error('Error fetching tenants:', error)
    return []
  }
}

// Función para obtener estadísticas generales
async function getSuperAdminStats() {
  try {
    const [
      totalTenants,
      activeTenants,
      totalUsers,
      totalCustomers,
      totalProducts,
      totalOrders,
      totalInvoices,
    ] = await Promise.all([
      prisma.tenant.count(),
      prisma.tenant.count({ where: { isActive: true } }),
      prisma.user.count(),
      prisma.customer.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.invoice.count(),
    ])

    return {
      totalTenants,
      activeTenants,
      inactiveTenants: totalTenants - activeTenants,
      totalUsers,
      totalCustomers,
      totalProducts,
      totalOrders,
      totalInvoices,
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      totalTenants: 0,
      activeTenants: 0,
      inactiveTenants: 0,
      totalUsers: 0,
      totalCustomers: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalInvoices: 0,
    }
  }
}

// Componente de carga para la tabla
function TableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  )
}

// Componente de estadísticas
function StatsCards({ stats }: { stats: any }) {
  const cards = [
    {
      title: 'Total Tenants',
      value: stats.totalTenants,
      description: 'Organizaciones registradas',
      color: 'bg-blue-500',
    },
    {
      title: 'Tenants Activos',
      value: stats.activeTenants,
      description: 'Organizaciones activas',
      color: 'bg-green-500',
    },
    {
      title: 'Tenants Inactivos',
      value: stats.inactiveTenants,
      description: 'Organizaciones inactivas',
      color: 'bg-red-500',
    },
    {
      title: 'Total Usuarios',
      value: stats.totalUsers,
      description: 'Usuarios en el sistema',
      color: 'bg-purple-500',
    },
    {
      title: 'Total Clientes',
      value: stats.totalCustomers,
      description: 'Clientes registrados',
      color: 'bg-orange-500',
    },
    {
      title: 'Total Productos',
      value: stats.totalProducts,
      description: 'Productos en inventario',
      color: 'bg-cyan-500',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`h-2 w-2 rounded-full ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {card.value.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Componente principal
export default async function SuperAdminPage() {
  const [tenants, stats] = await Promise.all([
    getAllTenants(),
    getSuperAdminStats(),
  ])

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Super Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Gestión centralizada de todos los tenants del sistema
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-sm">
            {stats.activeTenants} de {stats.totalTenants} tenants activos
          </Badge>
          <Button asChild variant="outline" className="flex items-center space-x-2">
            <Link href="/super-admin/analytics">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </Link>
          </Button>
          <CreateTenantDialog />
        </div>
      </div>

      {/* Estadísticas */}
      <StatsCards stats={stats} />

      {/* Tabla de Tenants */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Tenants</CardTitle>
          <CardDescription>
            Administra todos los tenants del sistema. Puedes activar/desactivar
            tenants individualmente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton />}>
            <SuperAdminTable tenants={tenants.map(tenant => ({
              ...tenant,
              _count: {
                ...tenant._count,
                employees: 0,
                servers: 0,
                elevators: 0,
                schoolStudents: 0
              }
            }))} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
