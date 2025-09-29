import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/customers/stats - Obtener estadísticas de clientes
export async function GET(request: NextRequest) {
  try {
    // Verificar permisos de lectura
    const { error, user } = await requirePermission(
      request,
      'customers',
      'read'
    )
    if (error) return error

    const tenantId = getTenantId(user!)

    // Obtener estadísticas
    const [
      totalCustomers,
      activeCustomers,
      inactiveCustomers,
      newThisMonth,
      newThisWeek,
      customersByMonth,
      topCustomersByOrders,
      customersWithOrders,
      customersWithInvoices,
    ] = await Promise.all([
      // Total de clientes
      prisma.customer.count({ where: { tenantId } }),

      // Clientes activos
      prisma.customer.count({ where: { tenantId, isActive: true } }),

      // Clientes inactivos
      prisma.customer.count({ where: { tenantId, isActive: false } }),

      // Nuevos este mes
      prisma.customer.count({
        where: {
          tenantId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),

      // Nuevos esta semana
      prisma.customer.count({
        where: {
          tenantId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Clientes por mes (últimos 12 meses)
      prisma.customer.groupBy({
        by: ['createdAt'],
        where: {
          tenantId,
          createdAt: {
            gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          },
        },
        _count: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),

      // Top clientes por órdenes
      prisma.customer.findMany({
        where: { tenantId },
        include: {
          _count: {
            select: { orders: true },
          },
        },
        orderBy: {
          orders: { _count: 'desc' },
        },
        take: 5,
      }),

      // Clientes con órdenes
      prisma.customer.count({
        where: {
          tenantId,
          orders: { some: {} },
        },
      }),

      // Clientes con facturas
      prisma.customer.count({
        where: {
          tenantId,
          invoices: { some: {} },
        },
      }),
    ])

    // Calcular tasa de actividad
    const activityRate =
      totalCustomers > 0
        ? Math.round((activeCustomers / totalCustomers) * 100)
        : 0

    // Calcular tasa de conversión (clientes con órdenes)
    const conversionRate =
      totalCustomers > 0
        ? Math.round((customersWithOrders / totalCustomers) * 100)
        : 0

    // Procesar datos mensuales
    const monthlyData = customersByMonth.map(item => ({
      month: item.createdAt.toISOString().substring(0, 7),
      count: item._count.createdAt,
    }))

    return NextResponse.json({
      success: true,
      data: {
        totalCustomers,
        activeCustomers,
        inactiveCustomers,
        newThisMonth,
        newThisWeek,
        activityRate,
        conversionRate,
        customersWithOrders,
        customersWithInvoices,
        monthlyData,
        topCustomersByOrders: topCustomersByOrders.map(customer => ({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          ordersCount: customer._count.orders,
          isActive: customer.isActive,
        })),
      },
    })
  } catch (error) {
    console.error('Error en GET /api/customers/stats:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
