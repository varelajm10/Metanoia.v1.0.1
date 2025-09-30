'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Tipos para las acciones
interface ActionResult {
  success: boolean
  message: string
  error?: string
}

// Acción para activar/desactivar tenant
export async function toggleTenantStatus(
  tenantId: string,
  isActive: boolean
): Promise<ActionResult> {
  try {
    // Verificar que el tenant existe
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    })

    if (!tenant) {
      return {
        success: false,
        message: 'Tenant no encontrado',
        error: 'TENANT_NOT_FOUND',
      }
    }

    // Actualizar el estado del tenant
    await prisma.tenant.update({
      where: { id: tenantId },
      data: { isActive },
    })

    // Revalidar la página del super admin
    revalidatePath('/super-admin')

    return {
      success: true,
      message: `Tenant ${isActive ? 'activado' : 'desactivado'} correctamente`,
    }
  } catch (error) {
    console.error('Error toggling tenant status:', error)
    return {
      success: false,
      message: 'Error al actualizar el estado del tenant',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

// Acción para obtener detalles de un tenant
export async function getTenantDetails(tenantId: string) {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        _count: {
          select: {
            users: true,
            customers: true,
            products: true,
            orders: true,
            invoices: true,
            employees: true,
            servers: true,
            elevators: true,
            schoolStudents: true,
          },
        },
      },
    })

    if (!tenant) {
      return {
        success: false,
        message: 'Tenant no encontrado',
        error: 'TENANT_NOT_FOUND',
      }
    }

    return {
      success: true,
      data: tenant,
    }
  } catch (error) {
    console.error('Error fetching tenant details:', error)
    return {
      success: false,
      message: 'Error al obtener detalles del tenant',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

// Acción para eliminar un tenant (solo si está inactivo)
export async function deleteTenant(tenantId: string): Promise<ActionResult> {
  try {
    // Verificar que el tenant existe y está inactivo
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    })

    if (!tenant) {
      return {
        success: false,
        message: 'Tenant no encontrado',
        error: 'TENANT_NOT_FOUND',
      }
    }

    if (tenant.isActive) {
      return {
        success: false,
        message: 'No se puede eliminar un tenant activo. Desactívalo primero.',
        error: 'TENANT_ACTIVE',
      }
    }

    // Eliminar el tenant (esto eliminará todos los datos relacionados por CASCADE)
    await prisma.tenant.delete({
      where: { id: tenantId },
    })

    // Revalidar la página del super admin
    revalidatePath('/super-admin')

    return {
      success: true,
      message: 'Tenant eliminado correctamente',
    }
  } catch (error) {
    console.error('Error deleting tenant:', error)
    return {
      success: false,
      message: 'Error al eliminar el tenant',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

// Acción para crear un nuevo tenant
export async function createTenant(
  name: string,
  slug: string,
  domain?: string
): Promise<ActionResult> {
  try {
    // Verificar que el slug no existe
    const existingTenant = await prisma.tenant.findUnique({
      where: { slug },
    })

    if (existingTenant) {
      return {
        success: false,
        message: 'Ya existe un tenant con ese slug',
        error: 'SLUG_EXISTS',
      }
    }

    // Verificar que el dominio no existe (si se proporciona)
    if (domain) {
      const existingDomain = await prisma.tenant.findUnique({
        where: { domain },
      })

      if (existingDomain) {
        return {
          success: false,
          message: 'Ya existe un tenant con ese dominio',
          error: 'DOMAIN_EXISTS',
        }
      }
    }

    // Crear el tenant
    const tenant = await prisma.tenant.create({
      data: {
        name,
        slug,
        domain,
        isActive: true,
      },
    })

    // Revalidar la página del super admin
    revalidatePath('/super-admin')

    return {
      success: true,
      message: 'Tenant creado correctamente',
      data: tenant,
    }
  } catch (error) {
    console.error('Error creating tenant:', error)
    return {
      success: false,
      message: 'Error al crear el tenant',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

// Acción para obtener estadísticas del sistema
export async function getSystemStats() {
  try {
    const [
      totalTenants,
      activeTenants,
      totalUsers,
      totalCustomers,
      totalProducts,
      totalOrders,
      totalInvoices,
      totalEmployees,
      totalServers,
      totalElevators,
      totalStudents,
    ] = await Promise.all([
      prisma.tenant.count(),
      prisma.tenant.count({ where: { isActive: true } }),
      prisma.user.count(),
      prisma.customer.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.invoice.count(),
      prisma.employee.count(),
      prisma.server.count(),
      prisma.elevator.count(),
      prisma.schoolStudent.count(),
    ])

    return {
      success: true,
      data: {
        totalTenants,
        activeTenants,
        inactiveTenants: totalTenants - activeTenants,
        totalUsers,
        totalCustomers,
        totalProducts,
        totalOrders,
        totalInvoices,
        totalEmployees,
        totalServers,
        totalElevators,
        totalStudents,
      },
    }
  } catch (error) {
    console.error('Error fetching system stats:', error)
    return {
      success: false,
      message: 'Error al obtener estadísticas del sistema',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}
