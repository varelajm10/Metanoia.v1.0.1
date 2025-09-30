'use client'

import { useState, useTransition } from 'react'
import { toast } from 'react-hot-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MoreHorizontal,
  Eye,
  Trash2,
  Users,
  Package,
  ShoppingCart,
  FileText,
  Building,
  Server,
  GraduationCap,
  Cog,
} from 'lucide-react'
import { ManageModulesDialog } from '@/components/admin/ManageModulesDialog'
import {
  toggleTenantStatus,
  deleteTenant,
} from '@/lib/actions/super-admin-actions'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface Tenant {
  id: string
  name: string
  slug: string
  domain: string | null
  isActive: boolean
  createdAt: Date
  _count: {
    users: number
    customers: number
    products: number
    orders: number
    invoices: number
    employees: number
    servers: number
    elevators: number
    schoolStudents: number
  }
}

interface SuperAdminTableProps {
  tenants: Tenant[]
}

export function SuperAdminTable({ tenants }: SuperAdminTableProps) {
  const [isPending, startTransition] = useTransition()
  const [updatingTenants, setUpdatingTenants] = useState<Set<string>>(new Set())

  // Función para manejar el cambio de estado del tenant
  const handleToggleTenant = async (
    tenantId: string,
    currentStatus: boolean
  ) => {
    setUpdatingTenants(prev => new Set(prev).add(tenantId))

    startTransition(async () => {
      try {
        const result = await toggleTenantStatus(tenantId, !currentStatus)

        if (result.success) {
          toast.success(result.message)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error('Error toggling tenant:', error)
        toast.error('Error al actualizar el tenant')
      } finally {
        setUpdatingTenants(prev => {
          const newSet = new Set(prev)
          newSet.delete(tenantId)
          return newSet
        })
      }
    })
  }

  // Función para manejar la eliminación de un tenant
  const handleDeleteTenant = async (tenantId: string, tenantName: string) => {
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar el tenant "${tenantName}"? Esta acción no se puede deshacer.`
      )
    ) {
      return
    }

    startTransition(async () => {
      try {
        const result = await deleteTenant(tenantId)

        if (result.success) {
          toast.success(result.message)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error('Error deleting tenant:', error)
        toast.error('Error al eliminar el tenant')
      }
    })
  }

  // Función para formatear números
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Estado</TableHead>
            <TableHead>Tenant</TableHead>
            <TableHead>Dominio</TableHead>
            <TableHead>Usuarios</TableHead>
            <TableHead>Clientes</TableHead>
            <TableHead>Productos</TableHead>
            <TableHead>Órdenes</TableHead>
            <TableHead>Facturas</TableHead>
            <TableHead>Otros</TableHead>
            <TableHead>Creado</TableHead>
            <TableHead className="w-[50px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map(tenant => (
            <TableRow key={tenant.id}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={tenant.isActive}
                    onCheckedChange={() =>
                      handleToggleTenant(tenant.id, tenant.isActive)
                    }
                    disabled={updatingTenants.has(tenant.id) || isPending}
                  />
                  <Badge variant={tenant.isActive ? 'default' : 'secondary'}>
                    {tenant.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{tenant.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {tenant.slug}
                  </div>
                </div>
              </TableCell>

              <TableCell>
                {tenant.domain ? (
                  <a
                    href={`https://${tenant.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {tenant.domain}
                  </a>
                ) : (
                  <span className="text-muted-foreground">Sin dominio</span>
                )}
              </TableCell>

              <TableCell>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{formatNumber(tenant._count.users)}</span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center space-x-1">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{formatNumber(tenant._count.customers)}</span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center space-x-1">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>{formatNumber(tenant._count.products)}</span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center space-x-1">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <span>{formatNumber(tenant._count.orders)}</span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center space-x-1">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{formatNumber(tenant._count.invoices)}</span>
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-1">
                  {tenant._count.employees > 0 && (
                    <div className="flex items-center space-x-1 text-xs">
                      <Users className="h-3 w-3" />
                      <span>{formatNumber(tenant._count.employees)} emp</span>
                    </div>
                  )}
                  {tenant._count.servers > 0 && (
                    <div className="flex items-center space-x-1 text-xs">
                      <Server className="h-3 w-3" />
                      <span>{formatNumber(tenant._count.servers)} serv</span>
                    </div>
                  )}
                  {tenant._count.elevators > 0 && (
                    <div className="flex items-center space-x-1 text-xs">
                      <Building className="h-3 w-3" />
                      <span>{formatNumber(tenant._count.elevators)} elev</span>
                    </div>
                  )}
                  {tenant._count.schoolStudents > 0 && (
                    <div className="flex items-center space-x-1 text-xs">
                      <GraduationCap className="h-3 w-3" />
                      <span>
                        {formatNumber(tenant._count.schoolStudents)} est
                      </span>
                    </div>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(tenant.createdAt, {
                    addSuffix: true,
                    locale: es,
                  })}
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <ManageModulesDialog tenant={tenant} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalles
                      </DropdownMenuItem>
                      {!tenant.isActive && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleDeleteTenant(tenant.id, tenant.name)
                          }
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {tenants.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No hay tenants registrados</p>
        </div>
      )}
    </div>
  )
}
